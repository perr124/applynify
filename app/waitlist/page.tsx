'use client';

import React, { useState, useRef } from 'react';
import { toast } from 'react-hot-toast';
import apiClient from '@/libs/api';
import { ArrowRight, CheckCircle, Users, Clock, Zap } from 'lucide-react';
import Image from 'next/image';
import config from '@/config';
import logo from '@/app/icon.png';

const industries = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Marketing',
  'Sales',
  'Design',
  'Engineering',
  'Consulting',
  'Retail',
  'Manufacturing',
  'Other',
];

export default function WaitlistPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    industry: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await apiClient.post('/lead', formData);
      toast.success("You're on the list! We'll notify you when we launch.");
      setIsSubmitted(true);
      setFormData({ name: '', email: '', industry: '' });
    } catch (error: any) {
      toast.error(error?.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (isSubmitted) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4'>
        <div className='max-w-md w-full text-center space-y-6'>
          <div className='mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center'>
            <CheckCircle className='w-8 h-8 text-green-600' />
          </div>
          <h1 className='text-3xl font-bold text-gray-900'>You're on the list!</h1>
          <p className='text-gray-600'>
            Thanks for joining our waitlist. We'll notify you as soon as Applynify launches.
          </p>
          <button onClick={() => setIsSubmitted(false)} className='btn btn-primary'>
            Join With Another Email
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50'>
      {/* Header */}
      <header className='container mx-auto px-4 py-6'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-2'>
            <Image
              src={logo}
              alt={`${config.appName} logo`}
              className='w-28 sm:w-32 md:w-32 lg:w-36 h-auto'
              placeholder='blur'
              priority={true}
            />
          </div>
          <div className='flex items-center space-x-4 text-sm text-gray-600'>
            <span>Coming Soon</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='container mx-auto px-4 py-12'>
        <div className='max-w-4xl mx-auto'>
          {/* Hero Section */}
          <div className='text-center mb-16'>
            <h1 className='font-extrabold text-4xl lg:text-6xl tracking-tight mb-6'>
              <span className='relative z-10'>We takeover your </span>
              <br />
              <span className='relative inline-block whitespace-nowrap'>
                <span
                  className='absolute -left-2 -top-1 -bottom-1 -right-2 md:-left-3 md:-top-0 md:-bottom-0 md:-right-3 -rotate-1 bg-[#0d824a]'
                  style={{ zIndex: 1 }}
                />
                <span className='relative z-10 text-white'>job applications</span>
              </span>
              <span className='relative z-10'>.</span>
            </h1>
            <p className='text-xl text-gray-600 max-w-2xl mx-auto mb-8'>
              Stop spending hours on applications. Let our real human experts handle the heavy
              lifting, concierge-style, so you can focus on what matters most.
            </p>

            {/* Stats */}
            <div className='flex flex-wrap justify-center gap-8 mb-12'>
              <div className='flex items-center space-x-2 text-gray-600'>
                <Clock className='w-5 h-5' />
                <span>Launching Q3 2025</span>
              </div>
              <div className='flex items-center space-x-2 text-gray-600'>
                <Zap className='w-5 h-5' />
                <span>Real Human Experts</span>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className='max-w-md mx-auto'>
            <div className='bg-white rounded-2xl shadow-xl p-8 border border-gray-100'>
              <h2 className='text-2xl font-bold text-gray-900 mb-2 text-center'>
                Join the Waitlist
              </h2>
              <p className='text-gray-600 text-center mb-6'>Be the first to know when we launch</p>

              <form onSubmit={handleSubmit} className='space-y-4'>
                <div>
                  <label htmlFor='name' className='block text-sm font-medium text-gray-700 mb-1'>
                    Full Name
                  </label>
                  <input
                    ref={nameRef}
                    id='name'
                    type='text'
                    required
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className='input input-bordered w-full'
                    placeholder='John Doe'
                  />
                </div>

                <div>
                  <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-1'>
                    Email Address
                  </label>
                  <input
                    id='email'
                    type='email'
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className='input input-bordered w-full'
                    placeholder='john@example.com'
                  />
                </div>

                <div>
                  <label
                    htmlFor='industry'
                    className='block text-sm font-medium text-gray-700 mb-1'
                  >
                    Industry
                  </label>
                  <select
                    id='industry'
                    required
                    value={formData.industry}
                    onChange={(e) => handleInputChange('industry', e.target.value)}
                    className='select select-bordered w-full'
                  >
                    <option value=''>Select your industry</option>
                    {industries.map((industry) => (
                      <option key={industry} value={industry}>
                        {industry}
                      </option>
                    ))}
                  </select>
                </div>

                <button type='submit' disabled={isLoading} className='btn btn-primary w-full'>
                  {isLoading ? (
                    <>
                      <span className='loading loading-spinner loading-sm'></span>
                      Joining...
                    </>
                  ) : (
                    <>
                      Join Waitlist
                      <ArrowRight className='w-4 h-4' />
                    </>
                  )}
                </button>
              </form>

              <p className='text-xs text-gray-500 text-center mt-4'>
                No spam, ever. Unsubscribe at any time.
              </p>
            </div>
          </div>

          {/* Features Preview */}
          <div className='mt-16 grid md:grid-cols-3 gap-8'>
            <div className='text-center'>
              <div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4'>
                <Zap className='w-6 h-6 text-blue-600' />
              </div>
              <h3 className='font-semibold text-gray-900 mb-2'>Concierge-Style Service</h3>
              <p className='text-gray-600 text-sm'>
                Our real human experts write personalized cover letters and optimize your resume for
                each job.
              </p>
            </div>
            <div className='text-center'>
              <div className='w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4'>
                <Clock className='w-6 h-6 text-purple-600' />
              </div>
              <h3 className='font-semibold text-gray-900 mb-2'>Save Hours</h3>
              <p className='text-gray-600 text-sm'>
                Apply to 10x more jobs in the same time. Focus on interviews, not applications.
              </p>
            </div>
            <div className='text-center'>
              <div className='w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4'>
                <Users className='w-6 h-6 text-green-600' />
              </div>
              <h3 className='font-semibold text-gray-900 mb-2'>Track Everything</h3>
              <p className='text-gray-600 text-sm'>
                Monitor your applications, resumes, and cover letters all in one place.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className='container mx-auto px-4 py-8 text-center'>
        <p className='text-gray-500 text-sm'>© 2025 Applynify. All rights reserved.</p>
      </footer>
    </div>
  );
}
