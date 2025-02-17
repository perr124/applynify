'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
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

export default function ViewUser() {
  const params = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  if (!params?.userId) return <div>Invalid user ID</div>;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/admin/users/${params.userId}`);
        if (!response.ok) throw new Error('Failed to fetch user');
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Error:', error);
        setError('Failed to load user details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [params.userId]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className='p-4 text-red-500'>{error}</div>;
  if (!user) return <div className='p-4'>User not found</div>;

  return (
    <div className='max-w-7xl mx-auto p-6'>
      <div className='mb-6 flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>User Details</h1>
        <Link
          href={`/admin/users/${user._id}`}
          className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700'
        >
          Edit Applications
        </Link>
      </div>

      {/* User Info */}
      <div className='bg-white rounded-lg shadow mb-6'>
        <div className='px-6 py-4 border-b border-gray-200'>
          <h2 className='text-lg font-medium'>Basic Information</h2>
        </div>
        <div className='p-6'>
          <dl className='grid grid-cols-2 gap-4'>
            <div>
              <dt className='text-sm font-medium text-gray-500'>Name</dt>
              <dd>
                {user.firstName} {user.lastName}
              </dd>
            </div>
            <div>
              <dt className='text-sm font-medium text-gray-500'>Email</dt>
              <dd>{user.email}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Resume History Section */}
      <div className='bg-white rounded-lg shadow mb-6'>
        <div className='px-6 py-4 border-b border-gray-200'>
          <h2 className='text-lg font-medium'>Resume History</h2>
        </div>
        <div className='p-6'>
          {user.resumes && user.resumes.length > 0 ? (
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
            {user.jobPreferences && (
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
                  <div>
                    <dt className='text-sm font-medium text-gray-500'>Citizenship Status</dt>
                    <dd className='mt-1'>{user.jobPreferences.citizenshipStatus}</dd>
                  </div>
                  <div>
                    <dt className='text-sm font-medium text-gray-500'>Job Type</dt>
                    <dd className='mt-1'>
                      {user.jobPreferences.jobType ? (
                        <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
                          {user.jobPreferences.jobType.charAt(0).toUpperCase() +
                            user.jobPreferences.jobType.slice(1).replace('-', ' ')}
                        </span>
                      ) : (
                        'Not specified'
                      )}
                    </dd>
                  </div>
                </dl>
              </div>
            )}

            {/* Experience */}
            {user.experience && (
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
            {user.availability && (
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
                  {user.availability.additionalInfo && (
                    <div>
                      <dt className='text-sm font-medium text-gray-500'>Additional Information</dt>
                      <dd className='mt-1'>{user.availability.additionalInfo}</dd>
                    </div>
                  )}
                </dl>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
