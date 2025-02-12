'use client';

import { useState, useEffect } from 'react';
import React from 'react';
import {
  ChevronLeft,
  Upload,
  Briefcase,
  FileText,
  Clock,
  Loader2,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
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
  const [showSuccess, setShowSuccess] = useState(false);

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
    setShowSuccess(false);

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

      // Show success message
      setShowSuccess(true);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
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
        <div className='animate-pulse space-y-6'>
          <div className='h-4 bg-gray-200 rounded w-1/4'></div>
          <div className='space-y-4'>
            {[1, 2, 3].map((i) => (
              <div key={i} className='space-y-2'>
                <div className='h-4 bg-gray-200 rounded w-1/6'></div>
                <div className='h-10 bg-gray-200 rounded'></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-[calc(100vh-4rem)] bg-gray-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='flex justify-between items-center mb-8'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>Update Preferences</h1>
            <p className='mt-2 text-sm text-gray-600'>
              Update your job preferences, experience, and availability
            </p>
          </div>
          <button
            type='submit'
            form='preferences-form'
            disabled={isSaving}
            className='inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150'
          >
            {isSaving ? (
              <>
                <Loader2 className='animate-spin -ml-1 mr-2 h-5 w-5' />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>

        {showSuccess && (
          <div className='mb-6 rounded-lg bg-green-50 p-4'>
            <div className='flex'>
              <CheckCircle className='h-5 w-5 text-green-400 mr-2' />
              <div className='text-sm text-green-700'>
                Your preferences have been updated successfully
              </div>
            </div>
          </div>
        )}

        <form id='preferences-form' onSubmit={handleSubmit} className='space-y-8'>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            {/* Job Preferences Card */}
            <div className='bg-white shadow rounded-lg p-6 space-y-6'>
              <div className='flex items-center'>
                <div className='flex-shrink-0'>
                  <div className='h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center'>
                    <Briefcase className='h-5 w-5 text-indigo-600' />
                  </div>
                </div>
                <div className='ml-4'>
                  <h2 className='text-lg font-semibold text-gray-900'>Job Preferences</h2>
                  <p className='text-sm text-gray-500'>Your ideal job criteria</p>
                </div>
              </div>

              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>Roles</label>
                  <input
                    type='text'
                    className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                    value={formData.jobPreferences.roles.join(', ')}
                    onChange={(e) =>
                      updateFormData(
                        'jobPreferences',
                        'roles',
                        e.target.value.split(',').map((s) => s.trim())
                      )
                    }
                    placeholder='e.g., Software Engineer, Product Manager'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700'>Locations</label>
                  <input
                    type='text'
                    className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                    value={formData.jobPreferences.locations.join(', ')}
                    onChange={(e) =>
                      updateFormData(
                        'jobPreferences',
                        'locations',
                        e.target.value.split(',').map((s) => s.trim())
                      )
                    }
                    placeholder='e.g., New York, London'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700'>Minimum Salary</label>
                  <input
                    type='text'
                    className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                    value={formData.jobPreferences.salary.minimum}
                    onChange={(e) =>
                      updateFormData('jobPreferences', 'salary', {
                        ...formData.jobPreferences.salary,
                        minimum: e.target.value,
                      })
                    }
                    placeholder='e.g., $50,000'
                  />
                </div>
              </div>
            </div>

            {/* Experience Card */}
            <div className='bg-white shadow rounded-lg p-6 space-y-6'>
              <div className='flex items-center'>
                <div className='flex-shrink-0'>
                  <div className='h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center'>
                    <FileText className='h-5 w-5 text-green-600' />
                  </div>
                </div>
                <div className='ml-4'>
                  <h2 className='text-lg font-semibold text-gray-900'>Experience</h2>
                  <p className='text-sm text-gray-500'>Your background and skills</p>
                </div>
              </div>

              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Years of Experience
                  </label>
                  <select
                    className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                    value={formData.experience.yearsOfExperience}
                    onChange={(e) =>
                      updateFormData('experience', 'yearsOfExperience', e.target.value)
                    }
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
                    className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
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
                    className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                    value={formData.experience.skills.join(', ')}
                    onChange={(e) =>
                      updateFormData(
                        'experience',
                        'skills',
                        e.target.value.split(',').map((s) => s.trim())
                      )
                    }
                    placeholder='e.g., JavaScript, Project Management'
                  />
                </div>
              </div>
            </div>

            {/* Availability Card */}
            <div className='bg-white shadow rounded-lg p-6 space-y-6'>
              <div className='flex items-center'>
                <div className='flex-shrink-0'>
                  <div className='h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center'>
                    <Clock className='h-5 w-5 text-blue-600' />
                  </div>
                </div>
                <div className='ml-4'>
                  <h2 className='text-lg font-semibold text-gray-900'>Availability</h2>
                  <p className='text-sm text-gray-500'>Your start date and notice period</p>
                </div>
              </div>

              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>Start Date</label>
                  <select
                    className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
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
                    className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                    value={formData.availability.noticeRequired}
                    onChange={(e) =>
                      updateFormData('availability', 'noticeRequired', e.target.value)
                    }
                  >
                    <option value=''>Select notice period</option>
                    <option value='none'>No notice required</option>
                    <option value='2-weeks'>2 weeks</option>
                    <option value='1-month'>1 month</option>
                    <option value='2-months'>2 months</option>
                    <option value='other'>Other</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Resume Upload Section */}
          <div className='bg-white shadow rounded-lg p-6'>
            {formData.availability.resume?.url && !formData.availability.resume?.file && (
              <div className='mb-4 p-4 bg-gray-50 rounded-md'>
                <div className='flex items-center'>
                  <FileText className='h-5 w-5 text-gray-400 mr-2' />
                  <span className='text-sm text-gray-600'>
                    Current resume:{' '}
                    <a
                      href={formData.availability.resume.url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-indigo-600 hover:text-indigo-500'
                    >
                      View
                    </a>
                  </span>
                </div>
              </div>
            )}
            <div className='flex items-center mb-6'>
              <div className='flex-shrink-0'>
                <div className='h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center'>
                  <Upload className='h-5 w-5 text-purple-600' />
                </div>
              </div>
              <div className='ml-4'>
                <h2 className='text-lg font-semibold text-gray-900'>Resume</h2>
                <p className='text-sm text-gray-500'>Upload your latest resume</p>
              </div>
            </div>

            <div className='flex items-center justify-center w-full'>
              <label className='flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-150'>
                <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                  <Upload className='w-12 h-12 mb-4 text-gray-400' />
                  <p className='mb-2 text-sm text-gray-500'>
                    <span className='font-semibold'>Click to upload</span> or drag and drop
                  </p>
                  <p className='text-xs text-gray-500'>PDF (max. 5MB)</p>
                </div>
                <input type='file' className='hidden' accept='.pdf' onChange={handleFileChange} />
              </label>
            </div>

            {formData.availability.resume?.file && (
              <div className='mt-4 p-4 bg-gray-50 rounded-md'>
                <div className='flex items-center'>
                  <FileText className='h-5 w-5 text-gray-400 mr-2' />
                  <span className='text-sm text-gray-600'>
                    Selected: {formData.availability.resume.file.name}
                  </span>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className='rounded-lg bg-red-50 p-4'>
              <div className='flex'>
                <AlertCircle className='h-5 w-5 text-red-400 mr-2' />
                <div className='text-sm text-red-700'>{error}</div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
