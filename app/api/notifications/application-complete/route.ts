import { NextResponse } from 'next/server';
import { sendApplicationCompleteNotification } from '@/libs/mail';

export async function POST(request: Request) {
  try {
    const { userEmail, userFirstName } = await request.json();

    if (!userEmail || !userFirstName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await sendApplicationCompleteNotification(userEmail, userFirstName);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending application completion notification:', error);
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 });
  }
}
