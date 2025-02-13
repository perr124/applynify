import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn more about our mission and what drives us forward.',
};

function AboutPage() {
  return (
    <>
      <Header />
      <div className='container mx-auto px-8 relative pt-12 pb-2 text-center lg:pt-20'>
        <h1 className='font-display mx-auto max-w-4xl text-5xl font-medium tracking-tight text-slate-900 sm:text-7xl'>
          About
        </h1>
        <p className='mx-auto mt-6 max-w-2xl text-lg tracking-tight text-slate-700'>
          We're on a mission to eliminate the stress of job applications, letting you focus on what
          truly matters - preparing for your next career move.
        </p>
      </div>

      <div className='container mx-auto px-8 relative py-16'>
        <div className='mx-auto max-w-7xl'>
          <div className='grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:gap-x-16'>
            <div>
              <h2 className='text-3xl font-bold tracking-tight text-slate-900'>Our Story</h2>
              <p className='mt-4 text-lg text-slate-600'>
                In today's competitive job market, the average job seeker spends countless hours
                sending out applications with diminishing returns. Studies show that candidates
                typically submit between 100-200 applications to secure a single job offer, with
                only about 2% of applications resulting in an interview.
              </p>
              <p className='mt-4 text-lg text-slate-600'>
                We're here to change these statistics. Our team of in-house professionals takes the
                burden of application preparation off your shoulders, crafting compelling cover
                letters and optimizing resumes that actually get noticed by hiring managers.
              </p>
            </div>
            <div>
              <h2 className='text-3xl font-bold tracking-tight text-slate-900'>Our Values</h2>
              <div className='mt-4 space-y-6'>
                {[
                  {
                    title: 'Efficiency',
                    description:
                      'We streamline the job application process so you can focus on interview preparation and career development.',
                  },
                  {
                    title: 'Expertise',
                    description:
                      'Our professional team understands what hiring managers look for and how to make your application stand out.',
                  },
                  {
                    title: 'Empowerment',
                    description:
                      'We believe in giving you back your time and confidence in the job search process.',
                  },
                ].map((value) => (
                  <div key={value.title} className='border-l-4 border-primary-500 pl-4'>
                    <h3 className='text-xl font-semibold text-slate-900'>{value.title}</h3>
                    <p className='mt-2 text-slate-600'>{value.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className='mt-20 text-center'>
            <h2 className='text-3xl font-bold tracking-tight text-slate-900 mb-12'>
              The Job Search Reality
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
              <div className='p-6 bg-white rounded-lg shadow-sm'>
                <div className='text-4xl font-bold text-primary-500 mb-2'>180+</div>
                <p className='text-slate-600'>Average Applications Sent Per Job Search</p>
              </div>
              <div className='p-6 bg-white rounded-lg shadow-sm'>
                <div className='text-4xl font-bold text-primary-500 mb-2'>2%</div>
                <p className='text-slate-600'>
                  Average Interview Rate for Traditional Applications
                </p>
              </div>
              <div className='p-6 bg-white rounded-lg shadow-sm'>
                <div className='text-4xl font-bold text-primary-500 mb-2'>40hrs+</div>
                <p className='text-slate-600'>Time Spent on Applications Per Month</p>
              </div>
            </div>
            <p className='mt-8 text-lg text-slate-600 max-w-3xl mx-auto'>
              We're here to change these numbers. Our professional application service helps you
              stand out from the crowd and spend your time where it matters most.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default function About() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AboutPage />
    </Suspense>
  );
}
