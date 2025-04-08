'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { JobApplicationFormData, jobApplicationSchema } from '@/libs/validations/jobApplication';
import { useRouter, useParams } from 'next/navigation';
import { Plus, Trash2, Save, CheckCircle, MessageSquare } from 'lucide-react';
import { z } from 'zod';
import type {
  Resume,
  JobPreferences,
  Experience,
  Availability,
} from '@/libs/validations/userPreferences';
import toast from 'react-hot-toast';
import { PRICING_PLANS, getPlanByStripeId } from '@/libs/constants/pricing';

type User = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  priceId?: string;
  resumes?: Resume[];
  jobPreferences?: JobPreferences;
  experience?: Experience;
  availability?: Availability;
  hasUnreadMessages?: boolean;
};

// Modified schema for multiple applications
const multipleApplicationsSchema = z.object({
  applications: z.array(jobApplicationSchema),
});

type MultipleApplicationsData = z.infer<typeof multipleApplicationsSchema>;

export default function UserJobApplication() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [duplicateCompanies, setDuplicateCompanies] = useState<string[]>([]);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<MultipleApplicationsData>({
    defaultValues: {
      applications: [{}],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'applications',
  });

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    const loadApplications = async () => {
      try {
        const response = await fetch(`/api/job-applications?userId=${params?.userId}`);
        if (!response.ok) {
          throw new Error('Failed to load applications');
        }
        const applications = await response.json();
        if (applications && applications.length > 0) {
          // Reset form with existing applications
          reset({ applications });
        }
      } catch (error) {
        console.error('Error loading applications:', error);
        setError('Failed to load existing applications');
      }
    };
    loadApplications();
  }, [params?.userId, reset]);

  if (!params?.userId) return <div>Invalid user ID</div>;

  const defaultApplication = {
    jobTitle: '',
    companyName: '',
    location: '',
    jobType: 'remote' as const,
    employmentType: 'full-time' as const,
    jobLink: '',
    salary: '',
  };

  const fetchUser = async () => {
    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/admin/users/${params.userId}`);
      if (!response.ok) throw new Error('Failed to fetch user');
      const data = await response.json();
      setUser(data);
      setHasUnreadMessages(data.hasUnreadMessages || false);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to load user details');
    } finally {
      setIsSubmitting(false);
    }
  };

  const checkDuplicates = (applications: JobApplicationFormData[]) => {
    const companies = applications.map((app) => app.companyName.trim().toLowerCase());
    const duplicates = companies.filter(
      (company, index) => company && companies.indexOf(company) !== index
    );
    setDuplicateCompanies(Array.from(new Set(duplicates)));
    return duplicates.length > 0;
  };

  const onSubmit = async (data: MultipleApplicationsData, complete: boolean) => {
    if (checkDuplicates(data.applications)) {
      toast.error('Please remove duplicate company entries before saving');
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch('/api/job-applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          applications: data.applications,
          userId: params.userId,
          applicationComplete: complete,
        }),
      });

      if (!response.ok) throw new Error('Failed to submit applications');

      if (complete) {
        const emailResponse = await fetch('/api/notifications/application-complete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: params.userId,
            userEmail: user?.email,
            userName: `${user?.firstName} ${user?.lastName}`,
          }),
        });

        if (!emailResponse.ok) {
          console.error('Failed to send notification email');
        }

        // Only redirect if "Complete & Notify" was clicked
        router.push('/admin');
      } else {
        // Show toast notification for save action
        toast.success('Applications saved successfully');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to submit applications');
      toast.error('Failed to submit applications');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitting) return <div>Submitting...</div>;
  if (error) return <div className='p-4 text-red-500'>{error}</div>;
  if (!user) return <div className='p-4'>Loading...</div>;

  return (
    <div className='max-w-7xl mx-auto p-6'>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold mb-2'>Job Applications for User</h1>
        <div className='bg-gray-50 p-4 rounded-lg'>
          <p className='font-medium'>
            {user?.firstName} {user?.lastName}
          </p>
          <p className='text-gray-600'>{user?.email}</p>
          <div className='mt-4'>
            <a
              href={`/admin/users/${params.userId}/messages`}
              className='relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700'
            >
              {hasUnreadMessages && (
                <span className='absolute top-0 right-0 block h-2.5 w-2.5 transform -translate-y-1/2 translate-x-1/2 rounded-full bg-red-500 ring-2 ring-white'></span>
              )}
              <MessageSquare className='h-4 w-4 mr-2' />
              Message User
            </a>
          </div>
          <div className='mt-4'>
            {user?.priceId ? (
              <div className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <span className='font-medium text-gray-700'>
                    Plan: {getPlanByStripeId(user.priceId)?.name || 'Unknown'}
                  </span>
                  <span className='text-sm font-medium text-gray-900'>
                    {fields.length} / {getPlanByStripeId(user.priceId)?.applicationLimit || 0}
                  </span>
                </div>
                <div className='w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700'>
                  <div
                    className='bg-blue-600 h-2.5 rounded-full transition-all duration-300'
                    style={{
                      width: `${
                        (fields.length / (getPlanByStripeId(user.priceId)?.applicationLimit || 1)) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
                <p className='text-sm text-gray-500'>
                  {getPlanByStripeId(user.priceId)?.applicationLimit &&
                    getPlanByStripeId(user.priceId)!.applicationLimit - fields.length}{' '}
                  applications remaining
                </p>
              </div>
            ) : (
              <span className='text-yellow-600'>No active subscription</span>
            )}
          </div>
        </div>
      </div>

      {duplicateCompanies.length > 0 && (
        <div className='mb-4 p-4 bg-red-50 border border-red-200 rounded-md'>
          <p className='text-red-600'>
            Duplicate companies detected: {duplicateCompanies.join(', ')}
          </p>
          <p className='text-sm text-red-500'>Please remove duplicate entries before saving.</p>
        </div>
      )}

      <div className='bg-white shadow rounded-lg overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Job Title
                </th>
                <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Company
                </th>
                <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Location
                </th>
                <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Salary
                </th>
                <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Job Type
                </th>
                <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Employment
                </th>
                <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Link
                </th>
                <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Action
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {fields.map((field, index) => (
                <tr
                  key={field.id}
                  className={
                    duplicateCompanies.includes(
                      watch(`applications.${index}.companyName`)?.trim().toLowerCase() || ''
                    )
                      ? 'bg-red-50'
                      : ''
                  }
                >
                  <td className='px-4 py-2'>
                    <input
                      {...register(`applications.${index}.jobTitle`)}
                      className='w-full p-1 border rounded text-sm'
                      placeholder='Job Title'
                    />
                  </td>
                  <td className='px-4 py-2'>
                    <input
                      {...register(`applications.${index}.companyName`)}
                      className={`w-full p-1 border rounded text-sm ${
                        duplicateCompanies.includes(
                          watch(`applications.${index}.companyName`)?.trim().toLowerCase() || ''
                        )
                          ? 'border-red-500'
                          : ''
                      }`}
                      placeholder='Company'
                      onChange={(e) => {
                        register(`applications.${index}.companyName`).onChange(e);
                        checkDuplicates(watch('applications'));
                      }}
                    />
                  </td>
                  <td className='px-4 py-2'>
                    <input
                      {...register(`applications.${index}.location`)}
                      className='w-full p-1 border rounded text-sm'
                      placeholder='Location'
                    />
                  </td>
                  <td className='px-4 py-2'>
                    <input
                      {...register(`applications.${index}.salary`)}
                      className='w-full p-1 border rounded text-sm'
                      placeholder='Salary'
                    />
                  </td>
                  <td className='px-4 py-2'>
                    <select
                      {...register(`applications.${index}.jobType`)}
                      className='w-full p-1 border rounded text-sm'
                    >
                      <option value='remote'>Remote</option>
                      <option value='hybrid'>Hybrid</option>
                      <option value='on-site'>On-site</option>
                    </select>
                  </td>
                  <td className='px-4 py-2'>
                    <select
                      {...register(`applications.${index}.employmentType`)}
                      className='w-full p-1 border rounded text-sm'
                    >
                      <option value='full-time'>Full-time</option>
                      <option value='part-time'>Part-time</option>
                      <option value='contract'>Contract</option>
                      <option value='internship'>Internship</option>
                    </select>
                  </td>
                  <td className='px-4 py-2'>
                    <input
                      {...register(`applications.${index}.jobLink`)}
                      className='w-full p-1 border rounded text-sm'
                      placeholder='URL'
                      type='url'
                    />
                  </td>
                  <td className='px-4 py-2'>
                    <button
                      type='button'
                      onClick={() => remove(index)}
                      className='text-red-500 hover:text-red-700'
                    >
                      <Trash2 className='h-4 w-4' />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className='p-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center'>
          <button
            type='button'
            onClick={() => append(defaultApplication)}
            disabled={Boolean(
              user?.priceId &&
                fields.length >= (getPlanByStripeId(user.priceId)?.applicationLimit || 0)
            )}
            className='inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            <Plus className='h-4 w-4 mr-2' />
            Add Row
          </button>

          <div className='flex gap-4'>
            <button
              type='button'
              onClick={handleSubmit((data) => onSubmit(data, false))}
              disabled={isSubmitting}
              className='inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50'
            >
              <Save className='h-4 w-4 mr-2' />
              Save
            </button>

            <button
              type='button'
              onClick={handleSubmit((data) => onSubmit(data, true))}
              disabled={isSubmitting}
              className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700'
            >
              <CheckCircle className='h-4 w-4 mr-2' />
              Complete & Notify
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
