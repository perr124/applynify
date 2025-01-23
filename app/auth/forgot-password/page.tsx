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
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <div>
          <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
            Reset your password
          </h2>
        </div>

        {success ? (
          <div className='rounded-md bg-green-50 p-4'>
            <div className='text-sm text-green-700'>
              If an account exists with that email, we've sent password reset instructions.
            </div>
          </div>
        ) : (
          <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
            {error && (
              <div className='rounded-md bg-red-50 p-4'>
                <div className='text-sm text-red-700'>{error}</div>
              </div>
            )}
            <div>
              <input
                name='email'
                type='email'
                required
                className='appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                placeholder='Email address'
              />
            </div>

            <div>
              <button
                type='submit'
                disabled={isLoading}
                className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              >
                {isLoading ? 'Sending...' : 'Send reset instructions'}
              </button>
            </div>

            <div className='text-center'>
              <Link
                href='/auth/signin'
                className='font-medium text-indigo-600 hover:text-indigo-500'
              >
                Back to sign in
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
