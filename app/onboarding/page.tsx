'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import React from 'react';
import config from '@/config';
import { ChevronRight, ChevronLeft, Upload } from 'lucide-react';
import ButtonAccount from '@/components/ButtonAccount';
import apiClient from '@/libs/api';
import Link from 'next/link';

type FormData = {
  jobPreferences: {
    roles: string[];
    locations: string[];
    salary: {
      minimum: string;
      preferred: string;
    };
    citizenshipStatus: string;
    jobType: string;
  };
  experience: {
    yearsOfExperience: string;
    education: string;
    skills: string[];
  };
  availability: {
    startDate: string;
    phoneNumber?: string;
    additionalInfo?: string;
    resume?: {
      file: File | null;
      uploading: boolean;
      error: string | null;
    };
  };
  termsAccepted: boolean;
};

const initialFormData: FormData = {
  jobPreferences: {
    roles: [],
    locations: [],
    salary: {
      minimum: '',
      preferred: '',
    },
    citizenshipStatus: '',
    jobType: '',
  },
  experience: {
    yearsOfExperience: '',
    education: '',
    skills: [],
  },
  availability: {
    startDate: '',
    phoneNumber: '',
    additionalInfo: '',
    resume: {
      file: null,
      uploading: false,
      error: null,
    },
  },
  termsAccepted: false,
};

const formatSalary = (value: string) => {
  // Remove any non-digit characters
  const numbers = value.replace(/\D/g, '');
  // Format with commas
  return numbers ? Number(numbers).toLocaleString() : '';
};

