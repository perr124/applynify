import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/libs/next-auth';
import connectMongo from '@/libs/mongoose';
import Feedback from '@/models/Feedback';
import User from '@/models/User';
import { logAudit } from '@/libs/logger';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectMongo();

    const body = await req.json();
    const rating = body?.rating as 'sad' | 'mid' | 'happy' | undefined;
    const notes = (body?.notes as string | undefined)?.slice(0, 2000);

    if (!rating || !['sad', 'mid', 'happy'].includes(rating)) {
      return NextResponse.json({ error: 'Invalid rating' }, { status: 400 });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const doc = await Feedback.create({
      userId: user._id,
      email: user.email,
      rating,
      notes,
    });

    logAudit('feedback_created', { userId: user._id?.toString(), rating });

    return NextResponse.json({ ok: true, id: doc.id });
  } catch (e) {
    console.error('Feedback create error', { error: e });
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
