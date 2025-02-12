import ButtonCheckout from './ButtonCheckout';

// <Pricing/> displays the pricing plans for your app
// It's your Stripe config in config.js.stripe.plans[] that will be used to display the plans
// <ButtonCheckout /> renders a button that will redirect the user to Stripe checkout called the /api/stripe/create-checkout API endpoint with the correct priceId

const Pricing = () => {
  const tiers = [
    {
      name: 'Lite',
      price: 49,
      priceId: 'price_lite',
      description: 'Perfect for job seekers getting started',
      features: [
        '25 professionally applied roles',
        'Quick service within 24 hours',
        'Email categorization of job responses',
        'Basic application tracking',
        'Resume optimization tips',
        'Standard support',
      ],
      buttonText: 'Get Started',
      mostPopular: false,
    },
    {
      name: 'Pro',
      price: 99,
      priceId: 'price_pro',
      description: 'Best for serious job seekers',
      features: [
        'Unlimited professionally applied roles',
        'Priority service within 12 hours',
        'Advanced email categorization & analytics',
        'Comprehensive application tracking',
        'AI-powered resume optimization',
        '24/7 priority support',
        'Custom job search strategies',
        'Interview preparation resources',
      ],
      buttonText: 'Go Pro',
      mostPopular: true,
    },
  ];

  return (
    <section className='py-16 bg-gray-50' id='pricing'>
      <div className='container px-4 mx-auto'>
        <div className='text-center mb-16'>
          <h2 className='text-4xl font-bold mb-4'>Simple, Transparent Pricing</h2>
          <p className='text-gray-600 text-lg'>Choose the plan that's right for your job search</p>
        </div>

        <div className='grid md:grid-cols-2 gap-8 max-w-5xl mx-auto'>
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-2xl p-8 ${
                tier.mostPopular ? 'border-2 border-primary shadow-xl' : 'border border-gray-200'
              }`}
            >
              {tier.mostPopular && (
                <span className='absolute top-0 -translate-y-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-medium'>
                  Most Popular
                </span>
              )}

              <div className='text-center'>
                <h3 className='text-2xl font-bold'>{tier.name}</h3>
                <div className='mt-4 flex items-baseline justify-center'>
                  <span className='text-5xl font-bold'>${tier.price}</span>
                  <span className='ml-1 text-gray-500'>/month</span>
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
                <ButtonCheckout
                  priceId={tier.priceId}
                  className={`w-full py-6 ${
                    tier.mostPopular ? 'btn-primary' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                  }`}
                >
                  {tier.buttonText}
                </ButtonCheckout>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
