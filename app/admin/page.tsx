'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { JobApplicationFormData, jobApplicationSchema } from '@/libs/validations/jobApplication';
import { Search, UserPlus } from 'lucide-react';
import Link from 'next/link';

type User = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
};

export default function AdminPanel() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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
    fetchUsers();
  }, [searchQuery]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/admin/users?search=${searchQuery}`);
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: JobApplicationFormData) => {
    if (!selectedUser) {
      alert('Please select a user first');
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
          ...data,
          userId: selectedUser._id,
        }),
      });

      if (!response.ok) throw new Error('Failed to submit application');

      reset();
      setSelectedUser(null);
      alert('Job application submitted successfully');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to submit job application');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='max-w-7xl mx-auto p-6'>
      <div className='mb-8'>
        <h1 className='text-2xl font-bold mb-4'>Admin Dashboard</h1>

        {/* User Search Section */}
        <div className='bg-white p-6 rounded-lg shadow mb-6'>
          <div className='flex items-center gap-4 mb-4'>
            <div className='flex-1'>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
                <input
                  type='text'
                  placeholder='Search users by name or email...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='w-full pl-10 pr-4 py-2 border rounded-lg'
                />
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className='animate-pulse'>
              {[...Array(5)].map((_, index) => (
                <div key={index} className='flex items-center space-x-4 py-3'>
                  <div className='h-4 bg-gray-200 rounded w-1/4'></div>
                  <div className='h-4 bg-gray-200 rounded w-1/4'></div>
                  <div className='h-4 bg-gray-200 rounded w-1/4'></div>
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className='text-red-500 p-4 text-center bg-red-50 rounded-lg'>
              {error}
              <button
                onClick={fetchUsers}
                className='ml-2 text-red-700 underline hover:no-underline'
              >
                Try again
              </button>
            </div>
          )}

          {/* Users Table */}
          {!isLoading && !error && (
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Name
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Email
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={5} className='px-6 py-4 text-center text-gray-500'>
                        No users found
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user._id}>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          {user.firstName} {user.lastName}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>{user.email}</td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <Link
                            href={`/admin/users/${user._id}`}
                            className='text-primary-600 hover:text-primary-900'
                          >
                            Edit Application
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Selected User Info */}
        {selectedUser && (
          <div className='bg-primary-50 p-4 rounded-lg mb-6'>
            <h2 className='font-semibold'>Selected User:</h2>
            <p>
              {selectedUser.firstName} {selectedUser.lastName} ({selectedUser.email})
            </p>
          </div>
        )}

        {/* Job Application Form */}
        {selectedUser && (
          <div className='bg-white shadow rounded-lg p-6'>
            <h2 className='text-xl font-bold mb-6'>Submit Job Application</h2>

            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
              <div>
                <label className='block mb-2'>Job Title</label>
                <input
                  {...register('jobTitle')}
                  className='w-full p-2 border rounded'
                  type='text'
                />
                {errors.jobTitle && <p className='text-red-500'>{errors.jobTitle.message}</p>}
              </div>

              <div>
                <label className='block mb-2'>Company Name</label>
                <input
                  {...register('companyName')}
                  className='w-full p-2 border rounded'
                  type='text'
                />
                {errors.companyName && <p className='text-red-500'>{errors.companyName.message}</p>}
              </div>

              <div>
                <label className='block mb-2'>Location</label>
                <input
                  {...register('location')}
                  className='w-full p-2 border rounded'
                  type='text'
                />
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

              <button
                type='submit'
                disabled={isSubmitting}
                className='w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300'
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
