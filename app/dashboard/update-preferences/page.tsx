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
import { useLocalization } from '@/contexts/LocalizationContext';
import { CitizenshipStatus, citizenshipStatusByCountry } from '@/app/data/citizenshipStatus';
import { getAddressPlaceholders } from '@/libs/constants/address';
import { getPhoneFormat } from '@/libs/constants/phone';
import { countryCodes, getCountryCodeByRegion } from '@/libs/constants/countryCodes';
import { countries } from '@/app/data/countries';

type FormData = {
  jobPreferences: {
    roles: string[];
    locations: string[];
    prefersRemote?: boolean;
    workModes?: Array<'remote' | 'hybrid' | 'in-person'>;
    commuteDistance?: 'none' | '10' | '30' | '50' | '100';
    remoteCityOnly?: boolean;
    salaryNoPreference?: boolean;
    salary: {
      minimum: string;
      preferred: string;
    };
    citizenshipStatus: string;
    requiresSponsorship: boolean;
    jobType: string[];
  };
  localization?: string;
  experience: {
    yearsOfExperience: string;
    education: string;
    skills: string[];
    isVeteran: boolean;
    hasDisability: boolean;
    disabilityDetails?: string;
    ethnicity: string;
    dateOfBirth: string;
    gender: string;
    pronouns?: string;
  };
  availability: {
    startDate: string;
    phoneNumber?: string;
    linkedInUrl?: string;
    additionalInfo?: string;
    address?: {
      street: string;
      street2?: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  };
};

const initialFormData: FormData = {
  jobPreferences: {
    roles: [],
    locations: [],
    prefersRemote: false,
    workModes: [],
    commuteDistance: 'none',
    remoteCityOnly: false,
    salaryNoPreference: false,
    salary: {
      minimum: '',
      preferred: '',
    },
    citizenshipStatus: '',
    requiresSponsorship: false,
    jobType: [],
  },
  experience: {
    yearsOfExperience: '',
    education: '',
    skills: [],
    isVeteran: false,
    hasDisability: false,
    disabilityDetails: '',
    ethnicity: '',
    dateOfBirth: '',
    gender: '',
    pronouns: '',
  },
  availability: {
    startDate: '',
    phoneNumber: '',
    linkedInUrl: '',
    additionalInfo: '',
    address: {
      street: '',
      street2: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
  },
};

const formatSalary = (value: string) => {
  // Remove any non-digit characters
  const numbers = value.replace(/\D/g, '');
  // Format with commas
  return numbers ? Number(numbers).toLocaleString() : '';
};

export default function UpdatePreferences() {
  const { formatCurrency, currentRegion } = useLocalization();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentRoleInput, setCurrentRoleInput] = useState('');
  const [currentLocationInput, setCurrentLocationInput] = useState('');
  const [currentSkillInput, setCurrentSkillInput] = useState('');
  const [isJobTypeDropdownOpen, setIsJobTypeDropdownOpen] = useState(false);
  const [applicationsStatus, setApplicationsStatus] = useState<
    'notStarted' | 'started' | 'completed' | undefined
  >(undefined);
  const isLocked = applicationsStatus === 'started';

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
            phoneNumber: data.availability?.phoneNumber || '',
            linkedInUrl: data.availability?.linkedInUrl || '',
            additionalInfo: data.availability?.additionalInfo || '',
            address: data.availability?.address || {
              street: '',
              street2: '',
              city: '',
              state: '',
              zipCode: '',
              country: '',
            },
          },
        });
        setApplicationsStatus(data.applicationsStatus);
      } catch (error) {
        console.error('Error:', error);
        setError('Failed to load preferences');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPreferences();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.getElementById('job-type-dropdown');
      if (dropdown && !dropdown.contains(event.target as Node)) {
        setIsJobTypeDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const updateFormData = <K extends 'jobPreferences' | 'experience' | 'availability'>(
    section: K,
    field: string,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] as Record<string, any>),
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return; // extra safety
    setIsSaving(true);
    setError(null);
    setShowSuccess(false);

    try {
      // Check for any pending input in role, location, or skill fields
      const pendingFormData = { ...formData };

      if (currentRoleInput.trim()) {
        pendingFormData.jobPreferences.roles = [
          ...formData.jobPreferences.roles,
          currentRoleInput.trim(),
        ];
        setCurrentRoleInput('');
      }

      if (currentLocationInput.trim()) {
        pendingFormData.jobPreferences.locations = [
          ...formData.jobPreferences.locations,
          currentLocationInput.trim(),
        ];
        setCurrentLocationInput('');
      }

      // Add check for pending skill input
      if (currentSkillInput.trim()) {
        pendingFormData.experience.skills = [
          ...formData.experience.skills,
          currentSkillInput.trim(),
        ];
        setCurrentSkillInput('');
      }

      const response = await fetch('/api/user/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...pendingFormData,
          localization: currentRegion.code,
        }),
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

  const getCurrencySymbol = () => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currentRegion.currency,
    });
    return formatter.format(0).replace(/[\d,]/g, '').trim().replace('.', '');
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
          disabled={isSaving || isLocked}
          className='inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-500 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150'
        >
          {isSaving ? (
            <>
              <Loader2 className='animate-spin -ml-1 mr-2 h-5 w-5' />
              Saving...
            </>
          ) : (
            'Update'
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

      {isLocked && (
        <div className='rounded-lg bg-amber-50 border border-amber-200 p-4'>
          <div className='flex items-start'>
            <AlertCircle className='h-5 w-5 text-amber-500 mr-2 flex-shrink-0' />
            <div className='text-sm text-amber-800'>
              Your applications have started. To request any changes, please send us a message in
              your inbox.
              <a href='/dashboard/messages' className='ml-1 underline text-amber-900'>
                Go to Messages
              </a>
            </div>
          </div>
        </div>
      )}

      <form id='preferences-form' onSubmit={handleSubmit} className='space-y-8'>
        <fieldset disabled={isLocked}>
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
                  <label className='block text-sm font-medium text-gray-700'>
                    What roles are you interested in?
                  </label>
                  <div className='mt-1 flex gap-2'>
                    <input
                      type='text'
                      className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm'
                      placeholder='e.g., Software Engineer, Product Manager'
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
                      onPaste={(e) => {
                        e.preventDefault();
                        const pastedText = e.clipboardData.getData('text');
                        const roles = pastedText
                          .split(',')
                          .map((role) => role.trim())
                          .filter((role) => role.length > 0);

                        if (roles.length > 0) {
                          const updatedRoles = [...formData.jobPreferences.roles, ...roles];
                          updateFormData('jobPreferences', 'roles', updatedRoles);
                          setCurrentRoleInput('');
                        }
                      }}
                    />
                    <button
                      type='button'
                      onClick={() => {
                        if (currentRoleInput.trim()) {
                          const updatedRoles = [
                            ...formData.jobPreferences.roles,
                            currentRoleInput.trim(),
                          ];
                          updateFormData('jobPreferences', 'roles', updatedRoles);
                          setCurrentRoleInput('');
                        }
                      }}
                      className='inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-500 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                    >
                      +
                    </button>
                  </div>

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
                  <label className='block text-sm font-medium text-gray-700'>
                    Preferred locations
                  </label>
                  <div className='mt-1 flex gap-2'>
                    <input
                      type='text'
                      className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm'
                      placeholder='e.g., New York, London, Amsterdam'
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
                      onPaste={(e) => {
                        e.preventDefault();
                        const pastedText = e.clipboardData.getData('text');
                        const locations = pastedText
                          .split(',')
                          .map((location) => location.trim())
                          .filter((location) => location.length > 0);

                        if (locations.length > 0) {
                          const updatedLocations = [
                            ...formData.jobPreferences.locations,
                            ...locations,
                          ];
                          updateFormData('jobPreferences', 'locations', updatedLocations);
                          setCurrentLocationInput('');
                        }
                      }}
                    />
                    <button
                      type='button'
                      onClick={() => {
                        if (currentLocationInput.trim()) {
                          const updatedLocations = [
                            ...formData.jobPreferences.locations,
                            currentLocationInput.trim(),
                          ];
                          updateFormData('jobPreferences', 'locations', updatedLocations);
                          setCurrentLocationInput('');
                        }
                      }}
                      className='inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-500 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                    >
                      +
                    </button>
                  </div>

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

                  {/* Work modes: select all that apply */}
                  <div className='mt-4 space-y-2'>
                    <div className='text-sm font-medium text-gray-700'>
                      Work mode(s) – select all that apply
                    </div>
                    <div className='flex flex-wrap gap-4'>
                      {['remote', 'hybrid', 'in-person'].map((mode) => (
                        <label
                          key={mode}
                          className='inline-flex items-center gap-2 text-sm text-gray-700'
                        >
                          <input
                            type='checkbox'
                            checked={
                              formData.jobPreferences.workModes?.includes(mode as any) || false
                            }
                            onChange={(e) => {
                              const current = formData.jobPreferences.workModes || [];
                              const updated = e.target.checked
                                ? Array.from(new Set([...current, mode as any]))
                                : (current as Array<'remote' | 'hybrid' | 'in-person'>).filter(
                                    (m) => m !== (mode as any)
                                  );
                              updateFormData('jobPreferences', 'workModes', updated);
                            }}
                            className='h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded'
                          />
                          {mode === 'in-person'
                            ? 'In-person'
                            : mode.charAt(0).toUpperCase() + mode.slice(1)}
                        </label>
                      ))}
                    </div>
                    {/* Distance dropdown for hybrid/in-person */}
                    {(formData.jobPreferences.workModes?.includes('hybrid') ||
                      formData.jobPreferences.workModes?.includes('in-person')) && (
                      <div className='mt-2'>
                        <label className='block text-sm font-medium text-gray-700'>
                          Commute distance
                        </label>
                        <select
                          className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm'
                          value={formData.jobPreferences.commuteDistance || 'none'}
                          onChange={(e) =>
                            updateFormData(
                              'jobPreferences',
                              'commuteDistance',
                              e.target.value as any
                            )
                          }
                        >
                          <option value='none'>No preference</option>
                          <option value='10'>Up to 10 miles</option>
                          <option value='30'>Up to 30 miles</option>
                          <option value='50'>Up to 50 miles</option>
                          <option value='100'>Up to 100 miles</option>
                        </select>
                      </div>
                    )}
                    {/* Remote preference when remote selected */}
                    {formData.jobPreferences.workModes?.includes('remote') && (
                      <div className='mt-2'>
                        <label className='block text-sm font-medium text-gray-700'>
                          Remote preference
                        </label>
                        <select
                          className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm'
                          value={formData.jobPreferences.remoteCityOnly ? 'city' : 'nationwide'}
                          onChange={(e) =>
                            updateFormData(
                              'jobPreferences',
                              'remoteCityOnly',
                              e.target.value === 'city'
                            )
                          }
                        >
                          <option value='city'>Only in my preferred locations</option>
                          <option value='nationwide'>Open to roles anywhere in the country</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <div className='flex items-center justify-between'>
                    <label className='block text-sm font-medium text-gray-700'>
                      Minimum Salary
                    </label>
                    <label className='inline-flex items-center gap-2 text-sm text-gray-700'>
                      <input
                        type='checkbox'
                        checked={Boolean(formData.jobPreferences.salaryNoPreference)}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          updateFormData('jobPreferences', 'salaryNoPreference', checked);
                          if (checked) {
                            updateFormData('jobPreferences', 'salary', {
                              ...formData.jobPreferences.salary,
                              minimum: '',
                            });
                          }
                        }}
                        className='h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded'
                      />
                      No preference
                    </label>
                  </div>
                  <div className='mt-1 relative'>
                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                      <span className='text-gray-500 sm:text-sm whitespace-nowrap'>
                        {getCurrencySymbol()}
                      </span>
                    </div>
                    <input
                      type='text'
                      className={`appearance-none block w-full ${
                        getCurrencySymbol().length > 1 ? 'pl-12' : 'pl-7'
                      } px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                        formData.jobPreferences.salaryNoPreference ? 'bg-gray-100 opacity-70' : ''
                      }`}
                      disabled={Boolean(formData.jobPreferences.salaryNoPreference)}
                      value={formData.jobPreferences.salary.minimum}
                      onChange={(e) => {
                        const formatted = formatSalary(e.target.value);
                        updateFormData('jobPreferences', 'salary', {
                          ...formData.jobPreferences.salary,
                          minimum: formatted,
                        });
                      }}
                      onKeyPress={(e) => {
                        // Allow only numbers and common keyboard controls
                        if (!/[\d\b\t]/.test(e.key) && e.key !== 'Enter' && e.key !== 'Backspace') {
                          e.preventDefault();
                        }
                      }}
                      placeholder={`e.g., ${formatSalary('45000')}`}
                    />
                  </div>
                  <p className='mt-1 text-sm text-gray-500'>
                    Enter numbers only, commas will be added automatically
                  </p>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Citizenship Status
                  </label>
                  <div className='mt-1'>
                    <select
                      className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm'
                      value={formData.jobPreferences.citizenshipStatus}
                      onChange={(e) => {
                        const newStatus = e.target.value;
                        updateFormData('jobPreferences', 'citizenshipStatus', newStatus);

                        // If changing to citizen or permanent resident, set requiresSponsorship to false
                        if (newStatus.includes('citizen') || newStatus.includes('permanent')) {
                          updateFormData('jobPreferences', 'requiresSponsorship', false);
                        }
                      }}
                    >
                      <option value=''>Select status</option>
                      {(
                        citizenshipStatusByCountry[
                          currentRegion.code as keyof typeof citizenshipStatusByCountry
                        ] || citizenshipStatusByCountry.DEFAULT
                      ).map((status: CitizenshipStatus) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Add conditional sponsorship checkbox */}
                  {formData.jobPreferences.citizenshipStatus &&
                    !formData.jobPreferences.citizenshipStatus.includes('citizen') &&
                    !formData.jobPreferences.citizenshipStatus.includes('permanent') && (
                      <div className='mt-4'>
                        <div className='flex items-start'>
                          <div className='flex items-center h-5'>
                            <input
                              id='sponsorship'
                              type='checkbox'
                              checked={formData.jobPreferences.requiresSponsorship}
                              onChange={(e) =>
                                updateFormData(
                                  'jobPreferences',
                                  'requiresSponsorship',
                                  e.target.checked
                                )
                              }
                              className='h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded'
                            />
                          </div>
                          <div className='ml-3 text-sm'>
                            <label htmlFor='sponsorship' className='font-medium text-gray-700'>
                              I require visa sponsorship
                            </label>
                          </div>
                        </div>
                      </div>
                    )}
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700'>Job Type</label>
                  <div className='mt-1 relative' id='job-type-dropdown'>
                    <button
                      type='button'
                      onClick={() => setIsJobTypeDropdownOpen(!isJobTypeDropdownOpen)}
                      className='relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm'
                    >
                      <span className='block truncate'>
                        {formData.jobPreferences.jobType.length > 0
                          ? `${formData.jobPreferences.jobType.length} selected`
                          : 'Select job types'}
                      </span>
                      <span className='absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>
                        <svg
                          className='h-5 w-5 text-gray-400'
                          xmlns='http://www.w3.org/2000/svg'
                          viewBox='0 0 20 20'
                          fill='currentColor'
                          aria-hidden='true'
                        >
                          <path
                            fillRule='evenodd'
                            d='M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z'
                            clipRule='evenodd'
                          />
                        </svg>
                      </span>
                    </button>
                    {isJobTypeDropdownOpen && (
                      <div className='absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm'>
                        {['full-time', 'part-time', 'contract', 'internship'].map((type) => (
                          <div
                            key={type}
                            className='relative flex items-center px-3 py-2 cursor-pointer hover:bg-gray-50'
                            onClick={(e) => {
                              e.stopPropagation();
                              const newJobTypes = formData.jobPreferences.jobType.includes(type)
                                ? formData.jobPreferences.jobType.filter((t) => t !== type)
                                : [...formData.jobPreferences.jobType, type];
                              updateFormData('jobPreferences', 'jobType', newJobTypes);
                            }}
                          >
                            <input
                              type='checkbox'
                              className='h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500'
                              checked={formData.jobPreferences.jobType.includes(type)}
                              onChange={(e) => {
                                e.stopPropagation();
                                const newJobTypes = e.target.checked
                                  ? [...formData.jobPreferences.jobType, type]
                                  : formData.jobPreferences.jobType.filter((t) => t !== type);
                                updateFormData('jobPreferences', 'jobType', newJobTypes);
                              }}
                            />
                            <span className='ml-3 block truncate'>
                              {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {formData.jobPreferences.jobType.length > 0 && (
                    <div className='mt-2 flex flex-wrap gap-2'>
                      {formData.jobPreferences.jobType.map((type) => (
                        <span
                          key={type}
                          className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800'
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                          <button
                            type='button'
                            onClick={() => {
                              const newJobTypes = formData.jobPreferences.jobType.filter(
                                (t) => t !== type
                              );
                              updateFormData('jobPreferences', 'jobType', newJobTypes);
                            }}
                            className='ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                          >
                            <span className='sr-only'>Remove {type}</span>×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
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
                    {(formData.localization || 'US') !== 'US' && (
                      <option value='college-sixth-form'>College/Sixth Form</option>
                    )}
                    <option value='bachelors'>Bachelor&apos;s Degree</option>
                    <option value='masters'>Master&apos;s Degree</option>
                    <option value='phd'>Ph.D.</option>
                    <option value='other'>Other</option>
                  </select>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700'>Key skills</label>
                  <div className='mt-1 flex gap-2'>
                    <input
                      type='text'
                      className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm'
                      placeholder='e.g., Communication, Project Management'
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
                      onPaste={(e) => {
                        e.preventDefault();
                        const pastedText = e.clipboardData.getData('text');
                        const skills = pastedText
                          .split(',')
                          .map((skill) => skill.trim())
                          .filter((skill) => skill.length > 0);

                        if (skills.length > 0) {
                          const updatedSkills = [...formData.experience.skills, ...skills];
                          updateFormData('experience', 'skills', updatedSkills);
                          setCurrentSkillInput('');
                        }
                      }}
                    />
                    <button
                      type='button'
                      onClick={() => {
                        if (currentSkillInput.trim()) {
                          const updatedSkills = [
                            ...formData.experience.skills,
                            currentSkillInput.trim(),
                          ];
                          updateFormData('experience', 'skills', updatedSkills);
                          setCurrentSkillInput('');
                        }
                      }}
                      className='inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-500 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                    >
                      +
                    </button>
                  </div>
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

                {/* New fields */}
                <div className='space-y-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700'>Ethnicity</label>
                    <div className='mt-1'>
                      <select
                        className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm'
                        value={formData.experience.ethnicity}
                        onChange={(e) => updateFormData('experience', 'ethnicity', e.target.value)}
                      >
                        <option value=''>Prefer not to say</option>
                        <option value='american-indian'>American Indian or Alaska Native</option>
                        <option value='asian'>Asian</option>
                        <option value='black'>
                          {(formData.localization || 'US') === 'US'
                            ? 'Black or African American'
                            : 'Black African/Caribbean'}
                        </option>
                        <option value='hispanic'>Hispanic or Latino</option>
                        <option value='native-hawaiian'>
                          Native Hawaiian or Other Pacific Islander
                        </option>
                        <option value='white'>White</option>
                        <option value='two-or-more'>Mixed or Multiple ethnic groups</option>
                        <option value='other'>Other</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700'>Date of Birth</label>
                    <div className='mt-1'>
                      <input
                        type='date'
                        className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm'
                        value={formData.experience.dateOfBirth}
                        onChange={(e) =>
                          updateFormData('experience', 'dateOfBirth', e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700'>Gender</label>
                    <div className='mt-1'>
                      <select
                        className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm'
                        value={formData.experience.gender}
                        onChange={(e) => updateFormData('experience', 'gender', e.target.value)}
                      >
                        <option value=''>Prefer not to say</option>
                        <option value='male'>Male</option>
                        <option value='female'>Female</option>
                        <option value='non-binary'>Non-binary</option>
                        <option value='other'>Other</option>
                      </select>
                    </div>
                    <div className='mt-4'>
                      <label className='block text-sm font-medium text-gray-700'>Pronouns</label>
                      <select
                        className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm'
                        value={formData.experience.pronouns || ''}
                        onChange={(e) => updateFormData('experience', 'pronouns', e.target.value)}
                      >
                        <option value=''>Prefer not to say</option>
                        <option value='she/her'>She/her</option>
                        <option value='he/him'>He/him</option>
                        <option value='they/them'>They/them</option>
                        <option value='she/they'>She/they</option>
                        <option value='he/they'>He/they</option>
                      </select>
                    </div>
                  </div>
                  <div className='space-y-2'>
                    <div className='flex items-start'>
                      <div className='flex items-center h-5'>
                        <input
                          id='veteran'
                          type='checkbox'
                          checked={formData.experience.isVeteran}
                          onChange={(e) =>
                            updateFormData('experience', 'isVeteran', e.target.checked)
                          }
                          className='h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded'
                        />
                      </div>
                      <div className='ml-3 text-sm'>
                        <label htmlFor='veteran' className='font-medium text-gray-700'>
                          I identify as a veteran
                        </label>
                      </div>
                    </div>

                    <div className='flex items-start'>
                      <div className='flex items-center h-5'>
                        <input
                          id='disability'
                          type='checkbox'
                          checked={formData.experience.hasDisability}
                          onChange={(e) =>
                            updateFormData('experience', 'hasDisability', e.target.checked)
                          }
                          className='h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded'
                        />
                      </div>
                      <div className='ml-3 text-sm'>
                        <label htmlFor='disability' className='font-medium text-gray-700'>
                          I have a disability
                        </label>
                      </div>
                    </div>
                  </div>
                  {formData.experience.hasDisability && (
                    <div className='mt-3'>
                      <label className='block text-sm font-medium text-gray-700'>
                        If you’d like, please share any disability or accessibility requirements
                      </label>
                      <textarea
                        className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm'
                        rows={3}
                        placeholder='Optional'
                        value={formData.experience.disabilityDetails || ''}
                        onChange={(e) =>
                          updateFormData('experience', 'disabilityDetails', e.target.value)
                        }
                      />
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
                    <option value='Immediately'>Immediately</option>
                    <option value='2-weeks'>In 2 weeks</option>
                    <option value='1-month'>In 1 month</option>
                    <option value='2-months'>In 2 months</option>
                    <option value='3-months+'>3+ months</option>
                  </select>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700'>Phone Number</label>
                  <div className='flex gap-2'>
                    <div className='flex-shrink-0 w-20'>
                      <select
                        className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm'
                        value={
                          formData.availability.phoneNumber?.split(' ')[0] ||
                          getPhoneFormat(currentRegion.code).countryCode
                        }
                        onChange={(e) => {
                          const selectedCode = countryCodes.find(
                            (code) => code.dialCode === e.target.value
                          );
                          if (selectedCode) {
                            const currentNumber =
                              formData.availability.phoneNumber?.split(' ').slice(1).join(' ') ||
                              '';
                            updateFormData(
                              'availability',
                              'phoneNumber',
                              `${selectedCode.dialCode} ${currentNumber}`
                            );
                          }
                        }}
                      >
                        {countryCodes.map((code) => (
                          <option key={code.code} value={code.dialCode}>
                            {code.dialCode}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className='flex-grow'>
                      <input
                        type='tel'
                        className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm'
                        placeholder={getPhoneFormat(currentRegion.code).placeholder}
                        value={
                          formData.availability.phoneNumber?.split(' ').slice(1).join(' ') || ''
                        }
                        onChange={(e) => {
                          const selectedCode =
                            countryCodes.find(
                              (code) =>
                                code.dialCode === formData.availability.phoneNumber?.split(' ')[0]
                            ) || getCountryCodeByRegion(currentRegion.code);
                          updateFormData(
                            'availability',
                            'phoneNumber',
                            `${selectedCode.dialCode} ${e.target.value}`
                          );
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Add Address Fields */}
                <div className='space-y-4'>
                  <label className='block text-sm font-medium text-gray-700'>Address</label>
                  <div>
                    <input
                      type='text'
                      className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm'
                      placeholder={getAddressPlaceholders(currentRegion.code).street}
                      value={formData.availability.address?.street || ''}
                      onChange={(e) =>
                        updateFormData('availability', 'address', {
                          ...formData.availability.address,
                          street: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <input
                      type='text'
                      className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm'
                      placeholder={getAddressPlaceholders(currentRegion.code).street2}
                      value={formData.availability.address?.street2 || ''}
                      onChange={(e) =>
                        updateFormData('availability', 'address', {
                          ...formData.availability.address,
                          street2: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <input
                        type='text'
                        className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm'
                        placeholder={getAddressPlaceholders(currentRegion.code).city}
                        value={formData.availability.address?.city || ''}
                        onChange={(e) =>
                          updateFormData('availability', 'address', {
                            ...formData.availability.address,
                            city: e.target.value,
                          })
                        }
                      />
                    </div>
                    {currentRegion.code !== 'GB' && (
                      <div>
                        <input
                          type='text'
                          className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm'
                          placeholder={getAddressPlaceholders(currentRegion.code).state}
                          value={formData.availability.address?.state || ''}
                          onChange={(e) =>
                            updateFormData('availability', 'address', {
                              ...formData.availability.address,
                              state: e.target.value,
                            })
                          }
                        />
                      </div>
                    )}
                  </div>
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <input
                        type='text'
                        className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm'
                        placeholder={getAddressPlaceholders(currentRegion.code).zipCode}
                        value={formData.availability.address?.zipCode || ''}
                        onChange={(e) =>
                          updateFormData('availability', 'address', {
                            ...formData.availability.address,
                            zipCode: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <select
                        className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm'
                        value={formData.availability.address?.country || ''}
                        onChange={(e) =>
                          updateFormData('availability', 'address', {
                            ...formData.availability.address,
                            country: e.target.value,
                          })
                        }
                      >
                        {countries.map((country) => (
                          <option key={country.value} value={country.value}>
                            {country.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Additional Information
                  </label>
                  <textarea
                    className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm'
                    rows={5}
                    placeholder="This could include job roles you've recently applied to that you don't want us to re-apply to, any additional languages you speak, or any other important information we should be aware of."
                    value={formData.availability.additionalInfo}
                    onChange={(e) =>
                      updateFormData('availability', 'additionalInfo', e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>LinkedIn URL</label>
                  <input
                    type='text'
                    className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm'
                    placeholder='https://www.linkedin.com/in/username'
                    value={formData.availability.linkedInUrl}
                    onChange={(e) => updateFormData('availability', 'linkedInUrl', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </fieldset>
      </form>
    </div>
  );
}
