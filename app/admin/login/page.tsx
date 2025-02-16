'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
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
        setError('Invalid credentials');
        return;
      }

      // After successful login, redirect directly to admin
      // The middleware will handle the admin check
      window.location.href = '/admin';
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during sign in');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-white to-gray-100 px-4 py-12 sm:px-6 lg:px-8'>
      <div className='w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-lg'>
        <div>
          <h2 className='text-center text-3xl font-bold tracking-tight text-gray-900'>
            Admin Login
          </h2>
          <p className='mt-2 text-center text-sm text-gray-600'>
            Sign in to access the admin panel
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
                className='relative block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-[#0d824a] focus:ring-[#0d824a] sm:text-sm'
                placeholder='Admin email'
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
                className='relative block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-[#0d824a] focus:ring-[#0d824a] sm:text-sm'
                placeholder='Password'
              />
            </div>
          </div>

          <button
            type='submit'
            disabled={isLoading}
            className='group relative flex w-full justify-center rounded-lg bg-[#0d824a] px-4 py-3 text-sm font-semibold text-white hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-[#0d824a] focus:ring-offset-2 disabled:opacity-70'
          >
            {isLoading ? 'Signing in...' : 'Sign in to Admin'}
          </button>
        </form>
      </div>
    </div>
  );
}
