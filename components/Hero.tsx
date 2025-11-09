import TestimonialsAvatars from './TestimonialsAvatars';
import Link from 'next/link';

const Hero = () => {
  return (
    <section className='relative overflow-hidden'>
      {/* Background decoration */}
      <div className='absolute inset-0 z-0'>
        <div className='absolute -right-10 top-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl' />
        <div className='absolute -left-10 top-3/4 w-72 h-72 bg-secondary/10 rounded-full blur-3xl' />
      </div>

      {/* Main content */}
      <div className='relative z-10 max-w-5xl mx-auto px-8 py-24 flex flex-col items-center justify-center text-center gap-12'>
        <div className='space-y-8'>
          <h1 className='font-extrabold text-4xl lg:text-6xl tracking-tight'>
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

          <p className='text-lg opacity-80 leading-relaxed max-w-2xl mx-auto'>
            Our team of dedicated assistants take care of your job applications from start to
            finish. Finding the best opportunities and submitting tailored applications to help you
            skip the frustrating process.
          </p>
        </div>

        <div className='flex flex-col items-center gap-8'>
          <Link
            href={'/auth/register'}
            className='btn bg-primary-500 text-white btn-wide btn-lg hover:bg-primary-800'
          >
            Get Started
          </Link>
          <TestimonialsAvatars priority={true} />
        </div>

        {/* Stats */}
        <div className='grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 pt-8'>
          <div className='space-y-2'>
            <h3 className='text-4xl font-bold'>2.5k+</h3>
            <p className='text-base-content/60'>People Reached</p>
          </div>
          <div className='space-y-2'>
            <h3 className='text-4xl font-bold'>40+</h3>
            <p className='text-base-content/60'>Industries Covered</p>
          </div>
          {/* <div className='space-y-2'>
            <h3 className='text-4xl font-bold'>10+</h3>
            <p className='text-base-content/60'>Hours saved</p>
          </div> */}
          <div className='space-y-2 col-span-2 md:col-span-1'>
            <h3 className='text-4xl font-bold'>24/7</h3>
            <p className='text-base-content/60'>Support Available</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
