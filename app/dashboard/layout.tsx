'use client';

import { ReactNode, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Home,
  Briefcase,
  FileText,
  ClipboardList,
  Users,
  Settings,
  Bell,
  Search,
  Menu as MenuIcon,
  X,
} from 'lucide-react';
import ButtonAccount from '@/components/ButtonAccount';
import { Dialog } from '@headlessui/react';

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: Home },
  { name: 'Update Preferences', href: '/dashboard/update-preferences', icon: Settings },
  { name: 'Applications', href: '/dashboard/applications', icon: Briefcase },
  { name: 'Resume Bank', href: '/dashboard/resumes', icon: FileText },
  { name: 'Your Assistant', href: '/dashboard/assistant', icon: Users },
];

function classNames(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div>
      {/* Mobile sidebar */}
      <Dialog
        as='div'
        open={sidebarOpen}
        onClose={setSidebarOpen}
        className='relative z-50 lg:hidden'
      >
        <div className='fixed inset-0 bg-gray-900/80' />
        <div className='fixed inset-0 flex'>
          <Dialog.Panel className='relative mr-16 flex w-full max-w-xs flex-1'>
            <div className='absolute left-full top-0 flex w-16 justify-center pt-5'>
              <button type='button' onClick={() => setSidebarOpen(false)} className='text-white'>
                <X className='h-6 w-6' />
              </button>
            </div>
            <div className='flex grow flex-col gap-y-5 overflow-y-auto bg-indigo-600 px-6 pb-4'>
              <SidebarContent currentPath={pathname || ''} />
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Static sidebar for desktop */}
      <div className='hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col'>
        <div className='flex grow flex-col gap-y-5 overflow-y-auto bg-indigo-600 px-6 pb-4'>
          <SidebarContent currentPath={pathname || ''} />
        </div>
      </div>

      <div className='lg:pl-72'>
        {/* Top nav */}
        <div className='sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8'>
          <button
            type='button'
            onClick={() => setSidebarOpen(true)}
            className='-m-2.5 p-2.5 text-gray-700 lg:hidden'
          >
            <MenuIcon className='h-6 w-6' />
          </button>

          <div className='flex flex-1 gap-x-4 self-stretch lg:gap-x-6'>
            <form className='relative flex flex-1'>
              <Search className='pointer-events-none absolute left-0 top-0 h-full w-5 text-gray-400' />
              <input
                type='search'
                placeholder='Search applications...'
                className='block w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm'
              />
            </form>

            <div className='flex items-center gap-x-4 lg:gap-x-6'>
              <button className='-m-2.5 p-2.5 text-gray-400 hover:text-gray-500'>
                <Bell className='h-6 w-6' />
              </button>

              <div className='hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10' />

              <ButtonAccount />
            </div>
          </div>
        </div>

        {/* Main content */}
        <main className='py-10'>
          <div className='px-4 sm:px-6 lg:px-8'>{children}</div>
        </main>
      </div>
    </div>
  );
}

function SidebarContent({ currentPath }: { currentPath: string }) {
  return (
    <>
      <div className='flex h-16 shrink-0 items-center'>
        <img src='/api/placeholder/32/32' alt='Your Company' className='h-8 w-auto' />
      </div>
      <nav className='flex flex-1 flex-col'>
        <ul role='list' className='flex flex-1 flex-col gap-y-7'>
          <li>
            <ul role='list' className='-mx-2 space-y-1'>
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={classNames(
                      currentPath === item.href
                        ? 'bg-indigo-700 text-white'
                        : 'text-indigo-200 hover:bg-indigo-700 hover:text-white',
                      'group flex gap-x-3 rounded-md p-2 text-sm font-semibold'
                    )}
                  >
                    <item.icon className='h-6 w-6 shrink-0' />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
          <li className='mt-auto'>
            <Link
              href='/dashboard/settings'
              className={classNames(
                currentPath === '/dashboard/settings'
                  ? 'bg-indigo-700 text-white'
                  : 'text-indigo-200 hover:bg-indigo-700 hover:text-white',
                'group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold'
              )}
            >
              <Settings className='h-6 w-6 shrink-0' />
              Settings
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}
