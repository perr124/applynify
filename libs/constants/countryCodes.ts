import { CountryCode, allCountryCodes } from './allCountryCodes';

// Export the same type
export type { CountryCode };

// Export the full list of country codes
export const countryCodes = allCountryCodes;

export const getCountryCodeByRegion = (regionCode: string): CountryCode => {
  return countryCodes.find((code) => code.code === regionCode) || countryCodes[0];
};
