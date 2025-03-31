export type PhoneFormat = {
  placeholder: string;
  countryCode: string;
};

export const getPhoneFormat = (regionCode: string): PhoneFormat => {
  switch (regionCode) {
    case 'GB':
      return {
        placeholder: '20 7123 4567',
        countryCode: '+44',
      };
    case 'US':
      return {
        placeholder: '(555) 123-4567',
        countryCode: '+1',
      };
    case 'CA':
      return {
        placeholder: '(555) 123-4567',
        countryCode: '+1',
      };
    case 'AU':
      return {
        placeholder: '2 1234 5678',
        countryCode: '+61',
      };
    case 'EU':
      return {
        placeholder: '20 123 4567',
        countryCode: '+33',
      };
    default:
      return {
        placeholder: '(555) 123-4567',
        countryCode: '+1',
      };
  }
};
