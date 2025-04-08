import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/libs/next-auth';
import User from '@/models/User';
import connectMongo from '@/libs/mongoose';
import mongoose from 'mongoose';

// Define a type for the message subdocument for clarity
interface MessageSubdocument extends mongoose.Document {
  from: 'admin' | 'user';
  content: string;
  read: boolean;
  createdAt: Date;
  _id: mongoose.Types.ObjectId;
}

export async function PATCH(request: Request) {
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

    // Update read status for all messages FROM the admin
    let updatePerformed = false;
    user.messages.forEach((message: MessageSubdocument) => {
      if (message.from === 'admin' && !message.read) {
        message.read = true;
        updatePerformed = true;
      }
    });

    // Only save if an update was actually performed
    if (updatePerformed) {
      await user.save();
      return NextResponse.json({ success: true, message: 'Admin messages marked as read.' });
    } else {
      return NextResponse.json({ success: true, message: 'No unread admin messages found.' });
    }
  } catch (error) {
    console.error('Error marking admin messages as read:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
