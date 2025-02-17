import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import User from '@/models/User';
import connectMongo from '@/libs/mongoose';
import { authOptions } from '@/libs/next-auth';

export async function POST(req: Request) {
  try {
    await connectMongo();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { markComplete = false } = body;

    const updateData: any = {};

    // If markComplete is true, set onboardingComplete to true
    if (markComplete) {
      updateData.onboardingComplete = true;
    }

    await User.updateOne({ email: session.user.email }, { $set: updateData });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in complete-onboarding:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
