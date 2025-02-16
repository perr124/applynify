'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { JobApplicationFormData, jobApplicationSchema } from '@/libs/validations/jobApplication';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Save, CheckCircle } from 'lucide-react';
import { z } from 'zod';

type User = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
};

// Modified schema for multiple applications
const multipleApplicationsSchema = z.object({
  applications: z.array(jobApplicationSchema),
});

type MultipleApplicationsData = z.infer<typeof multipleApplicationsSchema>;

export default function UserJobApplication({ params }: { params: { userId: string } }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MultipleApplicationsData>({
    defaultValues: {
      applications: [{}], // Start with one empty row
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'applications',
  });

  useEffect(() => {
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

  const onSubmit = async (data: MultipleApplicationsData, complete: boolean) => {
    try {
      setIsSubmitting(true);

      // Submit all applications
      for (const application of data.applications) {
        const response = await fetch('/api/job-applications', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...application,
            userId: params.userId,
            applicationComplete: complete,
          }),
        });

        if (!response.ok) throw new Error('Failed to submit application');
      }

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

      router.push('/admin');
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to submit applications');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error) return <div className='p-4 text-red-500'>{error}</div>;
  if (!user) return <div className='p-4'>Loading...</div>;

  return (
    <div className='max-w-7xl mx-auto p-6'>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold mb-2'>Job Applications for User</h1>
        <div className='bg-gray-50 p-4 rounded-lg'>
          <p className='font-medium'>
            {user.firstName} {user.lastName}
          </p>
          <p className='text-gray-600'>{user.email}</p>
        </div>
      </div>

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
                <tr key={field.id}>
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
                      className='w-full p-1 border rounded text-sm'
                      placeholder='Company'
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
                      <option value='contract'>Contract</option>
                      <option value='part-time'>Part-time</option>
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
            onClick={() => append({})}
            className='inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50'
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
              Save Draft
            </button>

            <button
              type='button'
              onClick={handleSubmit((data) => onSubmit(data, true))}
              disabled={isSubmitting}
              className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700'
            >
              <CheckCircle className='h-4 w-4 mr-2' />
              Complete All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
