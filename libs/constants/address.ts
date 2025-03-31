export type AddressPlaceholders = {
  street: string;
  street2: string;
  city: string;
  state?: string;
  zipCode: string;
};

export const getAddressPlaceholders = (regionCode: string): AddressPlaceholders => {
  switch (regionCode) {
    case 'GB':
      return {
        street: 'House/flat number/building name',
        street2: 'Street',
        city: 'Town/city',
        // state: 'State',
        zipCode: 'Postcode',
      };
    case 'US':
      return {
        street: 'Street Address',
        street2: 'Apartment, suite, unit, etc. (optional)',
        city: 'City',
        state: 'State',
        zipCode: 'ZIP Code',
      };
    default:
      return {
        street: 'Address Line 1',
        street2: 'Address Line 2',
        city: 'City',
        state: 'State',
        zipCode: 'ZIP/Postal Code',
      };
  }
};
