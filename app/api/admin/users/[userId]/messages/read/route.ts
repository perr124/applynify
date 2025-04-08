import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/libs/next-auth'; // Assuming admin auth uses the same options
import User from '@/models/User';
import connectMongo from '@/libs/mongoose';
import mongoose from 'mongoose';

// Define a type for the message subdocument for clarity
interface MessageSubdocument extends mongoose.Document {
  from: 'admin' | 'user';
  content: string;
  read: boolean;
  createdAt: Date;
  _id: mongoose.Types.ObjectId; // Mongoose subdocuments have _id
}

interface Context {
  params: {
    userId: string;
  };
}

export async function PATCH(request: Request, context: Context) {
  const { userId } = context.params;

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return NextResponse.json({ error: 'Invalid User ID' }, { status: 400 });
  }

  try {
    await connectMongo();

    // --- Admin Check ---
    // Ensure the calling user is an admin (implement your admin check logic here)
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized: Not logged in' }, { status: 401 });
    }
    const adminUser = await User.findOne({ email: session.user.email });
    if (!adminUser?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized: Not an admin' }, { status: 403 });
    }
    // --- End Admin Check ---

    const targetUser = await User.findById(userId);

    if (!targetUser) {
      return NextResponse.json({ error: 'Target user not found' }, { status: 404 });
    }

    // Update read status for all messages FROM the user
    let updatePerformed = false;
    targetUser.messages.forEach((message: MessageSubdocument) => {
      if (message.from === 'user' && !message.read) {
        message.read = true;
        updatePerformed = true;
      }
    });

    // Only save if an update was actually performed
    if (updatePerformed) {
      await targetUser.save();
      return NextResponse.json({ success: true, message: 'User messages marked as read.' });
    } else {
      return NextResponse.json({ success: true, message: 'No unread user messages found.' });
    }
  } catch (error) {
    console.error('Error marking user messages as read:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
