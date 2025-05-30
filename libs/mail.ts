import { sendEmail } from './mailgun';
import config from '@/config';

const logoUrl = `${process.env.NEXTAUTH_URL}/icon.png`;

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetLink = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;

  await sendEmail({
    to: email,
    subject: 'Reset your password',
    text: `Click the following link to reset your password: ${resetLink}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; text-align: center;">
        <img src="${logoUrl}" alt="Logo" style="max-width: 100px; margin-bottom: 20px;" />
        <h1>Reset your password</h1>
        <p>Click the following link to reset your password:</p>
        <p><a href="${resetLink}">${resetLink}</a></p>
      </div>
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
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; text-align: left; border: 1px solid #ccc; padding: 20px; border-radius: 8px;">
      <img src="${logoUrl}" alt="Logo" style="max-width: 100px; margin-bottom: 20px; display: block; margin-left: auto; margin-right: auto;" />
      <h1>Verify your email</h1>
      <p>Click the link below to verify your email address:</p>
      <a href="${verificationUrl}" style="display: inline-block; margin-top: 10px;">Verify Email</a>
    </div>
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
  const messagesLink = `${process.env.NEXTAUTH_URL}/dashboard/messages`;

  await sendEmail({
    to: email,
    subject: 'New Message from Applynify Admin',
    text: `Hello ${userFirstName}, you have received a new message from Admin. Please log in to your dashboard to view and respond to this message.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; text-align: left; border: 1px solid #ccc; padding: 20px; border-radius: 8px;">
        <img src="${logoUrl}" alt="Logo" style="max-width: 100px; margin-bottom: 20px; display: block; margin-left: auto; margin-right: auto;" />
        <h2 style="color: #333;">New Message from Admin</h2>
        <p>Hello ${userFirstName},</p>
        <p>You have received a new message from Admin.</p>
        <p>Please log in to your dashboard to view and respond to this message.</p>
        <div style="margin: 20px 0;">
          <a href="${messagesLink}" 
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

export async function sendApplicationCompleteNotification(email: string, userFirstName: string) {
  const applicationsLink = `${process.env.NEXTAUTH_URL}/dashboard/applications`;

  await sendEmail({
    to: email,
    subject: 'Your Applications Have Been Completed',
    text: `Hello ${userFirstName}, your job applications have been completed and submitted. Please log in to your dashboard to view the status.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; text-align: left; border: 1px solid #ccc; padding: 20px; border-radius: 8px;">
        <img src="${logoUrl}" alt="Logo" style="max-width: 100px; margin-bottom: 20px; display: block; margin-left: auto; margin-right: auto;" />
        <h2 style="color: #333;">Applications Completed</h2>
        <p>Hello ${userFirstName},</p>
        <p>All your job applications have been completed and submitted successfully.</p>
        <p>You can track the progress and status in your dashboard.</p>
        <div style="margin: 20px 0;">
          <a href="${applicationsLink}" 
             style="background-color: #0c7543; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            View Applications in Dashboard
          </a>
        </div>
        <p>If you have any questions about your applications, please don't hesitate to contact us.</p>
        <p>Best regards,<br>Applynify Support</p>
      </div>
    `,
  });
}

export async function sendPaymentConfirmationEmail(email: string, userFirstName: string) {
  const dashboardLink = `${process.env.NEXTAUTH_URL}/dashboard`;

  await sendEmail({
    to: email,
    subject: 'Thank You for Your Purchase',
    text: `Hello ${userFirstName}, thank you for your purchase. We are working on your order and will notify you once it's complete.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; text-align: left; border: 1px solid #ccc; padding: 20px; border-radius: 8px;">
        <img src="${logoUrl}" alt="Logo" style="max-width: 100px; margin-bottom: 20px; display: block; margin-left: auto; margin-right: auto;" />
        <h2 style="color: #333;">Thank You for Your Purchase</h2>
        <p>Hello ${userFirstName},</p>
        <p>Thank you for your purchase. We are working on your order and will notify you once it's complete.</p>
        <div style="margin: 20px 0;">
          <a href="${dashboardLink}" 
             style="background-color: #0c7543; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            View Your Dashboard
          </a>
        </div>
        <p>If you have any questions, please don't hesitate to contact us.</p>
        <p>Best regards,<br>Applynify Support</p>
      </div>
    `,
  });
}
