'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, ChevronLeft, Upload } from 'lucide-react';
import ButtonAccount from '@/components/ButtonAccount';

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

export default function OnboardingQuestionnaire() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const totalSteps = 3;

  const updateFormData = (section: keyof FormData, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleNext = () => {
    if (step === totalSteps) {
      // Submit data and redirect to dashboard
      handleSubmit();
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

    updateFormData('availability', 'resume', {
      file,
      uploading: false,
      error: null,
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Upload resume if exists
      let resumeUrl = null;
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

      // Save preferences with resume URL
      const preferencesResponse = await fetch('/api/user/preferences', {
        method: 'POST',
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

      if (!preferencesResponse.ok) {
        const data = await preferencesResponse.json();
        if (data.errors) {
          setError(data.errors.join(', '));
          setIsSubmitting(false);
          return;
        }
        throw new Error('Failed to save preferences');
      }

      // Mark onboarding as complete
      const onboardingResponse = await fetch('/api/user/complete-onboarding', {
        method: 'POST',
      });

      if (!onboardingResponse.ok) {
        throw new Error('Failed to complete onboarding');
      }
      console.log('hrrrr', formData);
      router.push('/dashboard');
    } catch (error) {
      console.error('Error:', error);
      setError('Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 flex flex-col'>
      <div className='absolute top-4 right-4'>
        {/* <button
          // onClick={handleLogout}
          className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
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
                  <div className='mt-1'>
                    <input
                      type='text'
                      className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                      placeholder='e.g., Software Engineer, Product Manager'
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
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Preferred locations
                  </label>
                  <div className='mt-1'>
                    <input
                      type='text'
                      className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                      placeholder='e.g., New York, Remote'
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
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Minimum salary expectation
                  </label>
                  <div className='mt-1'>
                    <input
                      type='text'
                      className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                      placeholder='e.g., $80,000'
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
                      className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
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
                  <div className='mt-1'>
                    <input
                      type='text'
                      className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                      placeholder='e.g., JavaScript, React, Project Management'
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

                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Highest education level
                  </label>
                  <div className='mt-1'>
                    <select
                      className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
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
                      className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
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
                    Notice period required?
                  </label>
                  <div className='mt-1'>
                    <select
                      className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
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

                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Upload your resume (PDF)
                  </label>
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
                        <input
                          type='file'
                          className='hidden'
                          accept='.pdf'
                          onChange={handleFileChange}
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
              </div>
            )}

            {/* Navigation Buttons */}
            <div className='mt-6 flex items-center justify-between'>
              <button
                type='button'
                onClick={handleBack}
                disabled={step === 1}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md ${
                  step === 1
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
                disabled={isSubmitting}
                className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed'
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
                    Processing...
                  </>
                ) : (
                  <>
                    {step === totalSteps ? 'Finish' : 'Next'}
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
