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

export default function DashboardHome() {
  return (
    <>
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
                    <td className='px-6 py-4 whitespace-nowrap text-sm'>Senior Developer</td>
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
    </>
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
