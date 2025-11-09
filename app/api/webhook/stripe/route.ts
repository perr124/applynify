import { NextResponse, NextRequest } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import connectMongo from '@/libs/mongoose';
import configFile from '@/config';
import User from '@/models/User';
import { findCheckoutSession } from '@/libs/stripe';
import { sendPaymentConfirmationEmail } from '@/libs/mail';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-08-16',
  typescript: true,
});
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// This is where we receive Stripe webhook events
// It used to update the user data, send emails, etc...
// By default, it'll store the user in the database
// See more: https://shipfa.st/docs/features/payments
export async function POST(req: NextRequest) {
  await connectMongo();

  const body = await req.text();

  const signature = headers().get('stripe-signature');
  if (!signature || !webhookSecret) {
    return NextResponse.json(
      { error: 'Missing Stripe signature or webhook secret' },
      { status: 400 }
    );
  }

  let eventType;
  let event;

  // verify Stripe event is legit
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed', { message: err.message });
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  eventType = event.type;

  try {
    switch (eventType) {
      case 'checkout.session.completed': {
        // First payment is successful and a subscription is created (if mode was set to "subscription" in ButtonCheckout)
        // ✅ Grant access to the product
        const stripeObject: Stripe.Checkout.Session = event.data.object as Stripe.Checkout.Session;

        const session = await findCheckoutSession(stripeObject.id);
        console.debug('Retrieved checkout session', {
          sessionId: stripeObject.id,
          hasCustomer: !!session?.customer,
          hasLineItems: !!session?.line_items?.data?.length,
          priceId: session?.line_items?.data[0]?.price?.id,
        });

        // ISSUE: These could be undefined if session retrieval fails
        const customerId = session?.customer;
        const priceId = session?.line_items?.data[0]?.price?.id;
        const userId = stripeObject.client_reference_id;
        const plan = configFile.stripe.plans.find((p) => p.priceId === priceId);
        console.debug('Matched plan for price', { hasPlan: !!plan });

        // Add error handling and logging
        if (!session) {
          console.error('Failed to retrieve checkout session', { sessionId: stripeObject.id });
          throw new Error('Failed to retrieve checkout session');
        }

        if (!customerId) {
          console.error('No customer ID found in session', { sessionId: stripeObject.id });
          throw new Error('No customer ID found in session');
        }

        if (!priceId) {
          console.error('No price ID found in session', { sessionId: stripeObject.id });
          throw new Error('No price ID found in session');
        }

        const customer = (await stripe.customers.retrieve(customerId as string)) as Stripe.Customer;
        let user;

        // Get or create the user. userId is normally pass in the checkout session (clientReferenceID) to identify the user when we get the webhook event
        if (userId) {
          user = await User.findById(userId);
          if (!user) {
            throw new Error(`User not found with ID: ${userId}`);
          }
          console.debug('User found for client_reference_id', { userId: user?._id?.toString() });
        } else if (customer.email) {
          user = await User.findOne({ email: customer.email });

          if (!user) {
            user = await User.create({
              email: customer.email,
              name: customer.name,
            });

            await user.save();
          }
        } else {
          console.error('No user found for checkout session', { sessionId: stripeObject.id });
          throw new Error('No user found');
        }

        // Add extra validation before saving
        if (!priceId || !customerId) {
          console.error('Missing required fields before user save', {
            hasPriceId: !!priceId,
            hasCustomerId: !!customerId,
          });
          throw new Error('Missing required fields for user update');
        }

        // Update user data
        await User.findByIdAndUpdate(user._id, {
          priceId,
          customerId,
          hasAccess: true,
          onboardingComplete: true,
        });

        // Send payment confirmation email
        try {
          await sendPaymentConfirmationEmail(user.email, user.name || 'there');
          console.debug('Payment confirmation email sent successfully', {
            userId: user._id?.toString(),
          });
        } catch (emailError) {
          console.error('Failed to send payment confirmation email', { error: emailError });
          // Don't throw the error as the payment was successful, just log it
        }

        // Add success logging
        console.debug('Successfully updated user after payment', {
          userId: user._id,
          priceId,
          customerId,
        });

        break;
      }

      case 'checkout.session.expired': {
        // User didn't complete the transaction
        // You don't need to do anything here, by you can send an email to the user to remind him to complete the transaction, for instance
        break;
      }

      case 'customer.subscription.updated': {
        // The customer might have changed the plan (higher or lower plan, cancel soon etc...)
        // You don't need to do anything here, because Stripe will let us know when the subscription is canceled for good (at the end of the billing cycle) in the "customer.subscription.deleted" event
        // You can update the user data to show a "Cancel soon" badge for instance
        break;
      }

      case 'customer.subscription.deleted': {
        // The customer subscription stopped
        // ❌ Revoke access to the product
        const stripeObject: Stripe.Subscription = event.data.object as Stripe.Subscription;

        const subscription = await stripe.subscriptions.retrieve(stripeObject.id);
        const user = await User.findOne({ customerId: subscription.customer });

        // Revoke access to your product
        user.hasAccess = false;
        await user.save();

        break;
      }

      case 'invoice.paid': {
        // Customer just paid an invoice (for instance, a recurring payment for a subscription)
        // ✅ Grant access to the product

        const stripeObject: Stripe.Invoice = event.data.object as Stripe.Invoice;

        const priceId = stripeObject.lines.data[0].price?.id;
        const customerId = stripeObject.customer;

        if (!customerId || !priceId) break;
        const user = await User.findOne({ customerId });
        if (!user) break;

        // Make sure the invoice is for the same plan (priceId) the user subscribed to
        if (user.priceId !== priceId) break;

        // Grant user access to your product. It's a boolean in the database, but could be a number of credits, etc...
        user.hasAccess = true;
        await user.save();

        break;
      }

      case 'invoice.payment_failed':
        // A payment failed (for instance the customer does not have a valid payment method)
        // ❌ Revoke access to the product
        // ⏳ OR wait for the customer to pay (more friendly):
        //      - Stripe will automatically email the customer (Smart Retries)
        //      - We will receive a "customer.subscription.deleted" when all retries were made and the subscription has expired

        break;

      default:
      // Unhandled event type
    }
  } catch (e) {
    console.error('Stripe webhook error', { message: e.message });
  }

  return NextResponse.json({});
}
