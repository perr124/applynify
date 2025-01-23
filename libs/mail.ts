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
