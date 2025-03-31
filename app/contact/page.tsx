'use client';

import { useState, Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to send message');

      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setStatus('error');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-8'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='space-y-2'>
          <label htmlFor='name' className='block text-sm font-medium text-slate-700'>
            Name
          </label>
          <input
            type='text'
            name='name'
            id='name'
            required
            value={formData.name}
            onChange={handleChange}
            className='w-full px-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-900 shadow-sm transition-all duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none placeholder:text-slate-400'
            placeholder='Your name'
          />
        </div>

        <div className='space-y-2'>
          <label htmlFor='email' className='block text-sm font-medium text-slate-700'>
            Email
          </label>
          <input
            type='email'
            name='email'
            id='email'
            required
            value={formData.email}
            onChange={handleChange}
            className='w-full px-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-900 shadow-sm transition-all duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none placeholder:text-slate-400'
            placeholder='your@email.com'
          />
        </div>
      </div>

      <div className='space-y-2'>
        <label htmlFor='subject' className='block text-sm font-medium text-slate-700'>
          Subject
        </label>
        <input
          type='text'
          name='subject'
          id='subject'
          required
          value={formData.subject}
          onChange={handleChange}
          className='w-full px-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-900 shadow-sm transition-all duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none placeholder:text-slate-400'
          placeholder='What is this about?'
        />
      </div>

      <div className='space-y-2'>
        <label htmlFor='message' className='block text-sm font-medium text-slate-700'>
          Message
        </label>
        <textarea
          name='message'
          id='message'
          rows={6}
          required
          value={formData.message}
          onChange={handleChange}
          className='w-full px-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-900 shadow-sm transition-all duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none placeholder:text-slate-400 resize-none'
          placeholder='Your message here...'
        />
      </div>

      <div className='pt-4'>
        <button
          type='submit'
          disabled={status === 'loading'}
          className='w-full flex justify-center items-center py-3 px-6 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]'
        >
          {status === 'loading' ? (
            <>
              <svg
                className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
              >
                <circle
                  className='opacity-25'
                  cx='12'
                  cy='12'
                  r='10'
                  stroke='currentColor'
                  strokeWidth='4'
                ></circle>
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                ></path>
              </svg>
              Sending...
            </>
          ) : (
            'Send Message'
          )}
        </button>
      </div>

      {status === 'success' && (
        <div className='rounded-lg bg-green-50 p-4 text-green-700 text-sm animate-fade-in'>
          <div className='flex items-center'>
            <svg className='h-5 w-5 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M5 13l4 4L19 7'
              ></path>
            </svg>
            Message sent successfully!
          </div>
        </div>
      )}
      {status === 'error' && (
        <div className='rounded-lg bg-red-50 p-4 text-red-700 text-sm animate-fade-in'>
          <div className='flex items-center'>
            <svg className='h-5 w-5 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M6 18L18 6M6 6l12 12'
              ></path>
            </svg>
            Failed to send message. Please try again.
          </div>
        </div>
      )}
    </form>
  );
}

function ContactPage() {
  return (
    <>
      <Header />
      <div className='container mx-auto px-8 relative pt-12 pb-2 text-center lg:pt-20'>
        <h1 className='font-display mx-auto max-w-4xl text-5xl font-medium tracking-tight text-slate-900 sm:text-7xl'>
          Contact Us
        </h1>
        <p className='mx-auto mt-6 max-w-2xl text-lg tracking-tight text-slate-700'>
          Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as
          possible.
        </p>
      </div>

      <div className='container mx-auto px-8 relative py-16'>
        <div className='mx-auto max-w-3xl'>
          <div className='bg-white shadow-xl rounded-2xl p-8'>
            <ContactForm />
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default function Contact() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ContactPage />
    </Suspense>
  );
}
