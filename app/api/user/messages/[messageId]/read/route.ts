import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/libs/next-auth';
import User from '@/models/User';
import connectMongo from '@/libs/mongoose';
import mongoose from 'mongoose';

interface Context {
  params: {
    messageId: string;
  };
}

export async function PATCH(request: Request, context: Context) {
  const { messageId } = context.params;

  if (!messageId || !mongoose.Types.ObjectId.isValid(messageId)) {
    return NextResponse.json({ error: 'Invalid Message ID' }, { status: 400 });
  }

  try {
    await connectMongo();

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Find the message and update its read status
    // Mongoose returns the updated subdocument by default with findByIdAndUpdate on the array element
    const message = user.messages.id(messageId);

    if (!message) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    if (message.read) {
      // Message is already read, no need to update
      return NextResponse.json({ success: true, message: 'Message already marked as read.' });
    }

    message.read = true;

    // Save the parent user document
    await user.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error marking message as read:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
