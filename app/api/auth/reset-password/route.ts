import { NextResponse } from 'next/server';
import { resetPassword } from '@/libs/next-auth';

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    // Server-side password validation to mirror client rules
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    if (
      !password ||
      password.length < minLength ||
      !hasUpperCase ||
      !hasLowerCase ||
      !hasNumbers ||
      !hasSpecialChar
    ) {
      return NextResponse.json(
        { error: 'Password does not meet complexity requirements' },
        { status: 400 }
      );
    }

    await resetPassword(token, password);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid or expired reset token' }, { status: 400 });
  }
}
