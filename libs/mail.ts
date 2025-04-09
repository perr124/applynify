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

export async function sendAdminMessageNotification(email: string, userFirstName: string) {
  const dashboardLink = `${process.env.NEXTAUTH_URL}/dashboard/messages`;

  await sendEmail({
    to: email,
    subject: 'New Message from Applynify Admin',
    text: `Hello ${userFirstName}, you have received a new message from Admin. Please log in to your dashboard to view and respond to this message.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">New Message from Admin</h2>
        <p>Hello ${userFirstName},</p>
        <p>You have received a new message from Admin.</p>
        <p>Please log in to your dashboard to view and respond to this message.</p>
        <div style="margin: 20px 0;">
          <a href="${dashboardLink}" 
             style="background-color: #0c7543; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            View Message in Dashboard
          </a>
        </div>
        <p>If you have any questions, please don't hesitate to contact us.</p>
        <p>Best regards,<br>Applynify Support</p>
      </div>
    `,
  });
}
