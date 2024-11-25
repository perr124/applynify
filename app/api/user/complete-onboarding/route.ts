import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import User from '@/models/User';
import { authOptions } from '@/libs/next-auth';

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await User.updateOne({ email: session.user.email }, { $set: { onboardingComplete: true } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error completing onboarding:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
