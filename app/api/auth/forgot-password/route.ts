import { NextResponse } from 'next/server';
import { generatePasswordResetToken } from '@/libs/next-auth';
import { sendPasswordResetEmail } from '@/libs/mail';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    const token = await generatePasswordResetToken(email);

    console.log('token', token);
    // Send the reset email
    await sendPasswordResetEmail(email, token);
    console.log('email sent');

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
