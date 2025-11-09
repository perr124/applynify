// Use NODE_ENV to choose live vs test prices
const isProd = process.env.NODE_ENV === 'production';

// Prefer LIVE in production, TEST in development/preview; fallback to hardcoded ID
const pickPrice = (liveKey: string, testKey: string, fallback: string) => {
  if (isProd) {
    return process.env[liveKey] || process.env[testKey] || fallback;
  }
  return process.env[testKey] || process.env[liveKey] || fallback;
};

export const STRIPE_PRICE_IDS = {
  LITE: {
    US: pickPrice(
      'NEXT_PUBLIC_STRIPE_PRICE_LITE_US',
      'NEXT_PUBLIC_STRIPE_TEST_PRICE_LITE_US',
      'price_1R8OigDnSxQsct78i9GMR46f'
    ),
    GB: pickPrice(
      'NEXT_PUBLIC_STRIPE_PRICE_LITE_GB',
      'NEXT_PUBLIC_STRIPE_TEST_PRICE_LITE_GB',
      'price_1R8nmGDnSxQsct78DoqpsN2u'
    ),
    EU: pickPrice(
      'NEXT_PUBLIC_STRIPE_PRICE_LITE_EU',
      'NEXT_PUBLIC_STRIPE_TEST_PRICE_LITE_EU',
      'price_1R8OigDnSxQsct78i9GMR46f'
    ),
    CA: pickPrice(
      'NEXT_PUBLIC_STRIPE_PRICE_LITE_CA',
      'NEXT_PUBLIC_STRIPE_TEST_PRICE_LITE_CA',
      'price_1R8OigDnSxQsct78i9GMR46f'
    ),
    AU: pickPrice(
      'NEXT_PUBLIC_STRIPE_PRICE_LITE_AU',
      'NEXT_PUBLIC_STRIPE_TEST_PRICE_LITE_AU',
      'price_1R8OigDnSxQsct78i9GMR46f'
    ),
  },
  PRO: {
    US: pickPrice(
      'NEXT_PUBLIC_STRIPE_PRICE_PRO_US',
      'NEXT_PUBLIC_STRIPE_TEST_PRICE_PRO_US',
      'price_1R8OhODnSxQsct78eGw7xRiE'
    ),
    GB: pickPrice(
      'NEXT_PUBLIC_STRIPE_PRICE_PRO_GB',
      'NEXT_PUBLIC_STRIPE_TEST_PRICE_PRO_GB',
      'price_1R8nlBDnSxQsct78rGW76kiF'
    ),
    EU: pickPrice(
      'NEXT_PUBLIC_STRIPE_PRICE_PRO_EU',
      'NEXT_PUBLIC_STRIPE_TEST_PRICE_PRO_EU',
      'price_1R8OhODnSxQsct78eGw7xRiE'
    ),
    CA: pickPrice(
      'NEXT_PUBLIC_STRIPE_PRICE_PRO_CA',
      'NEXT_PUBLIC_STRIPE_TEST_PRICE_PRO_CA',
      'price_1R8OhODnSxQsct78eGw7xRiE'
    ),
    AU: pickPrice(
      'NEXT_PUBLIC_STRIPE_PRICE_PRO_AU',
      'NEXT_PUBLIC_STRIPE_TEST_PRICE_PRO_AU',
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
