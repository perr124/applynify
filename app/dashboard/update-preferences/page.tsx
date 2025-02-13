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
  },
};

export default function UpdatePreferences() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentRoleInput, setCurrentRoleInput] = useState('');
  const [currentLocationInput, setCurrentLocationInput] = useState('');
  const [currentSkillInput, setCurrentSkillInput] = useState('');

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const response = await fetch('/api/user/preferences');
        if (!response.ok) throw new Error('Failed to fetch preferences');
        const data = await response.json();
        setFormData({
          ...data,
          availability: {
            startDate: data.availability?.startDate || '',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setShowSuccess(false);

    try {
      // Check for any pending input in role or location fields
      const pendingFormData = { ...formData };

      if (currentRoleInput.trim()) {
        pendingFormData.jobPreferences.roles = [
          ...formData.jobPreferences.roles,
          currentRoleInput.trim(),
        ];
        // Clear the input after adding
        setCurrentRoleInput('');
      }

      if (currentLocationInput.trim()) {
        pendingFormData.jobPreferences.locations = [
          ...formData.jobPreferences.locations,
          currentLocationInput.trim(),
        ];
        // Clear the input after adding
        setCurrentLocationInput('');
      }

      const response = await fetch('/api/user/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pendingFormData),
      });

      if (!response.ok) {
        throw new Error('Failed to update preferences');
      }

      // Update the form data state with the pending changes
      setFormData(pendingFormData);

      setShowSuccess(true);
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
              <div key={i} className='h-24 bg-gray-200 rounded'></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>Update Preferences</h1>
          <p className='mt-1 text-sm text-gray-500'>
            Customize your job preferences, experience, and availability
          </p>
        </div>
        <button
          type='submit'
          form='preferences-form'
          disabled={isSaving}
          className='inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-500 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150'
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
        <div className='rounded-lg bg-green-50 p-4'>
          <div className='flex'>
            <CheckCircle className='h-5 w-5 text-green-400 mr-2' />
            <div className='text-sm text-green-700'>
              Your preferences have been updated successfully
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className='rounded-lg bg-red-50 p-4'>
          <div className='flex'>
            <AlertCircle className='h-5 w-5 text-red-400 mr-2' />
            <div className='text-sm text-red-700'>{error}</div>
          </div>
        </div>
      )}

      <form id='preferences-form' onSubmit={handleSubmit} className='space-y-8'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Job Preferences Card */}
          <div className='bg-white shadow rounded-lg p-6 space-y-6'>
            <div className='flex items-center'>
              <div className='flex-shrink-0'>
                <div className='h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center'>
                  <Briefcase className='h-5 w-5 text-primary-600' />
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
                  className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm'
                  value={currentRoleInput}
                  onChange={(e) => {
                    const input = e.target.value;
                    setCurrentRoleInput(input);

                    if (input.endsWith(',')) {
                      const newRole = input.slice(0, -1).trim();
                      if (newRole) {
                        const updatedRoles = [...formData.jobPreferences.roles, newRole];
                        updateFormData('jobPreferences', 'roles', updatedRoles);
                        setCurrentRoleInput('');
                      }
                    }
                  }}
                  placeholder='e.g., Software Engineer, Product Manager'
                />

                {/* Display selected roles */}
                {formData.jobPreferences.roles.length > 0 && (
                  <div className='mt-2 flex flex-wrap gap-2'>
                    {formData.jobPreferences.roles.map((role, index) => (
                      <span
                        key={index}
                        className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800'
                      >
                        {role}
                        <button
                          type='button'
                          onClick={() => {
                            const updatedRoles = formData.jobPreferences.roles.filter(
                              (_, i) => i !== index
                            );
                            updateFormData('jobPreferences', 'roles', updatedRoles);
                          }}
                          className='ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                        >
                          <span className='sr-only'>Remove {role}</span>×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700'>Locations</label>
                <input
                  type='text'
                  className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm'
                  value={currentLocationInput}
                  onChange={(e) => {
                    const input = e.target.value;
                    setCurrentLocationInput(input);

                    if (input.endsWith(',')) {
                      const newLocation = input.slice(0, -1).trim();
                      if (newLocation) {
                        const updatedLocations = [
                          ...formData.jobPreferences.locations,
                          newLocation,
                        ];
                        updateFormData('jobPreferences', 'locations', updatedLocations);
                        setCurrentLocationInput('');
                      }
                    }
                  }}
                  placeholder='e.g., New York, London'
                />

                {/* Display selected locations */}
                {formData.jobPreferences.locations.length > 0 && (
                  <div className='mt-2 flex flex-wrap gap-2'>
                    {formData.jobPreferences.locations.map((location, index) => (
                      <span
                        key={index}
                        className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800'
                      >
                        {location}
                        <button
                          type='button'
                          onClick={() => {
                            const updatedLocations = formData.jobPreferences.locations.filter(
                              (_, i) => i !== index
                            );
                            updateFormData('jobPreferences', 'locations', updatedLocations);
                          }}
                          className='ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                        >
                          <span className='sr-only'>Remove {location}</span>×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700'>Minimum Salary</label>
                <input
                  type='text'
                  className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm'
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
                  className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm'
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
                  className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm'
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
                  className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm'
                  value={currentSkillInput}
                  onChange={(e) => {
                    const input = e.target.value;
                    setCurrentSkillInput(input);

                    if (input.endsWith(',')) {
                      const newSkill = input.slice(0, -1).trim();
                      if (newSkill) {
                        const updatedSkills = [...formData.experience.skills, newSkill];
                        updateFormData('experience', 'skills', updatedSkills);
                        setCurrentSkillInput('');
                      }
                    }
                  }}
                  placeholder='e.g., JavaScript, Project Management'
                />
                {formData.experience.skills.length > 0 && (
                  <div className='mt-2 flex flex-wrap gap-2'>
                    {formData.experience.skills.map((skill, index) => (
                      <span
                        key={index}
                        className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800'
                      >
                        {skill}
                        <button
                          type='button'
                          onClick={() => {
                            const updatedSkills = formData.experience.skills.filter(
                              (_, i) => i !== index
                            );
                            updateFormData('experience', 'skills', updatedSkills);
                          }}
                          className='ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                        >
                          <span className='sr-only'>Remove {skill}</span>×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
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
                <p className='text-sm text-gray-500'>Your start date</p>
              </div>
            </div>

            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700'>Start Date</label>
                <select
                  className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm'
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
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
