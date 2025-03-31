import { NextResponse, NextRequest } from 'next/server';
import { sendEmail } from '@/libs/mailgun';
import config from '@/config';
import crypto from 'crypto';

// This route is used to receive emails from Mailgun and forward them to our customer support email.
// See more: https://shipfa.st/docs/features/emails
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const signingKey = process.env.MAILGUN_SIGNING_KEY;

    // Get form data with null checks
    const timestamp = formData.get('timestamp');
    const token = formData.get('token');
    const signature = formData.get('signature');

    // Validate required fields
    if (!timestamp || !token || !signature || !signingKey) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Now TypeScript knows these values are not null
    const timestampStr = timestamp.toString();
    const tokenStr = token.toString();
    const signatureStr = signature.toString();

    const value = timestampStr + tokenStr;
    const hash = crypto.createHmac('sha256', signingKey).update(value).digest('hex');

    if (hash !== signatureStr) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // extract the sender, subject and email content with null checks
    const sender = formData.get('From');
    const subject = formData.get('Subject');
    const html = formData.get('body-html');

    // send email to the admin if forwardRepliesTo is set & all required data exists.
    if (config.mailgun.forwardRepliesTo && html && subject && sender) {
      await sendEmail({
        to: config.mailgun.forwardRepliesTo,
        subject: `${config?.appName} | ${subject}`,
        html: `<div><p><b>- Subject:</b> ${subject}</p><p><b>- From:</b> ${sender}</p><p><b>- Content:</b></p><div>${html}</div></div>`,
        replyTo: String(sender),
      });
    }

    return NextResponse.json({});
  } catch (e) {
    const error = e as Error;
    console.error(error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
