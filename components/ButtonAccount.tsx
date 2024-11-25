'use client';

import { useState } from 'react';
import { Menu } from '@headlessui/react';
import { useSession, signOut } from 'next-auth/react';
import { ChevronDown, Settings, LogOut } from 'lucide-react';
import apiClient from '@/libs/api';

function classNames(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

const ButtonAccount = () => {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  const handleBilling = async () => {
    setIsLoading(true);

    try {
      const { url }: { url: string } = await apiClient.post('/stripe/create-portal', {
        returnUrl: window.location.href,
      });

      window.location.href = url;
    } catch (e) {
      console.error(e);
    }

    setIsLoading(false);
  };

  if (status === 'unauthenticated') return null;

  return (
    <Menu as='div' className='relative'>
      <Menu.Button className='-m-1.5 flex items-center p-1.5'>
        {session?.user?.image ? (
          <img
            src={session.user.image}
            alt={session.user.name || 'Profile'}
            className='h-8 w-8 rounded-full bg-gray-50'
            referrerPolicy='no-referrer'
          />
        ) : (
          <div className='h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center'>
            {session?.user?.name?.charAt(0) || session?.user?.email?.charAt(0)}
          </div>
        )}
        <span className='hidden lg:flex lg:items-center'>
          <span className='ml-4 text-sm font-semibold text-gray-900'>
            {session?.user?.name || 'Account'}
          </span>
          <ChevronDown className={`ml-2 h-5 w-5 text-gray-400 ${isLoading ? 'hidden' : ''}`} />
          {isLoading && <span className='ml-2 loading loading-spinner loading-xs'></span>}
        </span>
      </Menu.Button>
      <Menu.Items className='absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none'>
        <Menu.Item>
          {({ active }) => (
            <button
              onClick={handleBilling}
              className={classNames(
                active ? 'bg-gray-50' : '',
                'flex w-full items-center px-3 py-1 text-sm text-gray-900'
              )}
            >
              <Settings className='mr-2 h-4 w-4' />
              Billing
            </button>
          )}
        </Menu.Item>
        <Menu.Item>
          {({ active }) => (
            <button
              onClick={handleSignOut}
              className={classNames(
                active ? 'bg-gray-50' : '',
                'flex w-full items-center px-3 py-1 text-sm text-gray-900'
              )}
            >
              <LogOut className='mr-2 h-4 w-4' />
              Sign out
            </button>
          )}
        </Menu.Item>
      </Menu.Items>
    </Menu>
  );
};

export default ButtonAccount;
