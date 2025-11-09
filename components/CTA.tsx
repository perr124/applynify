import Image from 'next/image';
import Link from 'next/link';
import config from '@/config';
import ctaImage from '@/app/pexels-ron-lach-9832697.jpg';

const CTA = () => {
  return (
    <section className='relative hero overflow-hidden min-h-screen'>
      <Image src={ctaImage} alt='Background' className='object-cover w-full' fill />
      <div className='relative hero-overlay bg-neutral bg-opacity-70'></div>
      <div className='relative hero-content text-center text-neutral-content p-8'>
        <div className='flex flex-col items-center max-w-xl p-8 md:p-0'>
          <h2 className='font-bold text-3xl md:text-5xl tracking-tight mb-8 md:mb-12'>
            Focus on <span className='text-[#0d824a]'>your</span> interviews,{' '}
            <span className='text-[#0d824a]'>We'll</span> handle the rest
          </h2>
          <p className='text-lg opacity-80 mb-12 md:mb-16'>
            Let our professionals manage your job applications while you prepare for what matters
            most - landing you a job as soon as possible.
          </p>

          <Link href='/auth/register'>
            <button className='btn btn-primary btn-wide'>Start Now</button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTA;
