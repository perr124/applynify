import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/libs/next-auth';
import { ObjectId } from 'mongodb';
import { connectMongo } from '@/libs/connectMongo';

export async function GET(req: Request, { params }: { params: { userId: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await connectMongo();
    const usersCollection = client!.db().collection('users');

    const user = await usersCollection.findOne(
      { _id: new ObjectId(params.userId) },
      {
        projection: {
          _id: 1,
          firstName: 1,
          lastName: 1,
          email: 1,
          applicationsStatus: 1,
          resumes: 1,
          jobPreferences: 1,
          experience: 1,
          availability: 1,
        },
      }
    );

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Failed to fetch user details' }, { status: 500 });
  }
}
