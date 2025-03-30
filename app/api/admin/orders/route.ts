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
    const search = searchParams.get('search');

    await connectMongo();

    // If searching, fetch more results to ensure we have enough after filtering
    const fetchLimit = search ? Math.min(limit * 3, 100) : limit;

    // Fetch paginated payment intents from Stripe
    const paymentIntents = await stripe.paymentIntents.list({
      limit: fetchLimit,
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
    let orders = paymentIntents.data.map((payment) => {
      const user = userMap.get(payment.customer as string);
      return {
        id: payment.id,
        amount: payment.amount / 100,
        status: payment.status,
        created: new Date(payment.created * 1000).toISOString(),
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

    // Apply search filter if search parameter is provided
    if (search) {
      const searchLower = search.toLowerCase();
      orders = orders.filter(
        (order) =>
          order.id.toLowerCase().includes(searchLower) ||
          order.customer.email.toLowerCase().includes(searchLower) ||
          order.customer.name.toLowerCase().includes(searchLower)
      );

      // If we're searching and don't have enough results, try to fetch more
      if (orders.length < limit && paymentIntents.has_more) {
        const nextPaymentIntents = await stripe.paymentIntents.list({
          limit: fetchLimit,
          starting_after: paymentIntents.data[paymentIntents.data.length - 1].id,
          expand: ['data.latest_charge'],
        });

        const nextCustomerIds = Array.from(
          new Set(
            nextPaymentIntents.data
              .map((payment) => payment.customer)
              .filter((id): id is string => id !== null)
          )
        );

        const nextUsers = await User.find({ customerId: { $in: nextCustomerIds } });
        const nextUserMap = new Map(nextUsers.map((user) => [user.customerId, user]));

        const nextOrders = nextPaymentIntents.data.map((payment) => {
          const user = nextUserMap.get(payment.customer as string);
          return {
            id: payment.id,
            amount: payment.amount / 100,
            status: payment.status,
            created: new Date(payment.created * 1000).toISOString(),
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

        const filteredNextOrders = nextOrders.filter(
          (order) =>
            order.id.toLowerCase().includes(searchLower) ||
            order.customer.email.toLowerCase().includes(searchLower) ||
            order.customer.name.toLowerCase().includes(searchLower)
        );

        orders = [...orders, ...filteredNextOrders];
      }
    }

    // Limit the results to the requested page size
    orders = orders.slice(0, limit);

    // Get the last payment intent ID for next page
    const lastPaymentIntent = paymentIntents.data[paymentIntents.data.length - 1];

    // Calculate total count for search results
    let totalCount = null;
    if (!startingAfter) {
      if (search) {
        // For search results, we'll use the length of filtered results
        totalCount = orders.length;
      } else {
        const countResult = await stripe.paymentIntents.list({
          limit: 100,
        });
        totalCount = countResult.data.length;
      }
    }

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
