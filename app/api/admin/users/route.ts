import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/libs/next-auth';
import connectMongo from '@/libs/mongoose';
import User from '@/models/User';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is admin
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';

    await connectMongo();

    const query = search
      ? {
          $or: [
            { email: { $regex: search, $options: 'i' } },
            { firstName: { $regex: search, $options: 'i' } },
            { lastName: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    const users = await User.find(query)
      .select('id email firstName lastName createdAt resumeUrl preferences jobPreferences skills')
      .sort({ createdAt: -1 })
      .limit(50);

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error in admin users API:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