export default function OnboardingQuestionnaire() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [currentRoleInput, setCurrentRoleInput] = useState('');
  const [currentLocationInput, setCurrentLocationInput] = useState('');
  const [currentSkillInput, setCurrentSkillInput] = useState('');
  const [selectedPriceId, setSelectedPriceId] = useState<string | null>(null);
  const router = useRouter();

  // Add loading state
  const [isLoading, setIsLoading] = useState(true);

  // Add useEffect to fetch existing preferences
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const response = await fetch('/api/user/preferences');
        if (!response.ok) throw new Error('Failed to fetch preferences');
        const data = await response.json();

        // Only populate form if there's existing data
        if (data && Object.keys(data).length > 0) {
          console.log('data4334', data);
          // Get the most recent active resume if it exists
          const activeResume = data.resumes && data.resumes[0];

          setFormData({
            jobPreferences: {
              roles: data.jobPreferences?.roles || [],
              locations: data.jobPreferences?.locations || [],
              salary: {
                minimum: data.jobPreferences?.salary?.minimum || '',
                preferred: data.jobPreferences?.salary?.preferred || '',
              },
              citizenshipStatus: data.jobPreferences?.citizenshipStatus || '',
              jobType: data.jobPreferences?.jobType || '',
            },
            experience: {
              yearsOfExperience: data.experience?.yearsOfExperience || '',
              education: data.experience?.education || '',
              skills: data.experience?.skills || [],
            },
            availability: {
              startDate: data.availability?.startDate || '',
              phoneNumber: data.availability?.phoneNumber || '',
              additionalInfo: data.availability?.additionalInfo || '',
              resume: {
                file: activeResume ? new File([], activeResume.filename) : null,
                uploading: false,
                error: null,
              },
            },
            termsAccepted: data.termsAccepted || false,
          });
        }
      } catch (error) {
        console.error('Error fetching preferences:', error);
        // Don't show error to user, just use initial form data
      } finally {
        setIsLoading(false);
      }
    };

    fetchPreferences();
  }, []);

  const totalSteps = 5;

  const updateFormData = (section: keyof FormData, field: string, value: any) => {
    setFormData((prev: FormData) => {
      const sectionData = prev[section] as Record<string, any>;
      return {
        ...prev,
        [section]: {
          ...sectionData,
          [field]: value,
        },
      };
    });
  };

  const handleNext = async () => {
    // Check for any pending input before proceeding
    if (step === 1) {
      // Only check on step 1 where roles and locations are
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

      // Update the form data with any pending inputs
      setFormData(pendingFormData);
    }

    // Add check for pending skill input in step 2
    if (step === 2) {
      const pendingFormData = { ...formData };

      if (currentSkillInput.trim()) {
        pendingFormData.experience.skills = [
          ...formData.experience.skills,
          currentSkillInput.trim(),
        ];
        setCurrentSkillInput('');
      }

      // Update the form data with any pending inputs
      setFormData(pendingFormData);
    }

    if (step === 3) {
      if (!formData.termsAccepted) {
        setError('Please accept the terms and conditions to continue');
        return;
      }
    }

    if (step === totalSteps) {
      if (!selectedPriceId) {
        setError('Please select a plan to continue');
        return;
      }
      handleSubmit();
    } else if (step === totalSteps - 1) {
      setIsSubmitting(true);
      // Save preferences before moving to pricing step
      try {
        // Upload resume if exists
        let resumeUrl = null;
        if (formData.availability.resume?.file) {
          const uploadFormData = new FormData();
          uploadFormData.append('file', formData.availability.resume.file);
          uploadFormData.append('isOnboarding', 'true');

          try {
            const uploadResponse = await fetch('/api/upload-resume', {
              method: 'POST',
              body: uploadFormData,
            });

            if (!uploadResponse.ok) {
              setIsSubmitting(false);
              throw new Error('Failed to upload resume');
            }

            const uploadData = await uploadResponse.json();
            resumeUrl = uploadData.url;
          } catch (uploadError) {
            console.error('Resume upload error:', uploadError);
            setIsSubmitting(false);
            setError('Failed to upload resume. Please try again.');
            return;
          }
        }

        // Save preferences
        const preferencesResponse = await fetch('/api/user/preferences', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            jobPreferences: formData.jobPreferences,
            experience: formData.experience,
            availability: {
              startDate: formData.availability.startDate,
              phoneNumber: formData.availability.phoneNumber,
              additionalInfo: formData.availability.additionalInfo,
              resumeUrl: resumeUrl,
            },
          }),
        });

        if (!preferencesResponse.ok) {
          const data = await preferencesResponse.json();
          if (data.errors) {
            setError(data.errors.join(', '));
            return;
          }
          setIsSubmitting(false);
          throw new Error('Failed to save preferences');
        }
        setIsSubmitting(false);

        // Move to pricing step
        setStep((prev) => prev + 1);
      } catch (error) {
        console.error('Error saving preferences:', error);
        setError('Failed to save preferences. Please try again.');
      }
    } else {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Only accept PDF files
    if (file.type !== 'application/pdf') {
      updateFormData('availability', 'resume', {
        file: null,
        uploading: false,
        error: 'Please upload a PDF file',
      });
      return;
    }

    // Max file size of 5MB
    if (file.size > 5 * 1024 * 1024) {
      updateFormData('availability', 'resume', {
        file: null,
        uploading: false,
        error: 'File size must be less than 5MB',
      });
      return;
    }

    // Create form data with isOnboarding flag
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    uploadFormData.append('isOnboarding', 'true');

    try {
      const response = await fetch('/api/upload-resume', {
        method: 'POST',
        body: uploadFormData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload resume');
      }

      updateFormData('availability', 'resume', {
        file,
        uploading: false,
        error: null,
      });
    } catch (error) {
      console.error('Resume upload error:', error);
      updateFormData('availability', 'resume', {
        file: null,
        uploading: false,
        error: 'Failed to upload resume. Please try again.',
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      updateFormData('availability', 'resume', {
        file: null,
        uploading: false,
        error: 'Please upload a PDF file',
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      updateFormData('availability', 'resume', {
        file: null,
        uploading: false,
        error: 'File size must be less than 5MB',
      });
      return;
    }

    // Create form data with isOnboarding flag
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    uploadFormData.append('isOnboarding', 'true');

    try {
      const response = await fetch('/api/upload-resume', {
        method: 'POST',
        body: uploadFormData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload resume');
      }

      updateFormData('availability', 'resume', {
        file,
        uploading: false,
        error: null,
      });
    } catch (error) {
      console.error('Resume upload error:', error);
      updateFormData('availability', 'resume', {
        file: null,
        uploading: false,
        error: 'Failed to upload resume. Please try again.',
      });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Start payment flow with selected price
      const response = await apiClient.post('/stripe/create-checkout', {
        priceId: selectedPriceId,
        successUrl: `${window.location.origin}/dashboard`,
        cancelUrl: window.location.href,
        mode: 'payment',
      });

      // @ts-ignore
      if (!response.url) {
        console.error('No URL in response:', response);
        throw new Error('No checkout URL received');
      }

      // @ts-ignore
      window.location.href = response.url;
    } catch (e) {
      console.error('Payment error:', e);
      setError('Payment initialization failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  const renderReviewSection = () => {
    return (
      <div className='space-y-6'>
        <div>
          <h3 className='text-lg font-medium text-gray-900 mb-4'>Review Your Information</h3>

          {/* Job Preferences */}
          <div className='bg-gray-50 p-4 rounded-lg mb-4'>
            <div className='flex justify-between items-center mb-4'>
              <h4 className='font-medium text-gray-700'>Job Preferences</h4>
              <button
                onClick={() => setStep(1)}
                className='text-sm text-primary-600 hover:text-primary-700 flex items-center'
              >
                Edit
                <ChevronRight className='h-4 w-4 ml-1' />
              </button>
            </div>
            <dl className='space-y-2'>
              <div>
                <dt className='text-sm text-gray-500'>Desired Roles</dt>
                <dd className='mt-1'>
                  {formData.jobPreferences.roles.length > 0
                    ? formData.jobPreferences.roles.join(', ')
                    : 'None specified'}
                </dd>
              </div>
              <div>
                <dt className='text-sm text-gray-500'>Preferred Locations</dt>
                <dd className='mt-1'>
                  {formData.jobPreferences.locations.length > 0
                    ? formData.jobPreferences.locations.join(', ')
                    : 'None specified'}
                </dd>
              </div>
              <div>
                <dt className='text-sm text-gray-500'>Minimum Salary</dt>
                <dd className='mt-1'>
                  {formData.jobPreferences.salary.minimum || 'Not specified'}
                </dd>
              </div>
              <div>
                <dt className='text-sm text-gray-500'>Citizenship Status</dt>
                <dd className='mt-1'>
                  {formData.jobPreferences.citizenshipStatus || 'Not specified'}
                </dd>
              </div>
              <div>
                <dt className='text-sm text-gray-500'>Job Type</dt>
                <dd className='mt-1'>{formData.jobPreferences.jobType || 'Not specified'}</dd>
              </div>
            </dl>
          </div>

          {/* Experience */}
          <div className='bg-gray-50 p-4 rounded-lg mb-4'>
            <div className='flex justify-between items-center mb-4'>
              <h4 className='font-medium text-gray-700'>Experience</h4>
              <button
                onClick={() => setStep(2)}
                className='text-sm text-primary-600 hover:text-primary-700 flex items-center'
              >
                Edit
                <ChevronRight className='h-4 w-4 ml-1' />
              </button>
            </div>
            <dl className='space-y-2'>
              <div>
                <dt className='text-sm text-gray-500'>Years of Experience</dt>
                <dd className='mt-1'>{formData.experience.yearsOfExperience || 'Not specified'}</dd>
              </div>
              <div>
                <dt className='text-sm text-gray-500'>Education</dt>
                <dd className='mt-1'>{formData.experience.education || 'Not specified'}</dd>
              </div>
              <div>
                <dt className='text-sm text-gray-500'>Skills</dt>
                <dd className='mt-1'>
                  {formData.experience.skills.length > 0
                    ? formData.experience.skills.join(', ')
                    : 'None specified'}
                </dd>
              </div>
            </dl>
          </div>

          {/* Availability */}
          <div className='bg-gray-50 p-4 rounded-lg'>
            <div className='flex justify-between items-center mb-4'>
              <h4 className='font-medium text-gray-700'>Availability</h4>
              <button
                onClick={() => setStep(3)}
                className='text-sm text-primary-600 hover:text-primary-700 flex items-center'
              >
                Edit
                <ChevronRight className='h-4 w-4 ml-1' />
              </button>
            </div>
            <dl className='space-y-2'>
              <div>
                <dt className='text-sm text-gray-500'>Start Date</dt>
                <dd className='mt-1'>{formData.availability.startDate || 'Not specified'}</dd>
              </div>
              <div>
                <dt className='text-sm text-gray-500'>Phone Number</dt>
                <dd className='mt-1'>{formData.availability.phoneNumber || 'Not specified'}</dd>
              </div>
              <div>
                <dt className='text-sm text-gray-500'>Additional Information</dt>
                <dd className='mt-1'>{formData.availability.additionalInfo || 'Not specified'}</dd>
              </div>
              <div>
                <dt className='text-sm text-gray-500'>Resume</dt>
                <dd className='mt-1'>
                  {formData.availability.resume?.file
                    ? formData.availability.resume.file.name
                    : 'No resume uploaded'}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    );
  };

  const renderPricingSection = () => {
    const pricingTiers = [
      {
        name: 'Lite',
        price: 29.99,
        priceId: config.stripe.plans[0].priceId,
        description: 'For job seekers starting out',
        features: [
          '25 jobs applied to directly on company sites',
          'Resume revamp and optimization',
          'Write cover letters on your behalf',
          'Quick service within 5 days',
          'Email categorization of job responses',
          'Basic application tracking',
          'Standard support',
        ],
      },
      {
        name: 'Pro',
        price: 59.99,
        priceId: config.stripe.plans[1].priceId,
        description: 'Best for serious job seekers',
        features: [
          '50 jobs applied to directly on company sites',
          'Resume revamp and optimization',
          'Write cover letters on your behalf',
          'Priority service within 3 days',
          'Advanced email categorization',
          '24/7 priority support',
          'Custom job search strategies',
          'Interview preparation resources',
        ],
      },
    ];

    return (
      <div className='space-y-6'>
        <h3 className='text-lg font-medium text-gray-900 mb-4'>Select Your Plan</h3>
        <div className='grid gap-6'>
          {pricingTiers.map((tier) => (
            <div
              key={tier.priceId}
              className={`relative rounded-lg border-2 p-6 cursor-pointer transition-all ${
                selectedPriceId === tier.priceId
                  ? 'border-primary-500 bg-primary-50'
                  : isSubmitting
                  ? 'border-gray-200 opacity-50 cursor-not-allowed'
                  : 'border-gray-200 hover:border-primary-200'
              }`}
              onClick={() => !isSubmitting && setSelectedPriceId(tier.priceId)}
            >
              <div className='flex items-center justify-between mb-4'>
                <div>
                  <h4 className='text-xl font-semibold'>{tier.name}</h4>
                  <p className='text-gray-600'>{tier.description}</p>
                </div>
                <div className='text-2xl font-bold'>${tier.price}</div>
              </div>
              <ul className='space-y-3'>
                {tier.features.map((feature) => (
                  <li key={feature} className='flex items-start'>
                    <svg
                      className='h-5 w-5 text-primary-500 flex-shrink-0'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M5 13l4 4L19 7'
                      />
                    </svg>
                    <span className='ml-3 text-gray-600'>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Add loading state UI
  if (isLoading) {
    return (
      <div className='min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
        <div className='sm:mx-auto sm:w-full sm:max-w-md'>
          <div className='bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10'>
            <div className='animate-pulse space-y-6'>
              <div className='h-4 bg-gray-200 rounded w-3/4 mx-auto'></div>
              <div className='space-y-4'>
                {[1, 2, 3].map((i) => (
                  <div key={i} className='h-10 bg-gray-200 rounded'></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 flex flex-col'>
      <div className='absolute top-4 right-4'>
        {/* <button
          // onClick={handleLogout}
          className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
        >
          <div className='h-4 w-4 mr-2' />
          Logout
        </button> */}
        <ButtonAccount />
      </div>
      <div className='min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
        <div className='sm:mx-auto sm:w-full sm:max-w-md'>
          <h2 className='text-center text-3xl font-extrabold text-gray-900'>
            Let&apos;s personalize your experience
          </h2>
          <p className='mt-2 text-center text-sm text-gray-600'>
            Step {step} of {totalSteps}
          </p>
        </div>

        <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
          <div className='bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10'>
            {/* Step 1: Job Preferences */}
            {step === 1 && (
              <div className='space-y-6'>
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

                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Preferred locations
                  </label>
                  <div className='mt-1 flex gap-2'>
                    <input
                      type='text'
                      className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm'
                      placeholder='e.g., New York, Remote'
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

                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Minimum salary expectation
                  </label>
                  <div className='mt-1 relative'>
                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                      <span className='text-gray-500 sm:text-sm'>$</span>
                    </div>
                    <input
                      type='text'
                      className='appearance-none block w-full pl-7 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm'
                      placeholder='e.g., 45,000'
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
                      onChange={(e) =>
                        updateFormData('jobPreferences', 'citizenshipStatus', e.target.value)
                      }
                    >
                      <option value=''>Select status</option>
                      <option value='us-citizen'>U.S. Citizen</option>
                      <option value='permanent-resident'>Permanent Resident</option>
                      <option value='h1b'>H1-B Visa</option>
                      <option value='f1'>F-1 Visa</option>
                      <option value='other'>Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700'>Job Type</label>
                  <select
                    className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm'
                    value={formData.jobPreferences.jobType}
                    onChange={(e) => updateFormData('jobPreferences', 'jobType', e.target.value)}
                  >
                    <option value=''>Select job type</option>
                    <option value='full-time'>Full Time</option>
                    <option value='part-time'>Part Time</option>
                    <option value='contract'>Contract</option>
                    <option value='internship'>Internship</option>
                    <option value='temporary'>Temporary</option>
                    <option value='freelance'>Freelance</option>
                  </select>
                </div>
              </div>
            )}

            {/* Step 2: Experience */}
            {step === 2 && (
              <div className='space-y-6'>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Years of experience
                  </label>
                  <div className='mt-1'>
                    <select
                      className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm'
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
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700'>Key skills</label>
                  <div className='mt-1 flex gap-2'>
                    <input
                      type='text'
                      className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm'
                      placeholder='e.g., JavaScript, React, Project Management'
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

                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Highest education level
                  </label>
                  <div className='mt-1'>
                    <select
                      className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm'
                      value={formData.experience.education}
                      onChange={(e) => updateFormData('experience', 'education', e.target.value)}
                    >
                      <option value=''>Select education level</option>
                      <option value='high-school'>High School</option>
                      <option value='bachelors'>Bachelor&apos;s Degree</option>
                      <option value='masters'>Master&apos;s Degree</option>
                      <option value='phd'>Ph.D.</option>
                      <option value='other'>Other</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Availability */}
            {step === 3 && (
              <div className='space-y-6'>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    When can you start?
                  </label>
                  <div className='mt-1'>
                    <select
                      className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm'
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

                <div>
                  <label className='block text-sm font-medium text-gray-700'>Phone Number</label>
                  <div className='mt-1'>
                    <input
                      type='tel'
                      className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm'
                      placeholder='+1 (555) 123-4567'
                      value={formData.availability.phoneNumber}
                      onChange={(e) =>
                        updateFormData('availability', 'phoneNumber', e.target.value)
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Additional Information
                  </label>
                  <div className='mt-1'>
                    <textarea
                      className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm'
                      rows={4}
                      placeholder='Any other important information we should know about (e.g., special requirements, preferences, etc.)'
                      value={formData.availability.additionalInfo}
                      onChange={(e) =>
                        updateFormData('availability', 'additionalInfo', e.target.value)
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Upload your resume (PDF)
                  </label>
                  <div className='mt-1'>
                    <div className='flex items-center justify-center w-full'>
                      <label
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-150 ${
                          isDragging
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                          <Upload className='w-8 h-8 mb-2 text-gray-500' />
                          <p className='mb-2 text-sm text-gray-500'>
                            <span className='font-semibold'>Click to upload</span> or drag and drop
                          </p>
                          <p className='text-xs text-gray-500'>PDF (max. 5MB)</p>
                        </div>
                        <input
                          type='file'
                          className='hidden'
                          accept='.pdf'
                          onChange={handleFileChange}
                          disabled={formData.availability.resume?.uploading}
                        />
                      </label>
                    </div>
                    {formData.availability.resume?.file && (
                      <p className='mt-2 text-sm text-gray-600'>
                        Selected file: {formData.availability.resume.file.name}
                      </p>
                    )}
                    {formData.availability.resume?.error && (
                      <p className='mt-2 text-sm text-red-600'>
                        {formData.availability.resume.error}
                      </p>
                    )}
                  </div>
                </div>

                {/* Add terms and conditions checkbox */}
                <div className='mt-6 border-t pt-6'>
                  <div className='flex items-start'>
                    <div className='flex items-center h-5'>
                      <input
                        id='terms'
                        type='checkbox'
                        checked={formData.termsAccepted}
                        onChange={(e) =>
                          setFormData({ ...formData, termsAccepted: e.target.checked })
                        }
                        className='h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded'
                      />
                    </div>
                    <div className='ml-3 text-sm'>
                      <label htmlFor='terms' className='font-medium text-gray-700'>
                        I agree to the{' '}
                        <Link
                          href='/privacy'
                          target='_blank'
                          className='text-primary-600 hover:text-primary-500'
                        >
                          Terms and Conditions
                        </Link>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {step === 4 && renderReviewSection()}

            {/* Step 5: Pricing */}
            {step === 5 && renderPricingSection()}

            {/* Navigation Buttons */}
            <div className='mt-6 flex items-center justify-between'>
              <button
                type='button'
                onClick={handleBack}
                disabled={step === 1 || isSubmitting}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md ${
                  step === 1 || isSubmitting
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <ChevronLeft className='h-4 w-4 mr-1' />
                Back
              </button>

              <button
                type='button'
                onClick={handleNext}
                disabled={isSubmitting || (step === totalSteps && !selectedPriceId)}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-500 hover:bg-primary-700 disabled:bg-primary-400 disabled:cursor-not-allowed ${
                  isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                      fill='none'
                      viewBox='0 0 24 24'
                    >
                      <circle
                        className='opacity-25'
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='currentColor'
                        strokeWidth='4'
                      />
                      <path
                        className='opacity-75'
                        fill='currentColor'
                        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                      />
                    </svg>
                    {step === totalSteps ? 'Processing Payment...' : 'Processing...'}
                  </>
                ) : (
                  <>
                    {step === totalSteps
                      ? 'Proceed to Payment'
                      : step === totalSteps - 1
                      ? 'Select Plan'
                      : 'Next'}
                    {step !== totalSteps && <ChevronRight className='h-4 w-4 ml-1' />}
                  </>
                )}
              </button>

              {/* Add error message display */}
              {error && <div className='mt-4 p-3 bg-red-50 text-red-700 rounded-md'>{error}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
