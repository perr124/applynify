export type CitizenshipStatus = {
  value: string;
  label: string;
};

export type CountryCode = 'US' | 'GB' | 'EU' | 'CA' | 'AU';

export const citizenshipStatusByCountry: Record<CountryCode | 'DEFAULT', CitizenshipStatus[]> = {
  US: [
    { value: 'us-citizen', label: 'U.S. Citizen' },
    { value: 'permanent-resident', label: 'Permanent Resident' },
    { value: 'h1b', label: 'H1-B Visa' },
    { value: 'f1', label: 'F-1 Visa' },
    { value: 'other', label: 'Other' },
  ],
  GB: [
    { value: 'uk-citizen', label: 'UK Citizen' },
    { value: 'uk-visa', label: 'UK Work Visa' },
    { value: 'other', label: 'Other' },
  ],
  EU: [
    { value: 'eu-citizen', label: 'EU Citizen' },
    { value: 'eu-resident', label: 'EU Resident' },
    { value: 'eu-work-permit', label: 'EU Work Permit' },
    { value: 'other', label: 'Other' },
  ],
  CA: [
    { value: 'ca-citizen', label: 'Canadian Citizen' },
    { value: 'ca-permanent', label: 'Permanent Resident' },
    { value: 'ca-work-permit', label: 'Work Permit' },
    { value: 'other', label: 'Other' },
  ],
  AU: [
    { value: 'au-citizen', label: 'Australian Citizen' },
    { value: 'au-permanent', label: 'Permanent Resident' },
    { value: 'au-work-visa', label: 'Work Visa' },
    { value: 'other', label: 'Other' },
  ],
  // Default options if country is not found
  DEFAULT: [
    { value: 'citizen', label: 'Citizen' },
    { value: 'permanent-resident', label: 'Permanent Resident' },
    { value: 'work-visa', label: 'Work Visa' },
    { value: 'other', label: 'Other' },
  ],
};
