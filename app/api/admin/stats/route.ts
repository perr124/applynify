import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/libs/next-auth';
import stripe from '@/libs/stripe';
import connectMongo from '@/libs/mongoose';
import User from '@/models/User';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is admin
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectMongo();

    // Get total users count
    const totalUsers = await User.countDocuments();

    // Get total orders and revenue from Stripe
    const paymentIntents = await stripe.paymentIntents.list({
      limit: 100,
      expand: ['data.latest_charge'],
    });

    const totalOrders = paymentIntents.data.length;
    const totalRevenue =
      paymentIntents.data.reduce((sum, payment) => sum + payment.amount, 0) / 100;

    // Get recent orders (last 24 hours)
    const oneDayAgo = Math.floor(Date.now() / 1000) - 24 * 60 * 60;
    const recentOrders = paymentIntents.data.filter(
      (payment) => payment.created >= oneDayAgo
    ).length;

    return NextResponse.json({
      totalUsers,
      totalOrders,
      totalRevenue,
      recentOrders,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
