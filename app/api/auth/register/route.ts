import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { generateVerificationToken } from '@/libs/next-auth';
import { sendVerificationEmail } from '@/libs/mail';
import connectMongo from '@/libs/mongoose';
import mongoose from 'mongoose';
import { verifyRecaptchaToken } from '@/libs/recaptcha';

export async function POST(req: Request) {
  try {
    const { email, password, name, firstName, lastName, recaptchaToken } = await req.json();

    const isHuman = await verifyRecaptchaToken(recaptchaToken);
    if (!isHuman) {
      return NextResponse.json({ error: 'Human verification failed' }, { status: 400 });
    }

    console.log('Connecting to MongoDB...');
    await connectMongo();

    const db = mongoose.connection.db; // Use mongoose.connection.db instead

    const usersCollection = db.collection('users');

    // Check if user already exists
    console.log('Checking if user exists...');
    const existingUser = await usersCollection.findOne({ email });

    if (existingUser) {
      console.log('User already exists');
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    console.log('Creating new user...');
    // Hash the password
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
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
