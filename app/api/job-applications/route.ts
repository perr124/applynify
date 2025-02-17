import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/libs/next-auth';
import connectMongo from '@/libs/mongoose';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { applications, userId, applicationComplete } = await req.json();
    await connectMongo();

    const result = await User.updateOne(
      { _id: userId },
      {
        $set: {
          appliedRoles: applications.map((app: any) => ({
            ...app,
            status: applicationComplete ? 'completed' : 'draft',
            appliedAt: app.appliedAt || new Date(),
          })),
          ...(applicationComplete && { applicationsStatus: 'completed' }),
        },
      }
    );

    if (!result.modifiedCount) {
      return NextResponse.json({ error: 'Failed to update user' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in job applications API:', error);
    return NextResponse.json({ error: 'Failed to save applications' }, { status: 500 });
  }
}

// Add this to get user's applications
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectMongo();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    const query = userId && session.user.isAdmin ? { _id: userId } : { email: session.user.email };

    const user = await User.findOne(query).select('appliedRoles');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const applications = user.appliedRoles || [];
    applications.sort(
      (a: any, b: any) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()
    );

    return NextResponse.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
  }
}
