'use client';

import { useState } from 'react';
import React from 'react';
import Link from 'next/link';

export default function ForgotPassword() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setSuccess(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-white to-gray-100 px-4 py-12 sm:px-6 lg:px-8'>
      <div className='w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-lg'>
        <div>
          <h2 className='text-center text-3xl font-bold tracking-tight text-gray-900'>
            Reset your password
          </h2>
          <p className='mt-2 text-center text-sm text-gray-600'>
            Enter your email and we'll send you instructions
          </p>
        </div>

        {success ? (
          <div className='rounded-lg bg-[#0d824a]/10 p-4'>
            <div className='text-sm text-[#0d824a]'>
              If an account exists with that email, we've sent password reset instructions.
            </div>
          </div>
        ) : (
          <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
            {error && (
              <div className='rounded-lg bg-red-50 p-4'>
                <div className='text-sm text-red-700'>{error}</div>
              </div>
            )}
            <div>
              <label htmlFor='email' className='sr-only'>
                Email address
              </label>
              <input
                id='email'
                name='email'
                type='email'
                required
                className='relative block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-[#0d824a] focus:ring-[#0d824a] sm:text-sm'
                placeholder='Email address'
              />
            </div>

            <div>
              <button
                type='submit'
                disabled={isLoading}
                className='group relative flex w-full justify-center rounded-lg bg-[#0d824a] px-4 py-3 text-sm font-semibold text-white hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-[#0d824a] focus:ring-offset-2 disabled:opacity-70'
              >
                {isLoading ? 'Sending...' : 'Send reset instructions'}
              </button>
            </div>

            <div className='text-center text-sm'>
              <span className='text-gray-500'>Remember your password?</span>{' '}
              <Link href='/auth/signin' className='font-medium text-[#0d824a] hover:opacity-80'>
                Sign in
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
