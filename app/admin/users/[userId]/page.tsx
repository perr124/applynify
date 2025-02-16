'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { JobApplicationFormData, jobApplicationSchema } from '@/libs/validations/jobApplication';
import { useRouter } from 'next/navigation';

type User = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
};

export default function UserJobApplication({ params }: { params: { userId: string } }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<JobApplicationFormData>({
    resolver: zodResolver(jobApplicationSchema),
  });

  useEffect(() => {
    // Fetch user details
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/admin/users/${params.userId}`);
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Error fetching user:', error);
        setError('Failed to load user details');
      }
    };

    fetchUser();
  }, [params.userId]);

  const onSubmit = async (data: JobApplicationFormData, complete: boolean) => {
    try {
      setIsSubmitting(true);
      const response = await fetch('/api/job-applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          userId: params.userId,
          applicationComplete: complete,
        }),
      });

      if (!response.ok) throw new Error('Failed to submit application');

      if (complete) {
        // Update user's application status if complete
        await fetch(`/api/admin/users/${params.userId}/status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            applicationsStatus: 'completed',
          }),
        });
      }

      reset();
      router.push('/admin'); // Return to admin dashboard
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to submit job application');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error) {
    return <div className='p-4 text-red-500'>{error}</div>;
  }

  if (!user) {
    return <div className='p-4'>Loading...</div>;
  }

  return (
    <div className='max-w-4xl mx-auto p-6'>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold mb-2'>Job Application for User</h1>
        <div className='bg-gray-50 p-4 rounded-lg'>
          <p className='font-medium'>
            {user.firstName} {user.lastName}
          </p>
          <p className='text-gray-600'>{user.email}</p>
        </div>
      </div>

      <div className='bg-white shadow rounded-lg p-6'>
        <form className='space-y-4'>
          <div>
            <label className='block mb-2'>Job Title</label>
            <input {...register('jobTitle')} className='w-full p-2 border rounded' type='text' />
            {errors.jobTitle && <p className='text-red-500'>{errors.jobTitle.message}</p>}
          </div>

          <div>
            <label className='block mb-2'>Company Name</label>
            <input {...register('companyName')} className='w-full p-2 border rounded' type='text' />
            {errors.companyName && <p className='text-red-500'>{errors.companyName.message}</p>}
          </div>

          <div>
            <label className='block mb-2'>Location</label>
            <input {...register('location')} className='w-full p-2 border rounded' type='text' />
            {errors.location && <p className='text-red-500'>{errors.location.message}</p>}
          </div>

          <div>
            <label className='block mb-2'>Salary (Optional)</label>
            <input {...register('salary')} className='w-full p-2 border rounded' type='text' />
          </div>

          <div>
            <label className='block mb-2'>Job Type</label>
            <select {...register('jobType')} className='w-full p-2 border rounded'>
              <option value='remote'>Remote</option>
              <option value='hybrid'>Hybrid</option>
              <option value='on-site'>On-site</option>
            </select>
            {errors.jobType && <p className='text-red-500'>{errors.jobType.message}</p>}
          </div>

          <div>
            <label className='block mb-2'>Employment Type</label>
            <select {...register('employmentType')} className='w-full p-2 border rounded'>
              <option value='full-time'>Full-time</option>
              <option value='contract'>Contract</option>
              <option value='part-time'>Part-time</option>
            </select>
            {errors.employmentType && (
              <p className='text-red-500'>{errors.employmentType.message}</p>
            )}
          </div>

          <div>
            <label className='block mb-2'>Job Link</label>
            <input {...register('jobLink')} className='w-full p-2 border rounded' type='url' />
            {errors.jobLink && <p className='text-red-500'>{errors.jobLink.message}</p>}
          </div>

          <div className='flex gap-4 mt-6'>
            <button
              type='button'
              onClick={handleSubmit((data) => onSubmit(data, false))}
              disabled={isSubmitting}
              className='flex-1 bg-gray-500 text-white p-2 rounded hover:bg-gray-600 disabled:bg-gray-300'
            >
              {isSubmitting ? 'Saving...' : 'Save Draft'}
            </button>

            <button
              type='button'
              onClick={handleSubmit((data) => onSubmit(data, true))}
              disabled={isSubmitting}
              className='flex-1 bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:bg-green-300'
            >
              {isSubmitting ? 'Completing...' : 'Complete Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
