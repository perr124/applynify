export const STRIPE_PRICE_IDS = {
  LITE: {
    US:
      process.env.NODE_ENV === 'development'
        ? 'price_1R8OigDnSxQsct78i9GMR46f' // USD
        : 'price_1R8OigDnSxQsct78i9GMR46f',
    GB:
      process.env.NODE_ENV === 'development'
        ? 'price_1R8nmGDnSxQsct78DoqpsN2u' // GBP
        : 'price_1R8nmGDnSxQsct78DoqpsN2u',
    EU:
      process.env.NODE_ENV === 'development'
        ? 'price_1R8OigDnSxQsct78i9GMR46f' // EUR
        : 'price_1R8OigDnSxQsct78i9GMR46f',
    CA:
      process.env.NODE_ENV === 'development'
        ? 'price_1R8OigDnSxQsct78i9GMR46f' // CAD
        : 'price_1R8OigDnSxQsct78i9GMR46f',
    AU:
      process.env.NODE_ENV === 'development'
        ? 'price_1R8OigDnSxQsct78i9GMR46f' // AUD
        : 'price_1R8OigDnSxQsct78i9GMR46f',
  },
  PRO: {
    US:
      process.env.NODE_ENV === 'development'
        ? 'price_1R8OhODnSxQsct78eGw7xRiE' // USD
        : 'price_1R8OhODnSxQsct78eGw7xRiE',
    GB:
      process.env.NODE_ENV === 'development'
        ? 'price_1R8nlBDnSxQsct78rGW76kiF' // GBP
        : 'price_1R8nlBDnSxQsct78rGW76kiF',
    EU:
      process.env.NODE_ENV === 'development'
        ? 'price_1R8OhODnSxQsct78eGw7xRiE' // EUR
        : 'price_1R8OhODnSxQsct78eGw7xRiE',
    CA:
      process.env.NODE_ENV === 'development'
        ? 'price_1R8OhODnSxQsct78eGw7xRiE' // CAD
        : 'price_1R8OhODnSxQsct78eGw7xRiE',
    AU:
      process.env.NODE_ENV === 'development'
        ? 'price_1R8OhODnSxQsct78eGw7xRiE' // AUD
        : 'price_1R8OhODnSxQsct78eGw7xRiE',
  },
} as const;

// Helper function to get the correct price ID based on plan and region
export const getStripePriceId = (
  plan: keyof typeof STRIPE_PRICE_IDS,
  regionCode: keyof typeof STRIPE_PRICE_IDS.LITE
) => {
  return STRIPE_PRICE_IDS[plan][regionCode];
};
