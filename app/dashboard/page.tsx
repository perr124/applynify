'use client';
import { useState } from 'react';
import { Dialog, Menu } from '@headlessui/react';
import {
  Home,
  Briefcase,
  FileText,
  ClipboardList,
  Users,
  Settings,
  Bell,
  Search,
  ChevronDown,
  Menu as MenuIcon,
  X,
} from 'lucide-react';
import ButtonAccount from '@/components/ButtonAccount';
import config from '@/config';
import ButtonCheckout from '@/components/ButtonCheckout';

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: Home, current: true },
  {
    name: 'Update Preferences',
    href: '/dashboard/update-preferences',
    icon: Settings,
    current: false,
  },
  { name: 'Applications', href: '/dashboard/applications', icon: Briefcase, current: false },
  { name: 'Resume Bank', href: '/dashboard/resumes', icon: FileText, current: false },
  { name: 'Your Assistant', href: '/dashboard/assistant', icon: Users, current: false },
];

const userNavigation = [
  { name: 'Your Profile', href: '/dashboard/profile' },
  { name: 'Settings', href: '/dashboard/settings' },
  // { name: 'Sign out', href: '/auth/signout' },
];

function classNames(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
              <SidebarContent />
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Static sidebar for desktop */}
      <div className='hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col'>
        <div className='flex grow flex-col gap-y-5 overflow-y-auto bg-indigo-600 px-6 pb-4'>
          <SidebarContent />
        </div>
      </div>
      <main className='min-h-screen p-8 pb-24'>
        {/* Main content */}
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

                {/* Profile dropdown */}
                <ButtonAccount />
              </div>
            </div>
          </div>

          {/* Dashboard content */}
          <main className='py-10'>
            <div className='px-4 sm:px-6 lg:px-8'>
              {/* Stats cards */}
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                <div className='rounded-lg bg-white shadow'>
                  <div className='p-6'>
                    <h3 className='font-semibold text-lg mb-2'>Active Applications</h3>
                    <p className='text-3xl font-bold text-indigo-600'>24</p>
                    <p className='text-sm text-gray-500'>Applications in progress</p>
                  </div>
                </div>

                <div className='rounded-lg bg-white shadow'>
                  <div className='p-6'>
                    <h3 className='font-semibold text-lg mb-2'>Interviews Scheduled</h3>
                    <p className='text-3xl font-bold text-green-600'>3</p>
                    <p className='text-sm text-gray-500'>Upcoming this week</p>
                  </div>
                </div>

                <div className='rounded-lg bg-white shadow'>
                  <div className='p-6'>
                    <h3 className='font-semibold text-lg mb-2'>Response Rate</h3>
                    <p className='text-3xl font-bold text-blue-600'>38%</p>
                    <p className='text-sm text-gray-500'>Average response rate</p>
                  </div>
                </div>

                <div className='rounded-lg bg-white shadow'>
                  <div className='p-6'>
                    <h3 className='font-semibold text-lg mb-2'>Subscription Status</h3>
                    <ButtonCheckout mode='payment' priceId={config.stripe.plans[0].priceId} />
                    <div className='mt-2 text-xs text-gray-500'>
                      Price ID: {config.stripe.plans[0].priceId}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent applications table */}
              <div className='mt-8'>
                <div className='rounded-lg bg-white shadow'>
                  <div className='p-6'>
                    <h3 className='font-semibold text-lg mb-4'>Recent Applications</h3>
                    <div className='overflow-x-auto'>
                      <table className='min-w-full divide-y divide-gray-200'>
                        <thead>
                          <tr>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                              Company
                            </th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                              Position
                            </th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                              Status
                            </th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                              Applied Date
                            </th>
                          </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-200'>
                          <tr>
                            <td className='px-6 py-4 whitespace-nowrap text-sm'>Google</td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm'>
                              Senior Developer
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap'>
                              <span className='px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800'>
                                In Review
                              </span>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm'>Nov 20, 2024</td>
                          </tr>
                          <tr>
                            <td className='px-6 py-4 whitespace-nowrap text-sm'>Microsoft</td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm'>Product Manager</td>
                            <td className='px-6 py-4 whitespace-nowrap'>
                              <span className='px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800'>
                                Interview
                              </span>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm'>Nov 18, 2024</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </main>
    </div>
  );
}

function SidebarContent() {
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
                  <a
                    href={item.href}
                    className={classNames(
                      item.current
                        ? 'bg-indigo-700 text-white'
                        : 'text-indigo-200 hover:bg-indigo-700 hover:text-white',
                      'group flex gap-x-3 rounded-md p-2 text-sm font-semibold'
                    )}
                  >
                    <item.icon className='h-6 w-6 shrink-0' />
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </li>
          <li className='mt-auto'>
            <a
              href='/dashboard/settings'
              className='group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold text-indigo-200 hover:bg-indigo-700 hover:text-white'
            >
              <Settings className='h-6 w-6 shrink-0' />
              Settings
            </a>
          </li>
        </ul>
      </nav>
    </>
  );
}
