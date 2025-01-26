import { NextResponse } from 'next/server';
import { verifyEmail } from '@/libs/next-auth';

export async function POST(req: Request) {
  try {
    const { token } = await req.json();
    await verifyEmail(token);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid verification token' }, { status: 400 });
  }
}
