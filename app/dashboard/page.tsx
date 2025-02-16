'use client';
import { useState, useEffect } from 'react';
import React from 'react';
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
  CheckCircle,
  AlertCircle,
  Clock,
  XCircle,
} from 'lucide-react';
import ButtonAccount from '@/components/ButtonAccount';
import config from '@/config';
import ButtonCheckout from '@/components/ButtonCheckout';

function classNames(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

type ProfileStatus = {
  preferences: boolean;
  resume: boolean;
  applicationsStatus?: 'started' | 'completed';
};

export default function DashboardHome() {
  const [profileStatus, setProfileStatus] = useState<ProfileStatus>({
    preferences: false,
    resume: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkProfileStatus = async () => {
      try {
        // Fetch preferences
        const prefsResponse = await fetch('/api/user/preferences');
        const prefsData = await prefsResponse.json();

        // Fetch resumes
        const resumesResponse = await fetch('/api/resumes');
        const resumesData = await resumesResponse.json();

        setProfileStatus({
          preferences: hasCompletedPreferences(prefsData),
          resume: resumesData.length > 0,
          applicationsStatus: prefsData.applicationsStatus || 'started',
        });
      } catch (error) {
        console.error('Error fetching profile status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkProfileStatus();
  }, []);

  const hasCompletedPreferences = (prefs: any) => {
    return (
      prefs.jobPreferences?.roles?.length > 0 &&
      prefs.experience?.yearsOfExperience &&
      prefs.availability?.startDate
    );
  };

  const getApplicationStatusInfo = (status: string) => {
    switch (status) {
      case 'started':
        return {
          icon: Clock,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          label: 'Applications Started',
          description: 'Your application process has begun',
        };
      case 'completed':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          label: 'Applications Completed',
          description: 'All applications have been processed',
        };
      default:
        return {
          icon: XCircle,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          label: 'Status Unknown',
          description: 'Unable to determine status',
        };
    }
  };

  if (isLoading) {
    return (
      <div className='animate-pulse space-y-6'>
        <div className='h-48 bg-gray-200 rounded-lg'></div>
        <div className='h-64 bg-gray-200 rounded-lg'></div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Application Status Widget */}
      <div className='bg-white shadow rounded-lg p-6'>
        <h2 className='text-lg font-semibold text-gray-900 mb-4'>Application Status</h2>
        {profileStatus.applicationsStatus && (
          <div
            className={classNames(
              'rounded-lg border p-4',
              getApplicationStatusInfo(profileStatus.applicationsStatus).borderColor,
              getApplicationStatusInfo(profileStatus.applicationsStatus).bgColor
            )}
          >
            <div className='flex items-center'>
              <div
                className={classNames(
                  'flex-shrink-0 mr-3',
                  getApplicationStatusInfo(profileStatus.applicationsStatus).color
                )}
              >
                {React.createElement(
                  getApplicationStatusInfo(profileStatus.applicationsStatus).icon,
                  {
                    className: 'h-6 w-6',
                  }
                )}
              </div>
              <div>
                <h3 className='text-sm font-medium text-gray-900'>
                  {getApplicationStatusInfo(profileStatus.applicationsStatus).label}
                </h3>
                <p className='mt-1 text-sm text-gray-500'>
                  {getApplicationStatusInfo(profileStatus.applicationsStatus).description}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Profile Completion Section */}
      <div className='bg-white shadow rounded-lg p-6'>
        <h2 className='text-lg font-semibold text-gray-900 mb-4'>Profile Completion</h2>
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center'>
              <Briefcase className='h-5 w-5 text-gray-400 mr-2' />
              <span className='text-sm text-gray-700'>Job Preferences</span>
            </div>
            {profileStatus.preferences ? (
              <div className='flex items-center text-green-600'>
                <CheckCircle className='h-5 w-5 mr-1' />
                <span className='text-sm'>Complete</span>
              </div>
            ) : (
              <div className='flex items-center text-amber-600'>
                <AlertCircle className='h-5 w-5 mr-1' />
                <span className='text-sm'>Incomplete</span>
              </div>
            )}
          </div>

          <div className='flex items-center justify-between'>
            <div className='flex items-center'>
              <FileText className='h-5 w-5 text-gray-400 mr-2' />
              <span className='text-sm text-gray-700'>Resume</span>
            </div>
            {profileStatus.resume ? (
              <div className='flex items-center text-green-600'>
                <CheckCircle className='h-5 w-5 mr-1' />
                <span className='text-sm'>Uploaded</span>
              </div>
            ) : (
              <div className='flex items-center text-amber-600'>
                <AlertCircle className='h-5 w-5 mr-1' />
                <span className='text-sm'>Not uploaded</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Next Steps Section */}
      <div className='bg-white shadow rounded-lg p-6'>
        <h2 className='text-lg font-semibold text-gray-900 mb-4'>Next Steps</h2>
        <div className='space-y-4'>
          {!profileStatus.preferences && (
            <div className='flex items-start space-x-3'>
              <div className='flex-shrink-0'>
                <div className='h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center'>
                  <span className='text-amber-600 font-medium'>1</span>
                </div>
              </div>
              <div>
                <h3 className='text-sm font-medium text-gray-900'>Complete Your Preferences</h3>
                <p className='mt-1 text-sm text-gray-500'>
                  Tell us about your ideal job, experience, and availability.
                </p>
                <a
                  href='/dashboard/update-preferences'
                  className='mt-2 inline-flex items-center text-sm text-primary-600 hover:text-primary-500'
                >
                  Update Preferences →
                </a>
              </div>
            </div>
          )}

          {!profileStatus.resume && (
            <div className='flex items-start space-x-3'>
              <div className='flex-shrink-0'>
                <div className='h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center'>
                  <span className='text-amber-600 font-medium'>2</span>
                </div>
              </div>
              <div>
                <h3 className='text-sm font-medium text-gray-900'>Upload Your Resume</h3>
                <p className='mt-1 text-sm text-gray-500'>
                  Add your resume to start applying for jobs.
                </p>
                <a
                  href='/dashboard/resumes'
                  className='mt-2 inline-flex items-center text-sm text-primary-600 hover:text-primary-500'
                >
                  Manage Resumes →
                </a>
              </div>
            </div>
          )}

          {profileStatus.preferences && profileStatus.resume && (
            <div className='text-center py-4'>
              <CheckCircle className='h-12 w-12 text-green-500 mx-auto mb-4' />
              <h3 className='text-lg font-medium text-gray-900'>You're All Set!</h3>
              <p className='mt-1 text-sm text-gray-500'>
                Your profile is complete. We'll start looking for jobs that match your preferences.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Subscription Status */}
      {/* <div className='bg-white shadow rounded-lg p-6'>
        <h2 className='text-lg font-semibold text-gray-900 mb-4'>Subscription Status</h2>
        <ButtonCheckout mode='payment' priceId={config.stripe.plans[0].priceId} />
        <div className='mt-2 text-xs text-gray-500'>Price ID: {config.stripe.plans[0].priceId}</div>
      </div> */}
    </div>
  );
}
