import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/libs/next-auth';
import connectMongo from '@/libs/mongoose';
import User from '@/models/User';

interface UserDocument {
  _id: any;
  email: string;
  firstName: string;
  lastName: string;
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if the user is an admin
    const adminUser = await User.findOne({ email: session.user.email });
    if (!adminUser?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectMongo();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const withMessages = searchParams.get('withMessages') === 'true';

    // Build base query
    let baseQuery = {};
    if (withMessages) {
      baseQuery = {
        messages: { $exists: true, $not: { $size: 0 } },
      };
    }

    // Add search filter if provided
    const searchQuery = search
      ? {
          $or: [
            { firstName: { $regex: search, $options: 'i' } },
            { lastName: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    // Combine queries
    const finalQuery = {
      $and: [baseQuery, searchQuery],
    };

    // Find users with combined query
    const users = await User.find(finalQuery)
      .select('_id firstName lastName email messages')
      .sort(withMessages ? { 'messages.createdAt': -1 } : { createdAt: -1 });

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
