export interface JobPreferences {
  roles: string[];
  locations: string[];
  remotePreference: string;
  salary: {
    minimum: string;
    preferred: string;
  };
}

export interface Experience {
  yearsOfExperience: string;
  education: string;
  skills: string[];
}

export interface Availability {
  startDate: string;
  noticeRequired: string;
}

export interface PreferencesData {
  jobPreferences?: JobPreferences;
  experience?: Experience;
  availability?: Availability;
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
    if (!data.availability.noticeRequired) {
      errors.push('Notice period is required');
    }
  } else {
    errors.push('Availability details are required');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
