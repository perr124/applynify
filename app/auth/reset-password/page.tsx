'use client';

import { useState, Suspense } from 'react';
import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get('token');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [passwordFocused, setPasswordFocused] = useState(false);

  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return 'Password must be at least 8 characters long';
    }
    if (!hasUpperCase) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!hasLowerCase) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!hasNumbers) {
      return 'Password must contain at least one number';
    }
    if (!hasSpecialChar) {
      return 'Password must contain at least one special character (!@#$%^&amp;*(),.?&quot;:{}|&lt;&gt;)';
    }
    return null;
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setPasswordError(null);

    const formData = new FormData(e.currentTarget);
    const submittedPassword = formData.get('password') as string;

    // Validate password using the exact same rules as sign-up
    const passwordValidationError = validatePassword(submittedPassword);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password: submittedPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      router.push('/auth/signin?reset=success');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  if (!token) {
    return (
      <>
        <Header />
        <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
          <div className='max-w-md w-full space-y-8'>
            <div className='text-center'>
              <h2 className='text-3xl font-extrabold text-gray-900'>Invalid reset link</h2>
              <p className='mt-2 text-gray-600'>
                This password reset link is invalid or has expired.
              </p>
              <div className='mt-4'>
                <Link
                  href='/auth/forgot-password'
                  className='font-medium text-primary-600 hover:text-primary-500'
                >
                  Request a new reset link
                </Link>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-md w-full space-y-8'>
          <div>
            <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
              Set new password
            </h2>
          </div>
          <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
            {error && (
              <div className='rounded-md bg-red-50 p-4'>
                <div className='text-sm text-red-700'>{error}</div>
              </div>
            )}
            <div>
              <label htmlFor='password' className='sr-only'>
                New password
              </label>
              <div className='relative'>
                <input
                  id='password'
                  name='password'
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  className='relative block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-[#0d824a] focus:ring-[#0d824a] sm:text-sm'
                  placeholder='New password'
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute inset-y-0 right-0 flex items-center pr-3'
                >
                  {showPassword ? (
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='w-5 h-5 text-gray-500'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88'
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='w-5 h-5 text-gray-500'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z'
                      />
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                      />
                    </svg>
                  )}
                </button>
              </div>
              {passwordError && <p className='mt-2 text-sm text-red-600'>{passwordError}</p>}
              {passwordFocused && (
                <div className='mt-2 text-xs text-gray-500'>
                  <div className='grid grid-cols-2 gap-1'>
                    <div
                      className={`flex items-center ${
                        password.length >= 8 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      <svg
                        className={`w-4 h-4 mr-1 ${
                          password.length >= 8 ? 'text-green-600' : 'text-red-600'
                        }`}
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        {password.length >= 8 ? (
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M5 13l4 4L19 7'
                          />
                        ) : (
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M6 18L18 6M6 6l12 12'
                          />
                        )}
                      </svg>
                      8+ characters
                    </div>
                    <div
                      className={`flex items-center ${
                        /[A-Z]/.test(password) ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      <svg
                        className={`w-4 h-4 mr-1 ${
                          /[A-Z]/.test(password) ? 'text-green-600' : 'text-red-600'
                        }`}
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        {/[A-Z]/.test(password) ? (
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M5 13l4 4L19 7'
                          />
                        ) : (
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M6 18L18 6M6 6l12 12'
                          />
                        )}
                      </svg>
                      Uppercase
                    </div>
                    <div
                      className={`flex items-center ${
                        /[a-z]/.test(password) ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      <svg
                        className={`w-4 h-4 mr-1 ${
                          /[a-z]/.test(password) ? 'text-green-600' : 'text-red-600'
                        }`}
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        {/[a-z]/.test(password) ? (
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M5 13l4 4L19 7'
                          />
                        ) : (
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M6 18L18 6M6 6l12 12'
                          />
                        )}
                      </svg>
                      Lowercase
                    </div>
                    <div
                      className={`flex items-center ${
                        /\d/.test(password) ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      <svg
                        className={`w-4 h-4 mr-1 ${
                          /\d/.test(password) ? 'text-green-600' : 'text-red-600'
                        }`}
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        {/\d/.test(password) ? (
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M5 13l4 4L19 7'
                          />
                        ) : (
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M6 18L18 6M6 6l12 12'
                          />
                        )}
                      </svg>
                      Number
                    </div>
                    <div
                      className={`flex items-center ${
                        /[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      <svg
                        className={`w-4 h-4 mr-1 ${
                          /[!@#$%^&*(),.?":{}|<>]/.test(password)
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        {/[!@#$%^&*(),.?":{}|<>]/.test(password) ? (
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M5 13l4 4L19 7'
                          />
                        ) : (
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M6 18L18 6M6 6l12 12'
                          />
                        )}
                      </svg>
                      Special character
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <button
                type='submit'
                disabled={isLoading}
                className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-500 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
              >
                {isLoading ? 'Updating...' : 'Update password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default function ResetPassword() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
