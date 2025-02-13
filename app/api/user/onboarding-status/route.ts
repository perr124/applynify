import { authOptions } from '@/libs/next-auth';
import User from '@/models/User';
import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email }).select(
      'onboardingComplete priceId'
    );

    return new Response(
      JSON.stringify({
        onboardingComplete: user?.onboardingComplete || false,
        priceId: user?.priceId || '',
      })
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
