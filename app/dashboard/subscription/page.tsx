'use client';
import { useState } from 'react';
import React from 'react';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import config from '@/config';
import apiClient from '@/libs/api';

export default function ServicesPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handlePayment = async (priceId: string) => {
    setIsSubmitting(true);
    setError(null);
    setShowSuccess(false);

    try {
      const response = await apiClient.post('/stripe/create-checkout', {
        priceId: priceId,
        successUrl: `${window.location.origin}/dashboard`,
        cancelUrl: window.location.href,
        mode: 'payment',
      });

      // @ts-ignore
      if (!response.url) {
        console.error('No URL in response:', response);
        throw new Error('No checkout URL received');
      }

      // @ts-ignore
      window.location.href = response.url;
    } catch (e) {
      console.error('Payment error:', e);
      setError('Payment initialization failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>Services</h1>
          <p className='mt-1 text-sm text-gray-500'>
            Choose a service package that matches your job search needs
          </p>
        </div>
      </div>

      {showSuccess && (
        <div className='rounded-lg bg-green-50 p-4'>
          <div className='flex'>
            <CheckCircle className='h-5 w-5 text-green-400 mr-2' />
            <div className='text-sm text-green-700'>
              Your service has been purchased successfully
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className='rounded-lg bg-red-50 p-4'>
          <div className='flex'>
            <AlertCircle className='h-5 w-5 text-red-400 mr-2' />
            <div className='text-sm text-red-700'>{error}</div>
          </div>
        </div>
      )}

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        {[
          {
            name: 'Lite Package',
            price: 49.99,
            priceId: config.stripe.plans[0].priceId,
            description: 'Perfect for getting started',
            features: [
              '25 job applications submitted on your behalf',
              'Professional cover letters written for each application',
              '5-day turnaround time',
              'Email response categorization',
              'Basic application tracking dashboard',
              'Standard email support',
            ],
          },
          {
            name: 'Pro Package',
            price: 89.99,
            priceId: config.stripe.plans[1].priceId,
            description: 'For serious job seekers',
            features: [
              '50 jobs applied to directly on company sites',
              'Write cover letters on your behalf',
              'Priority service within 5 days',
              'Advanced Application tracking in your dashboard',
              '24/7 priority support',
              'Custom job search strategies',
            ],
          },
        ].map((tier) => (
          <div key={tier.priceId} className='bg-white shadow rounded-lg p-6 space-y-6'>
            <div className='flex items-center justify-between'>
              <div>
                <h2 className='text-xl font-semibold text-gray-900'>{tier.name}</h2>
                <p className='text-sm text-gray-500'>{tier.description}</p>
              </div>
              <div className='text-2xl font-bold text-gray-900'>${tier.price}</div>
            </div>

            <div className='space-y-4'>
              <ul className='space-y-3'>
                {tier.features.map((feature) => (
                  <li key={feature} className='flex items-start'>
                    <svg
                      className='h-5 w-5 text-primary-500 flex-shrink-0'
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

              <button
                onClick={() => handlePayment(tier.priceId)}
                disabled={isSubmitting}
                className={`w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-500 hover:bg-primary-700 disabled:bg-primary-400 disabled:cursor-not-allowed ${
                  isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className='animate-spin -ml-1 mr-2 h-5 w-5' />
                    Processing...
                  </>
                ) : (
                  'Purchase Package'
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
