import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/libs/next-auth';
import dbConnect from '@/libs/mongoose';
import User from '@/models/User';

export async function GET() {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email }).select('+password');

    // Check if user has password authentication
    const hasPasswordAuth = !!user?.password;

    return NextResponse.json({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      notifications: user?.notifications || {
        email: true,
        jobAlerts: true,
        marketing: false,
      },
      hasPasswordAuth,
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      {
        $set: {
          firstName: data.firstName,
          lastName: data.lastName,
          notifications: data.notifications,
        },
      },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Settings updated successfully',
    });
  } catch (error) {
    console.error('Error updating user settings:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
