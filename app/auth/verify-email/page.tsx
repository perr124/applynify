'use client';

import { signOut } from 'next-auth/react';
import { useState } from 'react';

export default function VerifyEmailPending() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    await signOut({ callbackUrl: '/auth/signin' });
  };

  return (
    <div className='relative min-h-screen bg-gradient-to-b from-white to-gray-100'>
      {/* Sign out button in top right corner */}
      <div className='absolute right-4 top-4 sm:right-6 sm:top-6'>
        <button
          onClick={handleSignOut}
          disabled={isLoading}
          className='rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#0d824a] focus:ring-offset-2 disabled:opacity-50'
        >
          {isLoading ? 'Signing out...' : 'Sign out'}
        </button>
      </div>

      {/* Main content */}
      <div className='flex min-h-screen flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8'>
        <div className='w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-lg'>
          <div className='text-center'>
            <h2 className='text-2xl font-bold'>Check your email</h2>
            <p className='mt-2 text-sm text-gray-600'>
              We've sent you a verification link. Please check your email/spam folder and click the
              link to verify your account.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
