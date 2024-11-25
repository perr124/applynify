import { authOptions } from '@/libs/next-auth';
import User from '@/models/User';
import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const user = await User.findOne({ email: session.user.email }, 'onboardingComplete');
    console.log(user, 'onbbbb1');
    console.log(user?.get('onboardingComplete'), 'onbbbb'); // Use get() method

    return NextResponse.json({ onboardingComplete: user?.get('onboardingComplete') || false });
  } catch (error) {
    console.error('Error fetching onboarding status:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
