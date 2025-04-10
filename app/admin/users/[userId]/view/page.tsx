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

// Add regions mapping
const regions: Record<string, { name: string; flag: string }> = {
  US: { name: 'United States', flag: '🇺🇸' },
  GB: { name: 'United Kingdom', flag: '🇬🇧' },
  EU: { name: 'Europe', flag: '🇪🇺' },
  CA: { name: 'Canada', flag: '🇨🇦' },
  AU: { name: 'Australia', flag: '🇦🇺' },
};

type User = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  resumes?: Resume[];
  jobPreferences?: JobPreferences;
  experience?: Experience;
  availability?: Availability;
  marketingSource?: string;
  localization?: string;
  applicationsStatus?: string;
};

export default function ViewUser() {
  const params = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/admin/users/${params?.userId}`);
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

    if (params?.userId) {
      fetchUser();
    }
  }, [params?.userId]);

  if (!params?.userId) return <div>Invalid user ID</div>;
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className='p-4 text-red-500'>{error}</div>;
  if (!user) return <div className='p-4'>User not found</div>;

  return (
    <div className='max-w-7xl mx-auto p-6'>
      <div className='mb-6 flex justify-between items-center'>
        <div className='flex items-center gap-4'>
          <h1 className='text-2xl font-bold'>User Details</h1>
          {user.applicationsStatus === 'completed' && (
            <span className='inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800'>
              Completed
            </span>
          )}
        </div>
        <Link
          href={`/admin/users/${params?.userId}`}
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
            {user.marketingSource && (
              <div>
                <dt className='text-sm font-medium text-gray-500'>Marketing Source</dt>
                <dd className='mt-1 capitalize'>{user.marketingSource.replace('-', ' ')}</dd>
              </div>
            )}
            {user.localization && (
              <div>
                <dt className='text-sm font-medium text-gray-500'>Country</dt>
                <dd className='mt-1 flex items-center gap-2'>
                  <span className='text-lg'>{regions[user.localization]?.flag}</span>
                  <span>{regions[user.localization]?.name || user.localization}</span>
                </dd>
              </div>
            )}
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
                      {/* <p>Preferred: {user.jobPreferences.salary.preferred}</p> */}
                    </dd>
                  </div>
                  <div>
                    <dt className='text-sm font-medium text-gray-500'>Citizenship Status</dt>
                    <dd className='mt-1'>{user.jobPreferences.citizenshipStatus}</dd>
                  </div>
                  <div>
                    <dt className='text-sm font-medium text-gray-500'>Requires Sponsorship</dt>
                    <dd className='mt-1'>
                      {user.jobPreferences.requiresSponsorship ? 'Yes' : 'No'}
                    </dd>
                  </div>
                  <div>
                    <dt className='text-sm font-medium text-gray-500'>Job Type</dt>
                    <dd className='mt-1'>
                      {user.jobPreferences.jobType && user.jobPreferences.jobType.length > 0 ? (
                        <div className='flex flex-wrap gap-2'>
                          {user.jobPreferences.jobType.map((type, index) => (
                            <span
                              key={index}
                              className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'
                            >
                              {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                            </span>
                          ))}
                        </div>
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
                  <div>
                    <dt className='text-sm font-medium text-gray-500'>Ethnicity</dt>
                    <dd className='mt-1'>{user.experience.ethnicity || 'Not specified'}</dd>
                  </div>
                  <div>
                    <dt className='text-sm font-medium text-gray-500'>Date of Birth</dt>
                    <dd className='mt-1'>
                      {user.experience.dateOfBirth ? (
                        <div className='space-y-1'>
                          <div>{user.experience.dateOfBirth}</div>
                          <div className='text-sm text-gray-500'>
                            {new Date(user.experience.dateOfBirth).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </div>
                        </div>
                      ) : (
                        'Not specified'
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className='text-sm font-medium text-gray-500'>Veteran Status</dt>
                    <dd className='mt-1'>{user.experience.isVeteran ? 'Yes' : 'No'}</dd>
                  </div>
                  <div>
                    <dt className='text-sm font-medium text-gray-500'>Disability Status</dt>
                    <dd className='mt-1'>{user.experience.hasDisability ? 'Yes' : 'No'}</dd>
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
                  {user.availability.address && (
                    <div>
                      <dt className='text-sm font-medium text-gray-500'>Address</dt>
                      <dd className='mt-1'>
                        <div className='space-y-1'>
                          <p>{user.availability.address.street}</p>
                          <p>
                            {user.availability.address.city}, {user.availability.address.state}{' '}
                            {user.availability.address.zipCode}
                          </p>
                          <p>{user.availability.address.country}</p>
                        </div>
                      </dd>
                    </div>
                  )}
                  {user.availability.additionalInfo && (
                    <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4'>
                      <div className='flex items-start gap-3'>
                        <div className='flex-shrink-0'>
                          <svg
                            className='h-5 w-5 text-yellow-400'
                            viewBox='0 0 20 20'
                            fill='currentColor'
                          >
                            <path
                              fillRule='evenodd'
                              d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
                              clipRule='evenodd'
                            />
                          </svg>
                        </div>
                        <div>
                          <dt className='text-sm font-medium text-yellow-800'>
                            Additional Information
                          </dt>
                          <dd className='mt-1 text-sm text-yellow-700 whitespace-pre-wrap'>
                            {user.availability.additionalInfo}
                          </dd>
                        </div>
                      </div>
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
