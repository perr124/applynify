import { NextResponse } from 'next/server';
import { sendEmail } from '@/libs/mailgun';
import { verifyRecaptchaToken } from '@/libs/recaptcha';

export async function POST(request: Request) {
  try {
    const { name, email, subject, message, recaptchaToken } = await request.json();

    const isHuman = await verifyRecaptchaToken(recaptchaToken);
    if (!isHuman) {
      return NextResponse.json({ error: 'Human verification failed' }, { status: 400 });
    }

    await sendEmail({
      to: 'applynify@gmail.com',
      subject: `New Contact Form Submission: ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
      replyTo: email,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to send email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
