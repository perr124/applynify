// Toggle via STRIPE_TEST_MODE to force test prices regardless of NODE_ENV/VERCEL_ENV.
const isTestMode =
  (process.env.STRIPE_TEST_MODE || '').toLowerCase() === 'true' ||
  process.env.STRIPE_TEST_MODE === '1';

// Prefer LIVE vs TEST depending on toggle; always fallback if none present.
const pickPrice = (liveKey: string, testKey: string, fallback: string) => {
  if (isTestMode) {
    return process.env[testKey] || process.env[liveKey] || fallback;
  }
  return process.env[liveKey] || process.env[testKey] || fallback;
};

export const STRIPE_PRICE_IDS = {
  LITE: {
    US: pickPrice(
      'STRIPE_PRICE_LITE_US',
      'STRIPE_TEST_PRICE_LITE_US',
      'price_1R8OigDnSxQsct78i9GMR46f'
    ),
    GB: pickPrice(
      'STRIPE_PRICE_LITE_GB',
      'STRIPE_TEST_PRICE_LITE_GB',
      'price_1R8nmGDnSxQsct78DoqpsN2u'
    ),
    EU: pickPrice(
      'STRIPE_PRICE_LITE_EU',
      'STRIPE_TEST_PRICE_LITE_EU',
      'price_1R8OigDnSxQsct78i9GMR46f'
    ),
    CA: pickPrice(
      'STRIPE_PRICE_LITE_CA',
      'STRIPE_TEST_PRICE_LITE_CA',
      'price_1R8OigDnSxQsct78i9GMR46f'
    ),
    AU: pickPrice(
      'STRIPE_PRICE_LITE_AU',
      'STRIPE_TEST_PRICE_LITE_AU',
      'price_1R8OigDnSxQsct78i9GMR46f'
    ),
  },
  PRO: {
    US: pickPrice(
      'STRIPE_PRICE_PRO_US',
      'STRIPE_TEST_PRICE_PRO_US',
      'price_1R8OhODnSxQsct78eGw7xRiE'
    ),
    GB: pickPrice(
      'STRIPE_PRICE_PRO_GB',
      'STRIPE_TEST_PRICE_PRO_GB',
      'price_1R8nlBDnSxQsct78rGW76kiF'
    ),
    EU: pickPrice(
      'STRIPE_PRICE_PRO_EU',
      'STRIPE_TEST_PRICE_PRO_EU',
      'price_1R8OhODnSxQsct78eGw7xRiE'
    ),
    CA: pickPrice(
      'STRIPE_PRICE_PRO_CA',
      'STRIPE_TEST_PRICE_PRO_CA',
      'price_1R8OhODnSxQsct78eGw7xRiE'
    ),
    AU: pickPrice(
      'STRIPE_PRICE_PRO_AU',
      'STRIPE_TEST_PRICE_PRO_AU',
      'price_1R8OhODnSxQsct78eGw7xRiE'
    ),
  },
} as const;

// Helper function to get the correct price ID based on plan and region
export const getStripePriceId = (
  plan: keyof typeof STRIPE_PRICE_IDS,
  regionCode: keyof typeof STRIPE_PRICE_IDS.LITE
) => {
  return STRIPE_PRICE_IDS[plan][regionCode];
};
