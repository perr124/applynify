import { authOptions } from '@/libs/next-auth';
import User from '@/models/User';
import connectMongo from '@/libs/mongoose';
import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectMongo();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ emailVerified: false });
    }

    // Detect OAuth account (e.g., Google) via NextAuth accounts collection
    const accountsCollection = mongoose.connection.db.collection('accounts');
    const oauthAccount = await accountsCollection.findOne({
      userId: user._id,
      provider: 'google',
    });

    const isVerified = Boolean(oauthAccount) || Boolean(user?.get('emailVerified'));

    // If user is OAuth (e.g., Google) and emailVerified isn't set, persist it once
    if (oauthAccount && !user.get('emailVerified')) {
      await User.updateOne({ _id: user._id }, { $set: { emailVerified: true } });
    }

    return NextResponse.json({ emailVerified: isVerified });
  } catch (error) {
    console.error('Error fetching verification status:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
