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
        {/* Trustpilot Badge */}
        <div className='flex items-center gap-2 px-3 py-1.5 bg-white/90 dark:bg-base-100/50 backdrop-blur-sm rounded-full shadow-lg border border-gray-100 -mb-8'>
          <span className='text-sm font-bold text-gray-800'>Excellent</span>
          <div className='flex items-center gap-0.5'>
            {[...Array(4)].map((_, i) => (
              <svg
                key={i}
                className='w-5 h-5'
                viewBox='0 0 48 48'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <rect width='48' height='48' fill='#00B67A' />
                <path
                  d='M24 12L26.472 20.528H35.416L28.472 25.472L30.944 34L24 29.056L17.056 34L19.528 25.472L12.584 20.528H21.528L24 12Z'
                  fill='white'
                />
              </svg>
            ))}
            {/* Partial star for 0.7 */}
            <svg
              className='w-5 h-5'
              viewBox='0 0 48 48'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <defs>
                <linearGradient id='partialFill'>
                  <stop offset='70%' stopColor='#00B67A' />
                  <stop offset='70%' stopColor='#E1E1E1' />
                </linearGradient>
              </defs>
              <rect width='48' height='48' fill='url(#partialFill)' />
              <path
                d='M24 12L26.472 20.528H35.416L28.472 25.472L30.944 34L24 29.056L17.056 34L19.528 25.472L12.584 20.528H21.528L24 12Z'
                fill='white'
              />
            </svg>
          </div>
          <div className='flex items-center gap-1.5'>
            <svg
              className='w-4 h-4'
              viewBox='0 0 48 48'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <defs>
                <linearGradient id='starGradient' x1='0%' y1='0%' x2='100%' y2='100%'>
                  <stop offset='0%' stopColor='#00B67A' />
                  <stop offset='50%' stopColor='#00D68F' />
                  <stop offset='100%' stopColor='#00B67A' />
                </linearGradient>
                <filter id='starGlow'>
                  <feGaussianBlur stdDeviation='1' result='coloredBlur' />
                  <feMerge>
                    <feMergeNode in='coloredBlur' />
                    <feMergeNode in='SourceGraphic' />
                  </feMerge>
                </filter>
              </defs>
              <rect
                width='48'
                height='48'
                rx='6'
                fill='url(#starGradient)'
                filter='url(#starGlow)'
              />
              <path
                d='M24 12L26.472 20.528H35.416L28.472 25.472L30.944 34L24 29.056L17.056 34L19.528 25.472L12.584 20.528H21.528L24 12Z'
                fill='white'
                opacity='0.95'
              />
              <path
                d='M24 12L26.472 20.528H35.416L28.472 25.472L30.944 34L24 29.056L17.056 34L19.528 25.472L12.584 20.528H21.528L24 12Z'
                fill='white'
                opacity='0.3'
                transform='scale(0.8) translate(4.8, 4.8)'
              />
            </svg>
            <span className='text-sm font-bold text-gray-800'>Trustpilot</span>
          </div>
        </div>

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
            Our team of dedicated human assistants take care of your job applications from start to
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

        {/* Companies */}
        <div className='w-full pt-8'>
          <p className='text-sm text-base-content/60 mb-6'>
            Trusted by job seekers landing roles at leading companies
          </p>
          <div className='flex flex-nowrap items-center justify-center md:justify-center gap-8 md:gap-12 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300 overflow-x-auto scrollbar-hide px-4 md:px-0'>
            {/* Google */}
            <svg
              className='h-8 w-auto'
              viewBox='0 0 272 92'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z'
                fill='#EA4335'
              />
              <path
                d='M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z'
                fill='#FBBC05'
              />
              <path
                d='M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z'
                fill='#4285F4'
              />
              <path d='M225 3v65h-9.5V3h9.5z' fill='#34A853' />
              <path
                d='M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z'
                fill='#EA4335'
              />
              <path
                d='M35.29 41.41V32H67c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35.36 53.89.36 34.91.36 15.93 16.32.47 35.3.47c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.97-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.65l-22.49.01z'
                fill='#4285F4'
              />
            </svg>
            {/* Microsoft */}
            <svg className='h-8 w-auto' viewBox='0 0 23 23' xmlns='http://www.w3.org/2000/svg'>
              <path d='M0 0h10.85v10.85H0V0z' fill='#F25022' />
              <path d='M12.15 0H23v10.85H12.15V0z' fill='#7FBA00' />
              <path d='M0 12.15h10.85V23H0V12.15z' fill='#00A4EF' />
              <path d='M12.15 12.15H23V23H12.15V12.15z' fill='#FFB900' />
            </svg>
            {/* Amazon */}
            <svg
              className='h-7 w-auto'
              viewBox='0 0 283 88'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M242.78 61.6c-24.53 18.1-60.13 27.71-90.74 27.71-42.93 0-81.58-15.88-110.83-42.32-2.3-2.08-.24-4.91 2.52-3.29 31.58 18.37 70.61 29.43 110.94 29.43 27.19 0 57.13-5.64 84.64-17.32 4.14-1.77 7.62 2.71 3.47 5.79z'
                fill='#FF9900'
              />
              <path
                d='M254.17 48.31c-3.13-4.01-20.74-.95-28.66.48-2.41.43-2.78-1.81-.61-3.32 14.03-9.87 37.04-7.02 39.71-3.71 2.67 3.32-.71 26.32-13.84 37.31-2.02 1.69-3.94.79-3.05-1.45 2.97-7.42 9.58-24.07 6.45-29.31z'
                fill='#FF9900'
              />
            </svg>
            {/* Apple */}
            <svg
              className='h-8 w-auto'
              viewBox='0 0 814 1000'
              fill='#000'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path d='M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57-155.5-127C46.7 790.7 0 663 0 541.8c0-194.4 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z' />
            </svg>
            {/* Target */}
            <svg
              className='h-8 w-auto'
              viewBox='0 0 180 50'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <circle cx='25' cy='25' r='22' fill='#CC0000' />
              <circle cx='25' cy='25' r='17' fill='white' />
              <circle cx='25' cy='25' r='11' fill='#CC0000' />
              <circle cx='25' cy='25' r='5' fill='white' />
              <text
                x='58'
                y='32'
                fontSize='24'
                fontFamily='Helvetica, Arial, sans-serif'
                fontWeight='bold'
                fill='#CC0000'
              >
                TARGET
              </text>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
