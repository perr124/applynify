import { NextResponse } from 'next/server';
import connectMongo from '@/libs/mongo';
import bcrypt from 'bcrypt';
import { generateVerificationToken } from '@/libs/next-auth';
import { sendVerificationEmail } from '@/libs/mail';

export async function POST(req: Request) {
  try {
    const { email, password, name, firstName, lastName } = await req.json();
    const client = await connectMongo;
    const usersCollection = client!.db().collection('users');

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    console.log('Creating new user...');
    // Create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    await usersCollection.insertOne({
      email,
      password: hashedPassword,
      name,
      firstName,
      lastName,
      emailVerified: false,
      createdAt: new Date(),
    });

    console.log('Generating verification token...');
    // Generate and send verification token
    const verificationToken = await generateVerificationToken(email);

    console.log('Sending verification email...');
    try {
      await sendVerificationEmail(email, verificationToken);
      console.log('Verification email sent successfully');
    } catch (emailError) {
      console.error('Error sending verification email:', emailError);
      // Still create the user but log the email error
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
