import { NextResponse } from 'next/server';
import { resetPassword } from '@/libs/next-auth';

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();
    await resetPassword(token, password);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid or expired reset token' }, { status: 400 });
  }
}
