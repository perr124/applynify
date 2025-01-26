'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function VerifyEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);

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

        // Redirect to sign in after successful verification
        router.push('/onboarding?verified=true');
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
            <h2 className='text-2xl font-bold'>Verifying your email...</h2>
          ) : error ? (
            <>
              <h2 className='text-2xl font-bold text-red-600'>Verification failed</h2>
              <p className='mt-2 text-sm text-gray-600'>{error}</p>
            </>
          ) : (
            <h2 className='text-2xl font-bold text-green-600'>Email verified successfully!</h2>
          )}
        </div>
      </div>
    </div>
  );
}
