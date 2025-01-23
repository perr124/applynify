import { NextResponse } from 'next/server';
import connectMongo from '@/libs/mongo';
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();
    const client = await connectMongo;
    const usersCollection = client!.db().collection('users');

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    await usersCollection.insertOne({
      email,
      password: hashedPassword,
      name,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
