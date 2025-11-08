interface GeoLocation {
  countryCode: string;
  country: string;
  currency: string;
}

export async function getUserLocation(): Promise<GeoLocation | null> {
  try {
    // Internal endpoint that infers region from request headers (no third-party calls)
    const response = await fetch('/api/geo');
    if (!response.ok) return null;
    const data = await response.json();
    console.debug('Client geo result (dev only)', {
      countryCode: data?.countryCode,
      currency: data?.currency,
    });
    return {
      countryCode: data.countryCode,
      country: data.countryCode, // country name not provided; not needed by UI currently
      currency: data.currency,
    };
  } catch (error) {
    console.error('Error fetching location', { error });
    return null;
  }
}
