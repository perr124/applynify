interface GeoLocation {
  countryCode: string;
  country: string;
  currency: string;
}

export async function getUserLocation(): Promise<GeoLocation | null> {
  try {
    // Using ip-api.com (free tier: 45 requests per minute)
    const response = await fetch('http://ip-api.com/json/');
    const data = await response.json();

    if (data.status === 'success') {
      console.log(data, 'geolo');
      // Map country codes to our supported regions
      const countryToRegion: Record<string, { code: string; currency: string }> = {
        US: { code: 'US', currency: 'USD' },
        GB: { code: 'GB', currency: 'GBP' },
        DE: { code: 'EU', currency: 'EUR' }, // Germany
        FR: { code: 'EU', currency: 'EUR' }, // France
        IT: { code: 'EU', currency: 'EUR' }, // Italy
        ES: { code: 'EU', currency: 'EUR' }, // Spain
        CA: { code: 'CA', currency: 'CAD' },
        AU: { code: 'AU', currency: 'AUD' },
      };

      const countryCode = data.countryCode;
      const region = countryToRegion[countryCode] || { code: 'US', currency: 'USD' }; // Default to US if country not supported

      return {
        countryCode: region.code,
        country: data.country,
        currency: region.currency,
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching location:', error);
    return null;
  }
}
