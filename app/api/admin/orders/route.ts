import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/libs/next-auth';
import stripe from '@/libs/stripe';
import connectMongo from '@/libs/mongoose';
import User from '@/models/User';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is admin
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get pagination parameters from URL
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const startingAfter = searchParams.get('starting_after');

    await connectMongo();

    // Fetch total count of payment intents if on first page
    let totalCount = null;
    if (!startingAfter) {
      // We can only approximate the total count as Stripe doesn't provide a direct count API
      // This will get the total count up to 100 (Stripe's maximum limit)
      // For a more accurate count in a production app, you might need to maintain your own counter
      const countResult = await stripe.paymentIntents.list({
        limit: 100,
      });
      totalCount = countResult.data.length;
    }

    // Fetch paginated payment intents from Stripe
    const paymentIntents = await stripe.paymentIntents.list({
      limit: limit,
      starting_after: startingAfter || undefined,
      expand: ['data.latest_charge'],
    });

    // Get all unique customer IDs from payment intents
    const customerIds = Array.from(
      new Set(
        paymentIntents.data
          .map((payment) => payment.customer)
          .filter((id): id is string => id !== null)
      )
    );

    // Fetch all users with these customer IDs
    const users = await User.find({ customerId: { $in: customerIds } });

    // Create a map of customer IDs to user details
    const userMap = new Map(users.map((user) => [user.customerId, user]));

    // Combine payment data with user details
    const orders = paymentIntents.data.map((payment) => {
      const user = userMap.get(payment.customer as string);
      return {
        id: payment.id,
        amount: payment.amount / 100, // Convert from cents to dollars
        status: payment.status,
        created: new Date(payment.created * 1000).toISOString(), // Store as ISO string for better date handling
        customer: {
          id: payment.customer,
          email: user?.email || 'Unknown',
          name: user?.name || 'Unknown',
        },
        paymentMethod: payment.payment_method_types[0],
        currency: payment.currency,
        description: payment.description,
      };
    });

    // Get the last payment intent ID for next page
    const lastPaymentIntent = paymentIntents.data[paymentIntents.data.length - 1];

    return NextResponse.json({
      orders,
      pagination: {
        hasMore: paymentIntents.has_more,
        nextCursor: lastPaymentIntent?.id,
        totalCount: totalCount,
      },
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
