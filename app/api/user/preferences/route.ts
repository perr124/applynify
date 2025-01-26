// app/api/user/preferences/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/libs/next-auth';
import User from '@/models/User';
import connectMongo from '@/libs/mongoose';
import { PreferencesData, validatePreferences } from '@/libs/validations/userPreferences';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    console.log('preee sesh here');
    const data: PreferencesData = await req.json();

    // const validation = validatePreferences(data);
    // if (!validation.valid) {
    //   return new NextResponse(JSON.stringify({ success: false, errors: validation.errors }), {
    //     status: 400,
    //     headers: { 'Content-Type': 'application/json' },
    //   });
    // }

    const { jobPreferences, experience, availability } = data;

    await connectMongo();

    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      {
        $set: {
          jobPreferences,
          experience,
          availability,
          onboardingComplete: true,
        },
      },
      {
        new: true,
        strict: false,
        select: 'jobPreferences experience availability onboardingComplete email name image',
      }
    );
    console.log('preee sesh here2', {
      jobPreferences,
      experience,
      availability,
      onboardingComplete: true,
    });

    if (!updatedUser) {
      return new NextResponse('User not found', { status: 404 });
    }
    console.log('preee sesh here3');

    return NextResponse.json({
      success: true,
      user: updatedUser.toJSON(),
    });
  } catch (error) {
    console.error('Error saving preferences:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await connectMongo();

    const user = await User.findOne(
      { email: session.user.email },
      'jobPreferences experience availability onboardingComplete email name image'
    );

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    return NextResponse.json(user.toJSON());
  } catch (error) {
    console.error('Error fetching preferences:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
