'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import React from 'react';
import config from '@/config';
import { ChevronRight, ChevronLeft, Upload } from 'lucide-react';
import ButtonAccount from '@/components/ButtonAccount';
import apiClient from '@/libs/api';
import Link from 'next/link';
import Image from 'next/image';
import logo from '@/app/icon.png';
import { countries } from '@/app/data/countries';
import { useLocalization } from '@/contexts/LocalizationContext';
import { getPlanPrice, PRICING_PLANS } from '@/libs/constants/pricing';
import {
  citizenshipStatusByCountry,
  CitizenshipStatus,
  CountryCode,
} from '@/app/data/citizenshipStatus';
import LanguageSelector from '@/components/LanguageSelector';
import { getAddressPlaceholders } from '@/libs/constants/address';
import { getPhoneFormat } from '@/libs/constants/phone';
import { countryCodes, getCountryCodeByRegion } from '@/libs/constants/countryCodes';

type FormData = {
  jobPreferences: {
    roles: string[];
    locations: string[];
    salary: {
      minimum: string;
      preferred: string;
    };
    citizenshipStatus: string;
    requiresSponsorship: boolean;
    jobType: string[];
  };
  experience: {
    yearsOfExperience: string;
    education: string;
    skills: string[];
    isVeteran: boolean;
    hasDisability: boolean;
    ethnicity: string;
    dateOfBirth: string;
  };
  availability: {
    startDate: string;
    phoneNumber?: string;
    additionalInfo?: string;
    address?: {
      street: string;
      street2?: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    resume?: {
      file: File | null;
      uploading: boolean;
      error: string | null;
    };
  };
  termsAccepted: boolean;
  marketingSource: string;
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
    requiresSponsorship: false,
    jobType: [],
  },
  experience: {
    yearsOfExperience: '',
    education: '',
    skills: [],
    isVeteran: false,
    hasDisability: false,
    ethnicity: '',
    dateOfBirth: '',
  },
  availability: {
    startDate: '',
    phoneNumber: '',
    additionalInfo: '',
    address: {
      street: '',
      street2: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
    resume: {
      file: null,
      uploading: false,
      error: null,
    },
  },
  termsAccepted: false,
  marketingSource: '',
};

const formatSalary = (value: string) => {
  // Remove any non-digit characters
  const numbers = value.replace(/\D/g, '');
  // Format with commas
  return numbers ? Number(numbers).toLocaleString() : '';
};

export default function OnboardingQuestionnaire() {
  const { formatCurrency, currentRegion, setCurrentRegion } = useLocalization();
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

  // Add this near the other useState declarations
  const [isJobTypeDropdownOpen, setIsJobTypeDropdownOpen] = useState(false);

  // Add this near the other useEffect declarations
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

          // Ensure jobType is always an array
          const jobType = data.jobPreferences?.jobType
            ? Array.isArray(data.jobPreferences.jobType)
              ? data.jobPreferences.jobType
              : [data.jobPreferences.jobType]
            : [];

          setFormData({
            jobPreferences: {
              roles: data.jobPreferences?.roles || [],
              locations: data.jobPreferences?.locations || [],
              salary: {
                minimum: data.jobPreferences?.salary?.minimum || '',
                preferred: data.jobPreferences?.salary?.preferred || '',
              },
              citizenshipStatus: data.jobPreferences?.citizenshipStatus || '',
              requiresSponsorship: data.jobPreferences?.requiresSponsorship || false,
              jobType: jobType,
            },
            experience: {
              yearsOfExperience: data.experience?.yearsOfExperience || '',
              education: data.experience?.education || '',
              skills: data.experience?.skills || [],
              isVeteran: data.experience?.isVeteran || false,
              hasDisability: data.experience?.hasDisability || false,
              ethnicity: data.experience?.ethnicity || '',
              dateOfBirth: data.experience?.dateOfBirth || '',
            },
            availability: {
              startDate: data.availability?.startDate || '',
              phoneNumber: data.availability?.phoneNumber || '',
              additionalInfo: data.availability?.additionalInfo || '',
              address: data.availability?.address || {
                street: '',
                street2: '',
                city: '',
                state: '',
                zipCode: '',
                country: '',
              },
              resume: {
                file: activeResume ? new File([], activeResume.filename) : null,
                uploading: false,
                error: null,
              },
            },
            termsAccepted: data.termsAccepted || false,
            marketingSource: data.marketingSource || '',
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
    // Clear error when moving between steps
    setError(null);

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

      // Validate required fields for step 1
      if (formData.jobPreferences.roles.length === 0) {
        setError('Please add at least one desired role');
        return;
      }
      if (formData.jobPreferences.locations.length === 0) {
        setError('Please add at least one preferred location');
        return;
      }
      if (!formData.jobPreferences.citizenshipStatus) {
        setError('Please select your citizenship status');
        return;
      }
      if (formData.jobPreferences.jobType.length === 0) {
        setError('Please select at least one job type');
        return;
      }
      if (!formData.jobPreferences.salary.minimum) {
        setError('Please enter your minimum salary expectation');
        return;
      }
    }

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

      // Validate required fields for step 2
      if (!formData.experience.yearsOfExperience) {
        setError('Please select your years of experience');
        return;
      }
      if (formData.experience.skills.length === 0) {
        setError('Please add at least one skill');
        return;
      }
      if (!formData.experience.education) {
        setError('Please select your highest education level');
        return;
      }
    }

    if (step === 3) {
      // Validate required fields for step 3
      if (!formData.availability.startDate) {
        setError('Please select when you can start');
        return;
      }
      if (!formData.availability.phoneNumber) {
        setError('Please enter your phone number');
        return;
      }
      if (!formData.availability.address?.city) {
        setError('Please enter your city');
        return;
      }
      if (!formData.availability.address?.state) {
        setError('Please enter your state');
        return;
      }
      if (!formData.availability.address?.zipCode) {
        setError('Please enter your ZIP code');
        return;
      }
      if (!formData.availability.address?.country) {
        setError('Please enter your country');
        return;
      }
      if (!formData.availability.resume?.file) {
        setError('Please upload your resume');
        return;
      }
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
            jobPreferences: {
              ...formData.jobPreferences,
              requiresSponsorship: formData.jobPreferences.requiresSponsorship,
            },
            experience: formData.experience,
            availability: {
              startDate: formData.availability.startDate,
              phoneNumber: formData.availability.phoneNumber,
              additionalInfo: formData.availability.additionalInfo,
              address: formData.availability.address,
              resumeUrl: resumeUrl,
            },
            marketingSource: formData.marketingSource,
            termsAccepted: formData.termsAccepted,
            localization: currentRegion.code,
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
    setError(null);
    setStep((prev) => prev - 1);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Accept PDF, DOC, and DOCX files
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (!allowedTypes.includes(file.type)) {
      updateFormData('availability', 'resume', {
        file: null,
        uploading: false,
        error: 'Please upload a PDF, DOC, or DOCX file',
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

    // Accept PDF, DOC, and DOCX files
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (!allowedTypes.includes(file.type)) {
      updateFormData('availability', 'resume', {
        file: null,
        uploading: false,
        error: 'Please upload a PDF, DOC, or DOCX file',
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
                    ? formData.jobPreferences.roles
                        .map((role) => role.charAt(0).toUpperCase() + role.slice(1))
                        .join(', ')
                    : 'None specified'}
                </dd>
              </div>
              <div>
                <dt className='text-sm text-gray-500'>Preferred Locations</dt>
                <dd className='mt-1'>
                  {formData.jobPreferences.locations.length > 0
                    ? formData.jobPreferences.locations
                        .map((location) => location.charAt(0).toUpperCase() + location.slice(1))
                        .join(', ')
                    : 'None specified'}
                </dd>
              </div>
              <div>
                <dt className='text-sm text-gray-500'>Minimum Salary</dt>
                <dd className='mt-1'>
                  {formData.jobPreferences.salary.minimum
                    ? `${getCurrencySymbol()}${formData.jobPreferences.salary.minimum}`
                    : 'Not specified'}
                </dd>
              </div>
              <div>
                <dt className='text-sm text-gray-500'>Citizenship Status</dt>
                <dd className='mt-1'>
                  {formData.jobPreferences.citizenshipStatus
                    ? formData.jobPreferences.citizenshipStatus
                        .split('-')
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ')
                    : 'Not specified'}
                </dd>
              </div>
              <div>
                <dt className='text-sm text-gray-500'>Job Type</dt>
                <dd className='mt-1'>
                  {formData.jobPreferences.jobType.length > 0
                    ? formData.jobPreferences.jobType
                        .map((type) =>
                          type
                            .split('-')
                            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(' ')
                        )
                        .join(', ')
                    : 'Not specified'}
                </dd>
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
                <dd className='mt-1'>
                  {formData.experience.education
                    ? formData.experience.education
                        .split('-')
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ')
                    : 'Not specified'}
                </dd>
              </div>
              <div>
                <dt className='text-sm text-gray-500'>Skills</dt>
                <dd className='mt-1'>
                  {formData.experience.skills.length > 0
                    ? formData.experience.skills
                        .map((skill) => skill.charAt(0).toUpperCase() + skill.slice(1))
                        .join(', ')
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
                <dd className='mt-1'>
                  {formData.availability.additionalInfo
                    ? formData.availability.additionalInfo.charAt(0).toUpperCase() +
                      formData.availability.additionalInfo.slice(1)
                    : 'Not specified'}
                </dd>
              </div>
              <div>
                <dt className='text-sm text-gray-500'>Resume</dt>
                <dd className='mt-1'>
                  {formData.availability.resume?.file && (
                    <div className='mt-2 flex items-center justify-between'>
                      <p className='text-sm text-gray-600'>
                        Selected file: {formData.availability.resume.file.name}
                      </p>
                      <button
                        type='button'
                        onClick={() => {
                          updateFormData('availability', 'resume', {
                            file: null,
                            uploading: false,
                            error: null,
                          });
                        }}
                        className='inline-flex items-center justify-center w-6 h-6 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                      >
                        <span className='sr-only'>Remove resume</span>×
                      </button>
                    </div>
                  )}
                </dd>
              </div>
              {formData.availability.address && (
                <div>
                  <dt className='text-sm text-gray-500'>Address</dt>
                  <dd className='mt-1'>
                    <div className='space-y-1'>
                      <p>
                        {formData.availability.address.street.charAt(0).toUpperCase() +
                          formData.availability.address.street.slice(1)}
                      </p>
                      <p>
                        {formData.availability.address.city.charAt(0).toUpperCase() +
                          formData.availability.address.city.slice(1)}
                        , {formData.availability.address.state.toUpperCase()}{' '}
                        {formData.availability.address.zipCode}
                      </p>
                      <p>
                        {formData.availability.address.country.charAt(0).toUpperCase() +
                          formData.availability.address.country.slice(1)}
                      </p>
                    </div>
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>
    );
  };

  const renderPricingSection = () => {
    const pricingTiers = [
      {
        name: PRICING_PLANS.LITE.name,
        price: getPlanPrice('LITE', currentRegion.code as 'US' | 'GB' | 'EU' | 'CA' | 'AU'),
        priceId: PRICING_PLANS.LITE.getStripeId(
          currentRegion.code as 'US' | 'GB' | 'EU' | 'CA' | 'AU'
        ),
        description: 'For job seekers starting out',
        features: [
          `${PRICING_PLANS.LITE.applicationLimit} jobs applied to directly on company sites`,
          'Write cover letters on your behalf',
          'Quick service within 5 days',
          'Advanced Application tracking in your dashboard',
          'Standard support',
        ],
      },
      {
        name: PRICING_PLANS.PRO.name,
        price: getPlanPrice('PRO', currentRegion.code as 'US' | 'GB' | 'EU' | 'CA' | 'AU'),
        priceId: PRICING_PLANS.PRO.getStripeId(
          currentRegion.code as 'US' | 'GB' | 'EU' | 'CA' | 'AU'
        ),
        description: 'Optimized for maximizing career opportunities',
        features: [
          `${PRICING_PLANS.PRO.applicationLimit} jobs applied to directly on company sites`,
          'Write cover letters on your behalf',
          'Priority service within 4 days',
          'Advanced Application tracking in your dashboard',
          '24/7 priority support',
          'Custom job search strategies',
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
                <div className='text-2xl font-bold'>{formatCurrency(tier.price)}</div>
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

  // Add this helper function
  const getCurrencySymbol = () => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currentRegion.currency,
    });
    return formatter.format(0).replace(/[\d,]/g, '').trim().replace('.', '');
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
      <div className='absolute top-4 right-4 flex items-center gap-4'>
        <LanguageSelector currentRegion={currentRegion} onRegionChange={setCurrentRegion} />
        <ButtonAccount />
      </div>
      <div className='absolute top-6 left-4'>
        <Link href='/' className='flex items-center gap-2'>
          <Image
            src={logo}
            alt={`${config.appName} logo`}
            className='w-24 sm:w-32 md:w-32 lg:w-36 h-auto'
            priority={true}
          />
        </Link>
      </div>
      <div className='min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:py-12 lg:py-8 sm:px-6 lg:px-8'>
        <div className='sm:mx-auto sm:w-full sm:max-w-md'>
          <h2 className='text-center text-3xl font-extrabold text-gray-900 mt-16 sm:mt-0'>
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
                    What roles are you interested in? <span className='text-red-500'>*</span>
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
                  {/* Keep the chips container here */}
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
                    Preferred locations <span className='text-red-500'>*</span>
                  </label>
                  <div className='mt-1 flex gap-2'>
                    <input
                      type='text'
                      className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm'
                      placeholder='e.g., New York, US Remote, London'
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

                  <p className='mt-1 text-sm text-gray-500'>
                    Tip: For remote roles, specify city/country (e.g., "NY Remote" or "UK Remote").
                    <br></br>
                    Adding multiple locations in addition to "Remote" indicates hybrid opportunities
                    (e.g., "NY Remote, New York, New Jersey").
                  </p>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Minimum salary expectation <span className='text-red-500'>*</span>
                  </label>
                  <div className='mt-1 relative'>
                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                      <span className='text-gray-500 sm:text-sm whitespace-nowrap'>
                        {getCurrencySymbol()}
                      </span>
                    </div>
                    <input
                      type='text'
                      className={`appearance-none block w-full ${
                        getCurrencySymbol().length > 1 ? 'pl-10' : 'pl-7'
                      } px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                      placeholder={`e.g., ${formatSalary('45000')}`}
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
                    Citizenship Status <span className='text-red-500'>*</span>
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
                  <label className='block text-sm font-medium text-gray-700'>
                    Job Type <span className='text-red-500'>*</span>
                  </label>
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
            )}

            {/* Step 2: Experience */}
            {step === 2 && (
              <div className='space-y-6'>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Years of experience <span className='text-red-500'>*</span>
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
                  <label className='block text-sm font-medium text-gray-700'>
                    Key skills <span className='text-red-500'>*</span>
                  </label>
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

                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Highest education level <span className='text-red-500'>*</span>
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
                        <option value='black'>Black or African American</option>
                        <option value='hispanic'>Hispanic or Latino</option>
                        <option value='native-hawaiian'>
                          Native Hawaiian or Other Pacific Islander
                        </option>
                        <option value='white'>White</option>
                        <option value='two-or-more'>Two or More Races</option>
                        <option value='other'>Other</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700'>
                      Date of Birth <span className='text-red-500'>*</span>
                    </label>
                    <div className='mt-1'>
                      <input
                        type='date'
                        required
                        className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm'
                        value={formData.experience.dateOfBirth}
                        onChange={(e) =>
                          updateFormData('experience', 'dateOfBirth', e.target.value)
                        }
                      />
                    </div>
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
              </div>
            )}

            {/* Step 3: Availability */}
            {step === 3 && (
              <div className='space-y-6'>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    When can you start? <span className='text-red-500'>*</span>
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
                  <label className='block text-sm font-medium text-gray-700'>
                    Phone Number <span className='text-red-500'>*</span>
                  </label>
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
                  <label className='block text-sm font-medium text-gray-700'>
                    Address <span className='text-red-500'>*</span>
                  </label>
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
                  <div className='mt-1'>
                    <textarea
                      className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm'
                      rows={5}
                      placeholder="This could include any additional languages you speak, job roles you've recently applied to, or any other important information we should know."
                      value={formData.availability.additionalInfo}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        updateFormData('availability', 'additionalInfo', e.target.value)
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Upload your resume (PDF, DOC, or DOCX) <span className='text-red-500'>*</span>
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
                          <p className='text-xs text-gray-500'>PDF, DOC, or DOCX (max. 5MB)</p>
                        </div>
                        <input
                          type='file'
                          className='hidden'
                          accept='.pdf,.doc,.docx'
                          onChange={handleFileChange}
                          disabled={formData.availability.resume?.uploading}
                        />
                      </label>
                    </div>
                    {formData.availability.resume?.file && (
                      <div className='mt-2 flex items-center justify-between'>
                        <p className='text-sm text-gray-600'>
                          Selected file: {formData.availability.resume.file.name}
                        </p>
                        <button
                          type='button'
                          onClick={() => {
                            updateFormData('availability', 'resume', {
                              file: null,
                              uploading: false,
                              error: null,
                            });
                          }}
                          className='inline-flex items-center justify-center w-6 h-6 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                        >
                          <span className='sr-only'>Remove resume</span>×
                        </button>
                      </div>
                    )}
                    {formData.availability.resume?.error && (
                      <p className='mt-2 text-sm text-red-600'>
                        {formData.availability.resume.error}
                      </p>
                    )}
                  </div>
                </div>

                {/* Add marketing source field after resume upload */}
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Where did you hear about Applynify? <span className='text-red-500'>*</span>
                  </label>
                  <div className='mt-1'>
                    <select
                      className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm'
                      value={formData.marketingSource}
                      onChange={(e) =>
                        setFormData({ ...formData, marketingSource: e.target.value })
                      }
                    >
                      <option value=''>Select an option</option>
                      <option value='google'>Google Search</option>
                      <option value='linkedin'>LinkedIn</option>
                      <option value='facebook'>Facebook</option>
                      <option value='instagram'>Instagram</option>
                      <option value='twitter'>X</option>
                      <option value='friend'>Friend</option>
                      <option value='other'>Other</option>
                    </select>
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
            <div className='mt-6'>
              {/* Add error message above buttons */}
              {error && (
                <div className='mb-4 p-3 bg-red-50 text-red-700 rounded-md text-center'>
                  {error}
                </div>
              )}

              <div className='flex items-center justify-between'>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
