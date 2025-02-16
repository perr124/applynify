import { NextResponse } from 'next/server';
import connectMongo from '@/libs/mongo';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/libs/next-auth';
import { ObjectId } from 'mongodb';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { applications, userId, applicationComplete } = await req.json();
    const client = await connectMongo;
    const usersCollection = client!.db().collection('users');

    // Replace the entire appliedRoles array and update completion status
    const result = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          appliedRoles: applications.map((app: any) => ({
            ...app,
            status: applicationComplete ? 'completed' : 'draft',
            appliedAt: app.appliedAt || new Date(),
          })),
          // Set both flags when completing applications
          ...(applicationComplete && {
            applicationsStatus: 'completed',
            appliedRolesComplete: true,
          }),
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
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const client = await connectMongo;
    const usersCollection = client!.db().collection('users');

    const user = await usersCollection.findOne(
      { _id: new ObjectId(userId) },
      { projection: { appliedRoles: 1 } }
    );

    return NextResponse.json(user?.appliedRoles || []);
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
  }
}
