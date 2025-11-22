const RECAPTCHA_VERIFY_ENDPOINT = 'https://www.google.com/recaptcha/api/siteverify';

type RecaptchaVerifyResponse = {
  success: boolean;
  score?: number;
  action?: string;
  challenge_ts?: string;
  hostname?: string;
  'error-codes'?: string[];
};

/**
 * Verify a Google reCAPTCHA token server-side.
 * Returns true only when the verification succeeds AND (when available) the score is above the provided threshold.
 */
export async function verifyRecaptchaToken(
  token: string | null,
  { minimumScore = 0.5 }: { minimumScore?: number } = {},
): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;

  if (!secret) {
    console.error('RECAPTCHA_SECRET_KEY is not set');
    return false;
  }

  if (!token) {
    console.warn('Missing reCAPTCHA token');
    return false;
  }

  try {
    const params = new URLSearchParams();
    params.append('secret', secret);
    params.append('response', token);

    const response = await fetch(RECAPTCHA_VERIFY_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      console.error('Failed to reach reCAPTCHA verify endpoint', response.statusText);
      return false;
    }

    const data = (await response.json()) as RecaptchaVerifyResponse;

    if (!data.success) {
      console.warn('reCAPTCHA verification failed', data['error-codes']);
      return false;
    }

    if (typeof data.score === 'number') {
      return data.score >= minimumScore;
    }

    return true;
  } catch (error) {
    console.error('Error while verifying reCAPTCHA token', error);
    return false;
  }
}

export function isRecaptchaEnabled(): boolean {
  return Boolean(process.env.RECAPTCHA_SECRET_KEY);
}

