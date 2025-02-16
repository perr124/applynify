'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { JobApplicationFormData, jobApplicationSchema } from '@/libs/validations/jobApplication';
import { useRouter, useParams } from 'next/navigation';
import { Plus, Trash2, Save, CheckCircle } from 'lucide-react';
import { z } from 'zod';
import type {
  Resume,
  JobPreferences,
  Experience,
  Availability,
} from '@/libs/validations/userPreferences';

type User = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  resumes?: Resume[];
  jobPreferences?: JobPreferences;
  experience?: Experience;
  availability?: Availability;
};

// Modified schema for multiple applications
const multipleApplicationsSchema = z.object({
  applications: z.array(jobApplicationSchema),
});

type MultipleApplicationsData = z.infer<typeof multipleApplicationsSchema>;

export default function UserJobApplication() {
  const params = useParams();
  const router = useRouter();

  if (!params?.userId) return <div>Invalid user ID</div>;

  const [user, setUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<MultipleApplicationsData>({
    defaultValues: {
      applications: [{}], // Start with one empty row
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'applications',
  });

  const defaultApplication = {
    jobTitle: '',
    companyName: '',
    location: '',
    jobType: 'remote' as const,
    employmentType: 'full-time' as const,
    jobLink: '',
    salary: '',
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/admin/users/${params.userId}`);
      if (!response.ok) throw new Error('Failed to fetch user');
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to load user details');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = async (data: MultipleApplicationsData, complete: boolean) => {
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
        router.push('/admin');
      } else {
        alert('Applications saved successfully');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to submit applications');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const loadApplications = async () => {
      try {
        const response = await fetch(`/api/job-applications?userId=${params.userId}`);
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
  }, [params.userId, reset]);

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
        </div>
      </div>

      {/* Resume History Section */}
      <div className='bg-white rounded-lg shadow mb-6'>
        <div className='px-6 py-4 border-b border-gray-200'>
          <h2 className='text-lg font-medium'>Resume History</h2>
        </div>
        <div className='p-6'>
          {user?.resumes && user.resumes.length > 0 ? (
            <div className='space-y-4'>
              {user.resumes.map((resume) => (
                <div
                  key={resume.id}
                  className='flex items-center justify-between p-4 bg-gray-50 rounded-lg'
                >
                  <div className='flex-1'>
                    <h3 className='font-medium'>{resume.filename}</h3>
                    <p className='text-sm text-gray-500'>
                      Uploaded on {new Date(resume.uploadedAt).toLocaleDateString()}
                    </p>
                    <p className='text-sm text-gray-500'>Status: {resume.status}</p>
                  </div>
                  <a
                    href={resume.url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='ml-4 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                  >
                    View Resume
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p className='text-gray-500'>No resumes uploaded</p>
          )}
        </div>
      </div>

      {/* User Preferences Section */}
      <div className='bg-white rounded-lg shadow mb-6'>
        <div className='px-6 py-4 border-b border-gray-200'>
          <h2 className='text-lg font-medium'>User Preferences</h2>
        </div>
        <div className='p-6'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {/* Job Preferences */}
            {user?.jobPreferences && (
              <div>
                <h3 className='font-medium mb-4'>Job Preferences</h3>
                <dl className='space-y-4'>
                  <div>
                    <dt className='text-sm font-medium text-gray-500'>Desired Roles</dt>
                    <dd className='mt-1'>
                      <div className='flex flex-wrap gap-2'>
                        {user.jobPreferences.roles.map((role, index) => (
                          <span
                            key={index}
                            className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    </dd>
                  </div>
                  <div>
                    <dt className='text-sm font-medium text-gray-500'>Locations</dt>
                    <dd className='mt-1'>
                      <div className='flex flex-wrap gap-2'>
                        {user.jobPreferences.locations.map((location, index) => (
                          <span
                            key={index}
                            className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'
                          >
                            {location}
                          </span>
                        ))}
                      </div>
                    </dd>
                  </div>
                  <div>
                    <dt className='text-sm font-medium text-gray-500'>Salary Range</dt>
                    <dd className='mt-1 space-y-1'>
                      <p>Minimum: {user.jobPreferences.salary.minimum}</p>
                      <p>Preferred: {user.jobPreferences.salary.preferred}</p>
                    </dd>
                  </div>
                </dl>
              </div>
            )}

            {/* Experience */}
            {user?.experience && (
              <div>
                <h3 className='font-medium mb-4'>Experience</h3>
                <dl className='space-y-4'>
                  <div>
                    <dt className='text-sm font-medium text-gray-500'>Years of Experience</dt>
                    <dd className='mt-1'>{user.experience.yearsOfExperience}</dd>
                  </div>
                  <div>
                    <dt className='text-sm font-medium text-gray-500'>Education</dt>
                    <dd className='mt-1'>{user.experience.education}</dd>
                  </div>
                  <div>
                    <dt className='text-sm font-medium text-gray-500'>Skills</dt>
                    <dd className='mt-1'>
                      <div className='flex flex-wrap gap-2'>
                        {user.experience.skills.map((skill, index) => (
                          <span
                            key={index}
                            className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800'
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </dd>
                  </div>
                </dl>
              </div>
            )}

            {/* Availability */}
            {user?.availability && (
              <div>
                <h3 className='font-medium mb-4'>Availability</h3>
                <dl className='space-y-4'>
                  <div>
                    <dt className='text-sm font-medium text-gray-500'>Start Date</dt>
                    <dd className='mt-1'>{user.availability.startDate}</dd>
                  </div>
                  {user.availability.phoneNumber && (
                    <div>
                      <dt className='text-sm font-medium text-gray-500'>Phone Number</dt>
                      <dd className='mt-1'>{user.availability.phoneNumber}</dd>
                    </div>
                  )}
                </dl>
              </div>
            )}
          </div>
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
            onClick={() => append(defaultApplication)}
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
