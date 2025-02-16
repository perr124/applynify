import { NextResponse } from 'next/server';
import connectMongo from '@/libs/mongo';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/libs/next-auth';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is admin
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';

    const client = await connectMongo;
    const usersCollection = client!.db().collection('users');

    // Create search query
    const query = search
      ? {
          $or: [
            { email: { $regex: search, $options: 'i' } },
            { firstName: { $regex: search, $options: 'i' } },
            { lastName: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    const users = await usersCollection
      .find(query)
      .project({
        _id: 1,
        email: 1,
        firstName: 1,
        lastName: 1,
      })
      .limit(50)
      .toArray();

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error in admin users API:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
