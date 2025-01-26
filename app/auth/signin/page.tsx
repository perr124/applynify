'use client';

import { useState } from 'react';
import React from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignIn() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push('/dashboard'); // Or wherever you want to redirect after login
        router.refresh();
      }
    } catch (error) {
      setError('An error occurred during sign in');
    } finally {
      setIsLoading(false);
    }
  }

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    signIn('google', { callbackUrl: '/dashboard' });
  };

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-white to-gray-100 px-4 py-12 sm:px-6 lg:px-8'>
      <div className='w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-lg'>
        <div>
          <h2 className='text-center text-3xl font-bold tracking-tight text-gray-900'>
            Welcome back
          </h2>
          <p className='mt-2 text-center text-sm text-gray-600'>
            Sign in to continue to your account
          </p>
        </div>
        <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
          {error && (
            <div className='rounded-lg bg-red-50 p-4'>
              <div className='text-sm text-red-700'>{error}</div>
            </div>
          )}
          <div className='space-y-4'>
            <div>
              <label htmlFor='email' className='sr-only'>
                Email address
              </label>
              <input
                id='email'
                name='email'
                type='email'
                required
                className='relative block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                placeholder='Email address'
              />
            </div>
            <div>
              <label htmlFor='password' className='sr-only'>
                Password
              </label>
              <input
                id='password'
                name='password'
                type='password'
                required
                className='relative block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                placeholder='Password'
              />
            </div>
          </div>

          <div className='flex items-center justify-end'>
            <div className='text-sm'>
              <Link
                href='/auth/forgot-password'
                className='font-medium text-indigo-600 hover:text-indigo-500'
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type='submit'
              disabled={isLoading}
              className='group relative flex w-full justify-center rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-70'
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-gray-300' />
            </div>
            <div className='relative flex justify-center text-sm'>
              <span className='bg-white px-2 text-gray-500'>Or continue with</span>
            </div>
          </div>

          <div>
            <button
              type='button'
              onClick={handleGoogleSignIn}
              className='flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
            >
              <img
                className='mr-2 h-5 w-5'
                src='https://www.svgrepo.com/show/475656/google-color.svg'
                alt='Google logo'
              />
              Sign in with Google
            </button>
          </div>

          <div className='text-center text-sm'>
            <span className='text-gray-500'>Don't have an account?</span>{' '}
            <Link
              href='/auth/register'
              className='font-medium text-indigo-600 hover:text-indigo-500'
            >
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
