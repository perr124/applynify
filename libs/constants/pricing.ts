export const PRICING_PLANS = {
  LITE: {
    stripeId: 'price_1Qrq5zDnSxQsct78LXCYeeb9',
    name: 'Lite',
    applicationLimit: 20,
  },
  PRO: {
    stripeId: 'price_1Qrq6KDnSxQsct78qWWsMNUA',
    name: 'Pro',
    applicationLimit: 50,
  },
} as const;

export const getPlanByStripeId = (stripeId: string) => {
  return Object.values(PRICING_PLANS).find((plan) => plan.stripeId === stripeId);
};
