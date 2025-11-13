export interface JobPreferences {
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
}

export type Experience = {
  yearsOfExperience: string;
  education: string;
  skills: string[];
  isVeteran: boolean;
  hasDisability: boolean;
  disabilityDetails?: string;
  ethnicity: string;
  dateOfBirth: string;
  gender?: string;
  pronouns?: string;
};

export interface Availability {
  startDate: string;
  phoneNumber?: string;
  additionalInfo?: string;
  linkedInUrl?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export interface Resume {
  id: string;
  filename: string;
  url: string;
  uploadedAt: Date;
  status: 'active' | 'archived';
}

export interface PreferencesData {
  jobPreferences: JobPreferences;
  experience: Experience;
  availability: Availability;
  applicationsStatus?: 'notStarted' | 'started' | 'completed';
  resumes?: Resume[];
  marketingSource?: string;
  termsAccepted?: boolean;
  localization?: string;
}

export function validatePreferences(data: PreferencesData): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (data.jobPreferences) {
    if (!Array.isArray(data.jobPreferences.roles) || data.jobPreferences.roles.length === 0) {
      errors.push('At least one role is required');
    }
    if (
      !Array.isArray(data.jobPreferences.locations) ||
      data.jobPreferences.locations.length === 0
    ) {
      errors.push('At least one location is required');
    }
    if (!data.jobPreferences.salary?.minimum) {
      errors.push('Minimum salary is required');
    }
  } else {
    errors.push('Job preferences are required');
  }

  if (data.experience) {
    if (!data.experience.yearsOfExperience) {
      errors.push('Years of experience is required');
    }
    if (!Array.isArray(data.experience.skills) || data.experience.skills.length === 0) {
      errors.push('At least one skill is required');
    }
  } else {
    errors.push('Experience details are required');
  }

  if (data.availability) {
    if (!data.availability.startDate) {
      errors.push('Start date is required');
    }
  } else {
    errors.push('Availability details are required');
  }

  // Validate resumes if they exist
  if (data.resumes && Array.isArray(data.resumes)) {
    const activeResumes = data.resumes.filter((resume) => resume.status === 'active');
    if (activeResumes.length > 1) {
      errors.push('Only one resume can be active at a time');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
