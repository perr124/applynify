import { ReactNode } from 'react';
import ButtonAccount from '@/components/ButtonAccount';

export default function PrivacyLayout({ children }: { children: ReactNode }) {
  return (
    <div className='min-h-screen flex flex-col'>
      <header className='bg-white shadow-sm'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between'>
          <a href='/' className='text-xl font-bold text-gray-900'>
            Applynify
          </a>
          <ButtonAccount />
        </div>
      </header>

      <main className='flex-grow'>{children}</main>

      <footer className='bg-gray-50 border-t'>
        <div className='max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8'>
          <p className='text-center text-sm text-gray-500'>
            © {new Date().getFullYear()} Applynify. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
