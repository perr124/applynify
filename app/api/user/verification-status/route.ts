import { authOptions } from '@/libs/next-auth';
import User from '@/models/User';
import dbConnect from '@/libs/mongoose';
import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email });

    // If user logged in with Google, they're automatically verified
    const isGoogleUser = !user?.get('verificationToken');

    console.log('ssssUUU', user?.get('emailVerified'));
    console.log('ssssU66UU', user?.get('verificationToken'));
    return NextResponse.json({
      emailVerified: isGoogleUser || user?.get('emailVerified') || false,
    });
  } catch (error) {
    console.error('Error fetching verification status:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
