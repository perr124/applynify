import { sendEmail } from './mailgun';
import config from '@/config';

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetLink = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;

  await sendEmail({
    to: email,
    subject: 'Reset your password',
    text: `Click the following link to reset your password: ${resetLink}`,
    html: `
      <p>Click the following link to reset your password:</p>
      <p><a href="${resetLink}">${resetLink}</a></p>
    `,
  });
}

export async function sendVerificationEmail(email: string, token: string) {
  if (!process.env.NEXTAUTH_URL) {
    console.error('NEXTAUTH_URL environment variable is not set');
    throw new Error('Missing NEXTAUTH_URL configuration');
  }

  const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify?token=${token}`;
  console.log('Verification URL:', verificationUrl);

  const html = `
    <h1>Verify your email</h1>
    <p>Click the link below to verify your email address:</p>
    <a href="${verificationUrl}">Verify Email</a>
  `;

  try {
    await sendEmail({
      to: email,
      subject: 'Verify your email',
      html,
    });
    console.log('Email sent successfully to:', email);
  } catch (error) {
    console.error('Error in sendVerificationEmail:', error);
    throw error;
  }
}
