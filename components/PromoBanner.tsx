import { useState } from 'react';

interface PromoBannerProps {
  promoCode: string;
  message: string;
}

const PromoBanner = ({ promoCode, message }: PromoBannerProps) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className='bg-primary-500 text-white relative'>
      <div className='container mx-auto px-4 py-2 flex items-center justify-center'>
        <div className='flex items-center gap-2'>
          <span className='font-medium'>🎉</span>
          <span>
            {message} <span className='font-bold bg-white/20 px-2 py-0.5 rounded'>{promoCode}</span>
          </span>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className='text-white hover:text-white/80 transition-colors absolute right-4'
        >
          <span className='sr-only'>Close</span>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='w-5 h-5'
          >
            <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default PromoBanner;
