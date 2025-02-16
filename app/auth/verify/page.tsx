'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function VerifyEmailComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams?.get('token');
      if (!token) {
        setError('Missing verification token');
        setIsVerifying(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        if (!res.ok) {
          throw new Error('Invalid verification token');
        }

        setIsSuccess(true);
        // Add a small delay before redirecting
        setTimeout(() => {
          router.push('/onboarding?verified=true');
        }, 300);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Verification failed');
      } finally {
        setIsVerifying(false);
      }
    };

    verifyEmail();
  }, [router, searchParams]);

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-white to-gray-100 px-4 py-12 sm:px-6 lg:px-8'>
      <div className='w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-lg'>
        <div className='text-center'>
          {isVerifying ? (
            <>
              <h2 className='text-2xl font-bold'>Verifying your email...</h2>
              <div className='mt-4'>
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto'></div>
              </div>
            </>
          ) : isSuccess ? (
            <>
              <h2 className='text-2xl font-bold text-green-600'>Email verified successfully!</h2>
              <p className='mt-2 text-sm text-gray-600'>Redirecting you to onboarding...</p>
            </>
          ) : error ? (
            <>
              <h2 className='text-2xl font-bold text-red-600'>Verification failed</h2>
              <p className='mt-2 text-sm text-gray-600'>{error}</p>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmail() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailComponent />
    </Suspense>
  );
}
