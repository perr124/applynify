'use client';

import config from '@/config';
import Link from 'next/link';
import { useLocalization } from '@/contexts/LocalizationContext';
import { PRICING_PLANS, getPlanPrice } from '@/libs/constants/pricing';
import { useEffect, useState } from 'react';
import KlarnaBadge from './KlarnaBadge';

// <Pricing/> displays the pricing plans for your app
// It's your Stripe config in config.js.stripe.plans[] that will be used to display the plans
// <ButtonCheckout /> renders a button that will redirect the user to Stripe checkout called the /api/stripe/create-checkout API endpoint with the correct priceId

const Pricing = () => {
  const { formatCurrency, currentRegion } = useLocalization();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const tiers = [
    {
      name: PRICING_PLANS.STARTER.name,
      price: getPlanPrice('STARTER', currentRegion.code as 'US' | 'GB' | 'EU' | 'CA' | 'AU'),
      priceId: PRICING_PLANS.STARTER.getStripeId(
        currentRegion.code as 'US' | 'GB' | 'EU' | 'CA' | 'AU'
      ),
      description: 'Try Applynify with a small batch',
      features: [
        `${PRICING_PLANS.STARTER.applicationLimit} jobs applied to directly on company sites`,
        'Write cover letters on your behalf',
        'Service within 3 days',
        'Advanced Application tracking in your dashboard',
        'Live chat with your Career Representative',
        'Standard support',
      ],
      buttonText: 'Start Now',
      mostPopular: false,
    },
    {
      name: PRICING_PLANS.LITE.name,
      price: getPlanPrice('LITE', currentRegion.code as 'US' | 'GB' | 'EU' | 'CA' | 'AU'),
      priceId: PRICING_PLANS.LITE.getStripeId(
        currentRegion.code as 'US' | 'GB' | 'EU' | 'CA' | 'AU'
      ),
      description: 'Perfect for job seekers getting started',
      features: [
        `${PRICING_PLANS.LITE.applicationLimit} jobs applied to directly on company sites`,
        'Write cover letters on your behalf',
        'Service within 4 days',
        'Advanced Application tracking in your dashboard',
        'Live chat with your Career Representative',
        'Standard support',
      ],
      buttonText: 'Get Started',
      mostPopular: true,
    },
    {
      name: PRICING_PLANS.PRO.name,
      price: getPlanPrice('PRO', currentRegion.code as 'US' | 'GB' | 'EU' | 'CA' | 'AU'),
      priceId: PRICING_PLANS.PRO.getStripeId(
        currentRegion.code as 'US' | 'GB' | 'EU' | 'CA' | 'AU'
      ),
      description: 'Optimized for maximizing career opportunities',
      features: [
        `${PRICING_PLANS.PRO.applicationLimit} jobs applied to directly on company sites`,
        'Write cover letters on your behalf',
        'Service within 6 days',
        'Advanced Application tracking in your dashboard',
        'Live chat with your Career Representative',
        '24/7 priority support',
        'Custom job search strategies',
      ],
      buttonText: 'Go Pro',
      mostPopular: false,
    },
  ];

  // Show loading state during server-side rendering
  if (!isClient) {
    return (
      <section className='py-16 bg-gray-50' id='pricing'>
        <div className='container px-4 mx-auto'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl font-bold mb-4'>Simple, Transparent Pricing</h2>
            <p className='text-gray-600 text-lg'>
              Choose the plan that's right for your job search
            </p>
            <p className='text-sm text-gray-400 mt-4'>
              One-time payment, no recurring fees or hidden charges!
            </p>
          </div>
          <div className='grid md:grid-cols-3 gap-8 max-w-6xl mx-auto'>
            {[1, 2, 3].map((i) => (
              <div key={i} className='relative rounded-2xl p-8 border border-gray-200 bg-white'>
                <div className='animate-pulse space-y-4'>
                  <div className='h-8 bg-gray-200 rounded w-1/3 mx-auto'></div>
                  <div className='h-12 bg-gray-200 rounded w-1/2 mx-auto'></div>
                  <div className='h-4 bg-gray-200 rounded w-3/4 mx-auto'></div>
                  <div className='space-y-2'>
                    {[1, 2, 3, 4, 5].map((j) => (
                      <div key={j} className='h-4 bg-gray-200 rounded'></div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className='py-16 bg-gray-50' id='pricing'>
      <div className='container px-4 mx-auto'>
        <div className='text-center mb-16'>
          <h2 className='text-4xl font-bold mb-4'>Simple, Transparent Pricing</h2>
          <p className='text-gray-600 text-lg'>Choose the plan that's right for your job search</p>
          <p className='text-sm text-gray-400 mt-4'>
            One-time payment, no recurring fees or hidden charges!
          </p>
        </div>

        <div className='grid md:grid-cols-3 gap-8 max-w-6xl mx-auto'>
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-2xl p-8 transition-all duration-300 ${
                tier.mostPopular
                  ? 'border-2 border-primary shadow-2xl bg-gradient-to-b from-primary/10 to-transparent md:scale-110 z-10'
                  : 'border border-gray-200 bg-white hover:scale-[1.02]'
              }`}
            >
              {tier.mostPopular && (
                <span className='absolute top-0 -translate-y-1/2 bg-primary text-black px-8 py-2 rounded-full text-base font-bold shadow-lg animate-pulse'>
                  ⭐ Most Popular
                </span>
              )}

              <div className='text-center'>
                <h3 className={`text-2xl font-bold ${tier.mostPopular ? 'text-primary' : ''}`}>
                  {tier.name}
                </h3>
                <div className='mt-4 flex items-baseline justify-center'>
                  <span className={`text-5xl font-bold ${tier.mostPopular ? 'text-primary' : ''}`}>
                    {formatCurrency(tier.price)}
                  </span>
                  <span className='text-gray-400'>one-time</span>
                </div>
                <div className='mt-3'>
                  <KlarnaBadge />
                </div>
                <p className='mt-4 text-gray-600'>{tier.description}</p>
              </div>

              <ul className='mt-8 space-y-4'>
                {tier.features.map((feature) => (
                  <li key={feature} className='flex items-start'>
                    <svg
                      className='h-6 w-6 text-primary flex-shrink-0'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M5 13l4 4L19 7'
                      />
                    </svg>
                    <span className='ml-3 text-gray-600'>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className='mt-8'>
                <Link
                  href={'/auth/register'}
                  className='btn bg-primary-500 hover:bg-primary-800 btn-block group'
                >
                  {/* <button className='btn bg-primary-500 hover:bg-primary-800 btn-block group'> */}
                  <svg
                    className='w-5 h-5 fill-primary-content group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-200'
                    viewBox='0 0 375 509'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path d='M249.685 14.125C249.685 11.5046 248.913 8.94218 247.465 6.75675C246.017 4.57133 243.957 2.85951 241.542 1.83453C239.126 0.809546 236.463 0.516683 233.882 0.992419C231.301 1.46815 228.917 2.69147 227.028 4.50999L179.466 50.1812C108.664 118.158 48.8369 196.677 2.11373 282.944C0.964078 284.975 0.367442 287.272 0.38324 289.605C0.399039 291.938 1.02672 294.226 2.20377 296.241C3.38082 298.257 5.06616 299.929 7.09195 301.092C9.11775 302.255 11.4133 302.867 13.75 302.869H129.042V494.875C129.039 497.466 129.791 500.001 131.205 502.173C132.62 504.345 134.637 506.059 137.01 507.106C139.383 508.153 142.01 508.489 144.571 508.072C147.131 507.655 149.516 506.503 151.432 504.757L172.698 485.394C247.19 417.643 310.406 338.487 359.975 250.894L373.136 227.658C374.292 225.626 374.894 223.327 374.882 220.99C374.87 218.653 374.243 216.361 373.065 214.341C371.887 212.322 370.199 210.646 368.17 209.482C366.141 208.318 363.841 207.706 361.5 207.707H249.685V14.125Z' />
                  </svg>
                  Get {config?.appName}
                  {/* </button> */}
                </Link>
                {/* <ButtonCheckout
                  priceId={tier.priceId}
                  // className={`w-full py-6 ${
                  //   tier.mostPopular ? 'btn-primary' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                  // }`}
                >
                  {tier.buttonText}
                </ButtonCheckout> */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
