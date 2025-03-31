import { getStripePriceId } from './stripe-prices';

export const PRICING_PLANS = {
  LITE: {
    name: 'Lite',
    applicationLimit: 25,
    getStripeId: (regionCode: 'US' | 'GB' | 'EU' | 'CA' | 'AU') =>
      getStripePriceId('LITE', regionCode),
  },
  PRO: {
    name: 'Pro',
    applicationLimit: 50,
    getStripeId: (regionCode: 'US' | 'GB' | 'EU' | 'CA' | 'AU') =>
      getStripePriceId('PRO', regionCode),
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

type RegionCode = keyof typeof REGIONAL_MULTIPLIERS;

// Get the price for a specific plan and region
export const getPlanPrice = (plan: keyof typeof PRICING_PLANS, regionCode: RegionCode) => {
  const basePrice = BASE_PRICES_USD[plan];
  const multiplier = REGIONAL_MULTIPLIERS[regionCode];
  const rawPrice = basePrice * multiplier;
  // Round up to nearest .99
  return Math.ceil(rawPrice) - 0.01;
};

// Get the plan by Stripe ID
export const getPlanByStripeId = (stripeId: string) => {
  return Object.values(PRICING_PLANS).find((plan) =>
    (Object.keys(REGIONAL_MULTIPLIERS) as RegionCode[]).some(
      (regionCode) => plan.getStripeId(regionCode) === stripeId
    )
  );
};
