const isTestMode =
  (process.env.NEXT_PUBLIC_STRIPE_TEST_MODE || process.env.STRIPE_TEST_MODE || '')
    .toLowerCase()
    .trim() === 'true' ||
  process.env.NEXT_PUBLIC_STRIPE_TEST_MODE === '1' ||
  process.env.STRIPE_TEST_MODE === '1';

const ENV_PRICES = {
  LIVE: {
    STARTER: {
      US: process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER_US,
      GB: process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER_GB,
      EU: process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER_EU,
      CA: process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER_CA,
      AU: process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER_AU,
    },
    LITE: {
      US: process.env.NEXT_PUBLIC_STRIPE_PRICE_LITE_US,
      GB: process.env.NEXT_PUBLIC_STRIPE_PRICE_LITE_GB,
      EU: process.env.NEXT_PUBLIC_STRIPE_PRICE_LITE_EU,
      CA: process.env.NEXT_PUBLIC_STRIPE_PRICE_LITE_CA,
      AU: process.env.NEXT_PUBLIC_STRIPE_PRICE_LITE_AU,
    },
    PRO: {
      US: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_US,
      GB: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_GB,
      EU: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_EU,
      CA: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_CA,
      AU: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_AU,
    },
  },
  TEST: {
    STARTER: {
      US: process.env.NEXT_PUBLIC_STRIPE_TEST_PRICE_STARTER_US,
      GB: process.env.NEXT_PUBLIC_STRIPE_TEST_PRICE_STARTER_GB,
      EU: process.env.NEXT_PUBLIC_STRIPE_TEST_PRICE_STARTER_EU,
      CA: process.env.NEXT_PUBLIC_STRIPE_TEST_PRICE_STARTER_CA,
      AU: process.env.NEXT_PUBLIC_STRIPE_TEST_PRICE_STARTER_AU,
    },
    LITE: {
      US: process.env.NEXT_PUBLIC_STRIPE_TEST_PRICE_LITE_US,
      GB: process.env.NEXT_PUBLIC_STRIPE_TEST_PRICE_LITE_GB,
      EU: process.env.NEXT_PUBLIC_STRIPE_TEST_PRICE_LITE_EU,
      CA: process.env.NEXT_PUBLIC_STRIPE_TEST_PRICE_LITE_CA,
      AU: process.env.NEXT_PUBLIC_STRIPE_TEST_PRICE_LITE_AU,
    },
    PRO: {
      US: process.env.NEXT_PUBLIC_STRIPE_TEST_PRICE_PRO_US,
      GB: process.env.NEXT_PUBLIC_STRIPE_TEST_PRICE_PRO_GB,
      EU: process.env.NEXT_PUBLIC_STRIPE_TEST_PRICE_PRO_EU,
      CA: process.env.NEXT_PUBLIC_STRIPE_TEST_PRICE_PRO_CA,
      AU: process.env.NEXT_PUBLIC_STRIPE_TEST_PRICE_PRO_AU,
    },
  },
} as const;

// Helper function to get the correct price ID based on plan and region
export const getStripePriceId = (
  plan: 'STARTER' | 'LITE' | 'PRO',
  regionCode: 'US' | 'GB' | 'EU' | 'CA' | 'AU'
) => {
  const source = isTestMode ? ENV_PRICES.TEST : ENV_PRICES.LIVE;
  const value = source[plan][regionCode];
  return (value && value.trim()) || '';
};
