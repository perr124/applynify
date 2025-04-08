import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/libs/next-auth';
import connectMongo from '@/libs/mongoose';
import User from '@/models/User';
import mongoose from 'mongoose';

// Define an interface for the expected structure of a lean user object with messages
interface LeanUserWithMessage {
  _id: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  applicationsStatus?: string;
  resumes?: any[]; // Use appropriate type if defined elsewhere
  jobPreferences?: any; // Use appropriate type if defined elsewhere
  experience?: any; // Use appropriate type if defined elsewhere
  availability?: any; // Use appropriate type if defined elsewhere
  priceId?: string;
  marketingSource?: string;
  localization?: string;
  messages?: {
    // Define the structure of messages
    from: 'admin' | 'user';
    read: boolean;
    // Include other fields if needed for other logic, otherwise keep minimal
  }[];
}

export async function GET(req: Request, { params }: { params: { userId: string } }) {
  try {
    await connectMongo();

    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Cast the result of lean() to our defined interface
    const user = await User.findById(params.userId)
      .select(
        'firstName lastName email applicationsStatus resumes jobPreferences experience availability priceId marketingSource localization messages'
      )
      .lean<LeanUserWithMessage>(); // Apply the type here

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check for unread messages from the user
    let hasUnreadMessages = false;
    // Now TypeScript knows about user.messages and its type
    if (user.messages && Array.isArray(user.messages)) {
      hasUnreadMessages = user.messages.some((message) => message.from === 'user' && !message.read);
    }

    const transformedUser = {
      // Explicitly list fields to return, excluding messages if not needed
      id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      applicationsStatus: user.applicationsStatus,
      resumes: user.resumes,
      jobPreferences: user.jobPreferences,
      experience: user.experience,
      availability: user.availability,
      priceId: user.priceId,
      marketingSource: user.marketingSource,
      localization: user.localization,
      hasUnreadMessages: hasUnreadMessages,
    };

    return NextResponse.json(transformedUser);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Failed to fetch user details' }, { status: 500 });
  }
}
