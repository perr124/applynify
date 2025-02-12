'use client';

import { useState, useEffect } from 'react';
import React from 'react';
import { ChevronLeft, Upload } from 'lucide-react';
import Link from 'next/link';

type FormData = {
  jobPreferences: {
    roles: string[];
    locations: string[];
    remotePreference: string;
    salary: {
      minimum: string;
      preferred: string;
    };
  };
  experience: {
    yearsOfExperience: string;
    education: string;
    skills: string[];
  };
  availability: {
    startDate: string;
    noticeRequired: string;
    resume?: {
      file: File | null;
      uploading: boolean;
      error: string | null;
      url?: string;
    };
  };
};

const initialFormData: FormData = {
  jobPreferences: {
    roles: [],
    locations: [],
    remotePreference: '',
    salary: {
      minimum: '',
      preferred: '',
    },
  },
  experience: {
    yearsOfExperience: '',
    education: '',
    skills: [],
  },
  availability: {
    startDate: '',
    noticeRequired: '',
    resume: {
      file: null,
      uploading: false,
      error: null,
    },
  },
};

export default function UpdatePreferences() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const response = await fetch('/api/user/preferences');
        if (!response.ok) throw new Error('Failed to fetch preferences');
        const data = await response.json();
        setFormData({
          ...data,
          availability: {
            ...data.availability,
            resume: {
              file: null,
              uploading: false,
              error: null,
              url: data.availability?.resumeUrl,
            },
          },
        });
      } catch (error) {
        console.error('Error:', error);
        setError('Failed to load preferences');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPreferences();
  }, []);

  const updateFormData = (section: keyof FormData, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      updateFormData('availability', 'resume', {
        file: null,
        uploading: false,
        error: 'Please upload a PDF file',
        url: formData.availability.resume?.url,
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      updateFormData('availability', 'resume', {
        file: null,
        uploading: false,
        error: 'File size must be less than 5MB',
        url: formData.availability.resume?.url,
      });
      return;
    }

    updateFormData('availability', 'resume', {
      file,
      uploading: false,
      error: null,
      url: formData.availability.resume?.url,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      // Upload resume if exists
      let resumeUrl = formData.availability.resume?.url;
      if (formData.availability.resume?.file) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', formData.availability.resume.file);

        const uploadResponse = await fetch('/api/upload-resume', {
          method: 'POST',
          body: uploadFormData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload resume');
        }

        const uploadData = await uploadResponse.json();
        resumeUrl = uploadData.url;
      }

      // Save preferences
      const response = await fetch('/api/user/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          availability: {
            ...formData.availability,
            resumeUrl,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update preferences');
      }

      // Replace the back button with:
      <Link
        href='/dashboard'
        className='inline-flex items-center text-gray-600 hover:text-gray-800'
      >
        <ChevronLeft className='h-5 w-5' />
        Back to Dashboard
      </Link>;
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to update preferences');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className='p-8'>
        <div className='animate-pulse space-y-4'>
          <div className='h-4 bg-gray-200 rounded w-1/4'></div>
          <div className='h-8 bg-gray-200 rounded'></div>
          <div className='h-8 bg-gray-200 rounded'></div>
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-2xl mx-auto p-8'>
      <div className='mb-6'>
        <Link
          href='/dashboard'
          className='inline-flex items-center text-gray-600 hover:text-gray-800'
        >
          <ChevronLeft className='h-5 w-5' />
          Back to Dashboard
        </Link>
      </div>

      <h1 className='text-2xl font-bold mb-6'>Update Preferences</h1>

      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* Job Preferences Section */}
        <div className='space-y-4'>
          <h2 className='text-lg font-semibold'>Job Preferences</h2>

          <div>
            <label className='block text-sm font-medium text-gray-700'>Roles</label>
            <input
              type='text'
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
              value={formData.jobPreferences.roles.join(', ')}
              onChange={(e) =>
                updateFormData(
                  'jobPreferences',
                  'roles',
                  e.target.value.split(',').map((s) => s.trim())
                )
              }
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>Locations</label>
            <input
              type='text'
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
              value={formData.jobPreferences.locations.join(', ')}
              onChange={(e) =>
                updateFormData(
                  'jobPreferences',
                  'locations',
                  e.target.value.split(',').map((s) => s.trim())
                )
              }
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>Minimum Salary</label>
            <input
              type='text'
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
              value={formData.jobPreferences.salary.minimum}
              onChange={(e) =>
                updateFormData('jobPreferences', 'salary', {
                  ...formData.jobPreferences.salary,
                  minimum: e.target.value,
                })
              }
            />
          </div>
        </div>

        {/* Experience Section */}
        <div className='space-y-4'>
          <h2 className='text-lg font-semibold'>Experience</h2>

          <div>
            <label className='block text-sm font-medium text-gray-700'>Years of Experience</label>
            <select
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
              value={formData.experience.yearsOfExperience}
              onChange={(e) => updateFormData('experience', 'yearsOfExperience', e.target.value)}
            >
              <option value=''>Select years of experience</option>
              <option value='0-1'>0-1 years</option>
              <option value='1-3'>1-3 years</option>
              <option value='3-5'>3-5 years</option>
              <option value='5-10'>5-10 years</option>
              <option value='10+'>10+ years</option>
            </select>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>Education</label>
            <select
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
              value={formData.experience.education}
              onChange={(e) => updateFormData('experience', 'education', e.target.value)}
            >
              <option value=''>Select education level</option>
              <option value='high-school'>High School</option>
              <option value='bachelors'>Bachelor's Degree</option>
              <option value='masters'>Master's Degree</option>
              <option value='phd'>Ph.D.</option>
              <option value='other'>Other</option>
            </select>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>Skills</label>
            <input
              type='text'
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
              value={formData.experience.skills.join(', ')}
              onChange={(e) =>
                updateFormData(
                  'experience',
                  'skills',
                  e.target.value.split(',').map((s) => s.trim())
                )
              }
            />
          </div>
        </div>

        {/* Availability Section */}
        <div className='space-y-4'>
          <h2 className='text-lg font-semibold'>Availability</h2>

          <div>
            <label className='block text-sm font-medium text-gray-700'>Start Date</label>
            <select
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
              value={formData.availability.startDate}
              onChange={(e) => updateFormData('availability', 'startDate', e.target.value)}
            >
              <option value=''>Select availability</option>
              <option value='immediately'>Immediately</option>
              <option value='2-weeks'>In 2 weeks</option>
              <option value='1-month'>In 1 month</option>
              <option value='2-months'>In 2 months</option>
              <option value='3-months+'>3+ months</option>
            </select>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>Notice Period</label>
            <select
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
              value={formData.availability.noticeRequired}
              onChange={(e) => updateFormData('availability', 'noticeRequired', e.target.value)}
            >
              <option value=''>Select notice period</option>
              <option value='none'>No notice required</option>
              <option value='2-weeks'>2 weeks</option>
              <option value='1-month'>1 month</option>
              <option value='2-months'>2 months</option>
              <option value='other'>Other</option>
            </select>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>Resume</label>
            <div className='mt-1'>
              <div className='flex items-center justify-center w-full'>
                <label className='flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100'>
                  <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                    <Upload className='w-8 h-8 mb-2 text-gray-500' />
                    <p className='mb-2 text-sm text-gray-500'>
                      <span className='font-semibold'>Click to upload</span> or drag and drop
                    </p>
                    <p className='text-xs text-gray-500'>PDF (max. 5MB)</p>
                  </div>
                  <input type='file' className='hidden' accept='.pdf' onChange={handleFileChange} />
                </label>
              </div>
              {formData.availability.resume?.file && (
                <p className='mt-2 text-sm text-gray-600'>
                  Selected file: {formData.availability.resume.file.name}
                </p>
              )}
              {formData.availability.resume?.url && !formData.availability.resume?.file && (
                <p className='mt-2 text-sm text-gray-600'>
                  Current resume:{' '}
                  <a
                    href={formData.availability.resume.url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-indigo-600 hover:text-indigo-500'
                  >
                    View
                  </a>
                </p>
              )}
              {formData.availability.resume?.error && (
                <p className='mt-2 text-sm text-red-600'>{formData.availability.resume.error}</p>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className='rounded-md bg-red-50 p-4'>
            <div className='text-sm text-red-700'>{error}</div>
          </div>
        )}

        <div className='flex justify-end'>
          <button
            type='submit'
            disabled={isSaving}
            className='inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
