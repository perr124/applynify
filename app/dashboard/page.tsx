'use client';
import { useState, useEffect } from 'react';
import React from 'react';
// import { Dialog, Menu } from '@headlessui/react';
import {
  Briefcase,
  FileText,
  CheckCircle,
  AlertCircle,
  Clock,
  XCircle,
  ChevronRight,
  Frown,
  Meh,
  Smile,
} from 'lucide-react';
// import ButtonAccount from '@/components/ButtonAccount';
// import config from '@/config';
// import ButtonCheckout from '@/components/ButtonCheckout';
import apiClient from '@/libs/api';
import { toast } from 'react-hot-toast';

function classNames(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

type ProfileStatus = {
  preferences: boolean;
  resume: boolean;
  applicationsStatus?: 'started' | 'completed';
  totalApplications?: number;
};

export default function DashboardHome() {
  const [profileStatus, setProfileStatus] = useState<ProfileStatus>({
    preferences: false,
    resume: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedbackRating, setFeedbackRating] = useState<'sad' | 'mid' | 'happy' | null>(null);
  const [feedbackNotes, setFeedbackNotes] = useState<string>('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<boolean>(false);

  useEffect(() => {
    const checkProfileStatus = async () => {
      try {
        // Fetch preferences
        const prefsResponse = await fetch('/api/user/preferences');
        const prefsData = await prefsResponse.json();

        // Fetch resumes
        const resumesResponse = await fetch('/api/resumes');
        const resumesData = await resumesResponse.json();

        // Fetch applications if status is completed
        let totalApplications;
        if (prefsData.applicationsStatus === 'completed') {
          const applicationsResponse = await fetch('/api/job-applications');
          const applicationsData = await applicationsResponse.json();
          totalApplications = applicationsData.length;
        }

        setProfileStatus({
          preferences: hasCompletedPreferences(prefsData),
          resume: resumesData.length > 0,
          applicationsStatus: prefsData.applicationsStatus || 'started',
          totalApplications,
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
          <>
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

            {/* Add the new applications count section */}
            {profileStatus.applicationsStatus === 'completed' &&
              profileStatus.totalApplications !== undefined && (
                <div className='mt-4 pt-4 border-t border-gray-200'>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm text-gray-500'>Total Applications</span>
                    <span className='text-lg font-semibold text-gray-900'>
                      {profileStatus.totalApplications}
                    </span>
                  </div>
                </div>
              )}
          </>
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

      {/* Feedback Section */}
      <div className='bg-white shadow rounded-lg p-6'>
        <h2 className='text-lg font-semibold text-gray-900 mb-2'>Share Feedback</h2>
        <p className='text-sm text-gray-500 mb-4'>
          How satisfied are you with Applynify? Leave an optional note below.
        </p>
        <div className='flex items-center space-x-6 mb-4'>
          <button
            className={`group flex flex-col items-center outline-none ${
              feedbackRating === 'sad' ? 'scale-105' : 'hover:scale-105'
            }`}
            onClick={() => setFeedbackRating('sad')}
            aria-label='Unhappy'
            title='Unhappy'
            aria-pressed={feedbackRating === 'sad'}
          >
            <div
              className={`h-14 w-14 rounded-full border flex items-center justify-center transition-all ${
                feedbackRating === 'sad'
                  ? 'border-red-500 bg-red-50 ring-2 ring-red-200'
                  : 'border-gray-300 bg-white hover:border-red-300'
              }`}
            >
              <Frown
                className={`h-7 w-7 ${
                  feedbackRating === 'sad'
                    ? 'text-red-700'
                    : 'text-red-400 group-hover:text-red-500'
                }`}
              />
            </div>
            <span
              className={`mt-2 text-xs ${
                feedbackRating === 'sad'
                  ? 'text-red-700 font-medium'
                  : 'text-gray-500 group-hover:text-red-500'
              }`}
            >
              Unhappy
            </span>
          </button>
          <button
            className={`group flex flex-col items-center outline-none ${
              feedbackRating === 'mid' ? 'scale-105' : 'hover:scale-105'
            }`}
            onClick={() => setFeedbackRating('mid')}
            aria-label='Okay'
            title='Okay'
            aria-pressed={feedbackRating === 'mid'}
          >
            <div
              className={`h-14 w-14 rounded-full border flex items-center justify-center transition-all ${
                feedbackRating === 'mid'
                  ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-200'
                  : 'border-gray-300 bg-white hover:border-amber-300'
              }`}
            >
              <Meh
                className={`h-7 w-7 ${
                  feedbackRating === 'mid'
                    ? 'text-amber-700'
                    : 'text-amber-400 group-hover:text-amber-500'
                }`}
              />
            </div>
            <span
              className={`mt-2 text-xs ${
                feedbackRating === 'mid'
                  ? 'text-amber-700 font-medium'
                  : 'text-gray-500 group-hover:text-amber-500'
              }`}
            >
              Okay
            </span>
          </button>
          <button
            className={`group flex flex-col items-center outline-none ${
              feedbackRating === 'happy' ? 'scale-105' : 'hover:scale-105'
            }`}
            onClick={() => setFeedbackRating('happy')}
            aria-label='Happy'
            title='Happy'
            aria-pressed={feedbackRating === 'happy'}
          >
            <div
              className={`h-14 w-14 rounded-full border flex items-center justify-center transition-all ${
                feedbackRating === 'happy'
                  ? 'border-green-500 bg-green-50 ring-2 ring-green-200'
                  : 'border-gray-300 bg-white hover:border-green-300'
              }`}
            >
              <Smile
                className={`h-7 w-7 ${
                  feedbackRating === 'happy'
                    ? 'text-green-700'
                    : 'text-green-400 group-hover:text-green-500'
                }`}
              />
            </div>
            <span
              className={`mt-2 text-xs ${
                feedbackRating === 'happy'
                  ? 'text-green-700 font-medium'
                  : 'text-gray-500 group-hover:text-green-500'
              }`}
            >
              Happy
            </span>
          </button>
        </div>
        <textarea
          className='w-full border border-gray-200 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500'
          rows={3}
          placeholder='Optional: tell us more (max 2000 characters)'
          maxLength={2000}
          value={feedbackNotes}
          onChange={(e) => setFeedbackNotes(e.target.value)}
        />
        <div className='mt-3 flex items-center justify-between'>
          <span className='text-xs text-gray-400'>{feedbackNotes.length}/2000</span>
          <button
            className='btn bg-primary-500 hover:bg-primary-800'
            disabled={!feedbackRating || isSubmitting || feedbackSubmitted}
            onClick={async () => {
              if (!feedbackRating) return;
              setIsSubmitting(true);
              setError(null);
              try {
                await apiClient.post('/user/feedback', {
                  rating: feedbackRating,
                  notes: feedbackNotes || undefined,
                });
                setFeedbackSubmitted(true);
                toast.success('Thanks for your feedback!');
              } catch (e: any) {
                setError(e?.message || 'Failed to send feedback');
              } finally {
                setIsSubmitting(false);
              }
            }}
          >
            {isSubmitting ? 'Sending...' : feedbackSubmitted ? 'Submitted' : 'Send Feedback'}
          </button>
        </div>
        {error && <p className='text-sm text-red-600 mt-2'>{error}</p>}
      </div>

      {/* Subscription Button */}
      <div className='bg-white shadow rounded-lg p-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h2 className='text-lg font-semibold text-gray-900'>Need More Applications?</h2>
            <p className='mt-1 text-sm text-gray-500'>
              Increase your chances of landing your dream job with more applications
            </p>
          </div>
          <a
            href='/dashboard/subscription'
            className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-500 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
          >
            View Plans
            <ChevronRight className='ml-2 h-4 w-4' />
          </a>
        </div>
      </div>
    </div>
  );
}
