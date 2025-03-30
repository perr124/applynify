export const PRICING_PLANS = {
  LITE: {
    stripeId: 'price_1R8OigDnSxQsct78i9GMR46f',
    name: 'Lite',
    applicationLimit: 20,
  },
  PRO: {
    stripeId: 'price_1R8OhODnSxQsct78eGw7xRiE',
    name: 'Pro',
    applicationLimit: 50,
  },
} as const;

export const getPlanByStripeId = (stripeId: string) => {
  return Object.values(PRICING_PLANS).find((plan) => plan.stripeId === stripeId);
};
