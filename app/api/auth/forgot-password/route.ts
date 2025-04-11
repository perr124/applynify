import { NextResponse } from 'next/server';
import { generatePasswordResetToken } from '@/libs/next-auth';
import { sendPasswordResetEmail } from '@/libs/mail';
import connectMongo from '@/libs/mongoose';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    // Connect to MongoDB
    await connectMongo();

    // Find the user and explicitly select the password field
    const user = await User.findOne({ email }).select('+password');
    console.log('user', user);

    if (!user) {
      return NextResponse.json({ error: 'No account found with this email' }, { status: 404 });
    }

    // Check if user signed up with Google Auth (no password field)
    if (!user.password) {
      return NextResponse.json(
        {
          error:
            'This account was created using Google Sign-In. Please sign in with Google instead.',
          isGoogleUser: true,
        },
        { status: 400 }
      );
    }

    const token = await generatePasswordResetToken(email);
    await sendPasswordResetEmail(email, token);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
