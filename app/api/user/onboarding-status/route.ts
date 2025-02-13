import { authOptions } from '@/libs/next-auth';
import User from '@/models/User';
import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      console.warn('Unauthorized access attempt to onboarding status');
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email }).select(
      'onboardingComplete priceId email'
    );

    if (!user) {
      console.error('User not found in database:', session.user.email);
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    console.log('Onboarding status retrieved:', {
      email: user.email,
      onboardingComplete: user.onboardingComplete,
      hasPriceId: !!user.priceId,
    });

    return new Response(
      JSON.stringify({
        onboardingComplete: user.onboardingComplete || false,
        priceId: user.priceId || '',
      })
    );
  } catch (error) {
    console.error('Error in onboarding status:', {
      error: error.message,
      stack: error.stack,
    });
    return new Response(
      JSON.stringify({
        error: 'Internal Server Error- Stripe Onboarding Status',
        message: error.message,
      }),
      { status: 500 }
    );
  }
}
