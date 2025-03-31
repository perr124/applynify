export const PRICING_PLANS = {
  LITE: {
    stripeId: 'price_1R8OigDnSxQsct78i9GMR46f',
    name: 'Lite',
    applicationLimit: 25,
  },
  PRO: {
    stripeId: 'price_1R8OhODnSxQsct78eGw7xRiE',
    name: 'Pro',
    applicationLimit: 50,
  },
} as const;

// Base prices in USD for each plan
const BASE_PRICES_USD = {
  LITE: 49.99,
  PRO: 89.99,
};

// Regional price multipliers (relative to USD)
const REGIONAL_MULTIPLIERS = {
  US: 1.0, // USD
  GB: 0.79, // GBP
  EU: 0.92, // EUR
  CA: 1.35, // CAD
  AU: 1.52, // AUD
} as const;

// Get the price for a specific plan and region
export const getPlanPrice = (
  plan: keyof typeof PRICING_PLANS,
  regionCode: keyof typeof REGIONAL_MULTIPLIERS
) => {
  const basePrice = BASE_PRICES_USD[plan];
  const multiplier = REGIONAL_MULTIPLIERS[regionCode];
  const rawPrice = basePrice * multiplier;
  // Round up to nearest .99
  return Math.ceil(rawPrice) - 0.01;
};

// Get the plan by Stripe ID
export const getPlanByStripeId = (stripeId: string) => {
  return Object.values(PRICING_PLANS).find((plan) => plan.stripeId === stripeId);
};
