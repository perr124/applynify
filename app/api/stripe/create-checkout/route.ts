import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/libs/next-auth';
import { createCheckout } from '@/libs/stripe';
import { connectMongo } from '@/libs/connectMongo';
import User from '@/models/User';

// This function is used to create a Stripe Checkout Session (one-time payment or subscription)
// It's called by the <ButtonCheckout /> component
// By default, it doesn't force users to be authenticated. But if they are, it will prefill the Checkout data with their email and/or credit card
export async function POST(req: NextRequest) {
  try {
    await connectMongo();
    const body = await req.json();
    console.log('Received checkout request:', body); // Debug log

    if (!body.priceId) {
      return NextResponse.json({ error: 'Price ID is required' }, { status: 400 });
    } else if (!body.successUrl || !body.cancelUrl) {
      return NextResponse.json({ error: 'Success and cancel URLs are required' }, { status: 400 });
    } else if (!body.mode) {
      return NextResponse.json(
        {
          error:
            "Mode is required (either 'payment' for one-time payments or 'subscription' for recurring subscription)",
        },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);
    console.log('User session:', session); // Debug log

    const user = session?.user?.email ? await User.findOne({ email: session.user.email }) : null;
    console.log('Found user:', user?._id); // Debug log

    const { priceId, mode, successUrl, cancelUrl } = body;
    console.log(session?.user?.email, user, 'stripe user');
    const stripeSessionURL = await createCheckout({
      priceId,
      mode,
      successUrl,
      cancelUrl,
      // If user is logged in, it will pass the user ID to the Stripe Session so it can be retrieved in the webhook later
      clientReferenceId: user?._id?.toString(),
      // If user is logged in, this will automatically prefill Checkout data like email and/or credit card for faster checkout
      user,
      //@ts-ignore
      customer_email: session?.user?.email,
      // If you send coupons from the frontend, you can pass it here
      // couponId: body.couponId,
    });

    console.log('Created stripe session URL:', stripeSessionURL); // Debug log
    return NextResponse.json({ url: stripeSessionURL });
  } catch (e) {
    console.error('Checkout error:', e);
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}
