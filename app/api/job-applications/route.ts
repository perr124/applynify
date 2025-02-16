import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/libs/next-auth';
import { ObjectId } from 'mongodb';
import { connectMongo } from '@/libs/connectMongo';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { applications, userId, applicationComplete } = await req.json();
    const client = await connectMongo();
    const usersCollection = client!.db().collection('users');

    // Update both appliedRoles and applicationsStatus
    const result = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          appliedRoles: applications.map((app: any) => ({
            ...app,
            status: applicationComplete ? 'completed' : 'draft',
            appliedAt: app.appliedAt || new Date(),
          })),
          // Set applicationsStatus to 'completed' when completing applications
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

    const client = await connectMongo();
    const usersCollection = client!.db().collection('users');

    // Get userId from URL params
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    // If userId is provided and user is admin, fetch that specific user's applications
    if (userId && session.user.isAdmin) {
      const user = await usersCollection.findOne(
        { _id: new ObjectId(userId) },
        { projection: { appliedRoles: 1 } }
      );

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      return NextResponse.json(user.appliedRoles || []);
    }

    // For regular users, fetch their own applications
    const user = await usersCollection.findOne(
      { email: session.user.email },
      { projection: { appliedRoles: 1 } }
    );

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Sort applications by date, newest first
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
