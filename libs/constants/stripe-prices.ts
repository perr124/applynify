const getEnvPrice = (key: string, fallback: string) => {
  return process.env[key]?.toString() || fallback;
};

const isProd = process.env.NODE_ENV === 'production';

export const STRIPE_PRICE_IDS = {
  LITE: {
    US: isProd
      ? getEnvPrice('STRIPE_PRICE_LITE_US', 'price_1R8OigDnSxQsct78i9GMR46f')
      : getEnvPrice('STRIPE_TEST_PRICE_LITE_US', 'price_1R8OigDnSxQsct78i9GMR46f'),
    GB: isProd
      ? getEnvPrice('STRIPE_PRICE_LITE_GB', 'price_1R8nmGDnSxQsct78DoqpsN2u')
      : getEnvPrice('STRIPE_TEST_PRICE_LITE_GB', 'price_1R8nmGDnSxQsct78DoqpsN2u'),
    EU: isProd
      ? getEnvPrice('STRIPE_PRICE_LITE_EU', 'price_1R8OigDnSxQsct78i9GMR46f')
      : getEnvPrice('STRIPE_TEST_PRICE_LITE_EU', 'price_1R8OigDnSxQsct78i9GMR46f'),
    CA: isProd
      ? getEnvPrice('STRIPE_PRICE_LITE_CA', 'price_1R8OigDnSxQsct78i9GMR46f')
      : getEnvPrice('STRIPE_TEST_PRICE_LITE_CA', 'price_1R8OigDnSxQsct78i9GMR46f'),
    AU: isProd
      ? getEnvPrice('STRIPE_PRICE_LITE_AU', 'price_1R8OigDnSxQsct78i9GMR46f')
      : getEnvPrice('STRIPE_TEST_PRICE_LITE_AU', 'price_1R8OigDnSxQsct78i9GMR46f'),
  },
  PRO: {
    US: isProd
      ? getEnvPrice('STRIPE_PRICE_PRO_US', 'price_1R8OhODnSxQsct78eGw7xRiE')
      : getEnvPrice('STRIPE_TEST_PRICE_PRO_US', 'price_1R8OhODnSxQsct78eGw7xRiE'),
    GB: isProd
      ? getEnvPrice('STRIPE_PRICE_PRO_GB', 'price_1R8nlBDnSxQsct78rGW76kiF')
      : getEnvPrice('STRIPE_TEST_PRICE_PRO_GB', 'price_1R8nlBDnSxQsct78rGW76kiF'),
    EU: isProd
      ? getEnvPrice('STRIPE_PRICE_PRO_EU', 'price_1R8OhODnSxQsct78eGw7xRiE')
      : getEnvPrice('STRIPE_TEST_PRICE_PRO_EU', 'price_1R8OhODnSxQsct78eGw7xRiE'),
    CA: isProd
      ? getEnvPrice('STRIPE_PRICE_PRO_CA', 'price_1R8OhODnSxQsct78eGw7xRiE')
      : getEnvPrice('STRIPE_TEST_PRICE_PRO_CA', 'price_1R8OhODnSxQsct78eGw7xRiE'),
    AU: isProd
      ? getEnvPrice('STRIPE_PRICE_PRO_AU', 'price_1R8OhODnSxQsct78eGw7xRiE')
      : getEnvPrice('STRIPE_TEST_PRICE_PRO_AU', 'price_1R8OhODnSxQsct78eGw7xRiE'),
  },
} as const;

// Helper function to get the correct price ID based on plan and region
export const getStripePriceId = (
  plan: keyof typeof STRIPE_PRICE_IDS,
  regionCode: keyof typeof STRIPE_PRICE_IDS.LITE
) => {
  return STRIPE_PRICE_IDS[plan][regionCode];
};
