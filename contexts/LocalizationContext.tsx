'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getUserLocation } from '@/libs/geolocation';

interface Region {
  code: string;
  name: string;
  flagPath: string;
  currency: string;
}

interface LocalizationContextType {
  currentRegion: Region;
  setCurrentRegion: (region: Region) => void;
  formatCurrency: (amount: number) => string;
}

const defaultRegion: Region = {
  code: 'US',
  name: 'United States',
  flagPath: '/us.svg',
  currency: 'USD',
};

const regions: Record<string, Region> = {
  US: { code: 'US', name: 'United States', flagPath: '/us.svg', currency: 'USD' },
  GB: { code: 'GB', name: 'United Kingdom', flagPath: '/gb.svg', currency: 'GBP' },
  EU: { code: 'EU', name: 'Europe', flagPath: '/eu.svg', currency: 'EUR' },
  CA: { code: 'CA', name: 'Canada', flagPath: '/ca.svg', currency: 'CAD' },
  AU: { code: 'AU', name: 'Australia', flagPath: '/au.svg', currency: 'AUD' },
};

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export function LocalizationProvider({ children }: { children: ReactNode }) {
  const [currentRegion, setCurrentRegion] = useState<Region>(() => {
    // Try to get the saved region from localStorage
    if (typeof window !== 'undefined') {
      const savedRegion = localStorage.getItem('selectedRegion');
      if (savedRegion) {
        return JSON.parse(savedRegion);
      }
    }
    return defaultRegion;
  });

  // Fetch user's localization from database on first load
  useEffect(() => {
    const fetchUserLocalization = async () => {
      try {
        const response = await fetch('/api/user/preferences');
        if (!response.ok) throw new Error('Failed to fetch preferences');
        const data = await response.json();

        // If user has a localization preference in the database, use it
        if (data.localization && regions[data.localization]) {
          setCurrentRegion(regions[data.localization]);
        } else {
          // If no database preference, try to detect location
          const location = await getUserLocation();
          if (location && regions[location.countryCode]) {
            setCurrentRegion(regions[location.countryCode]);
          }
        }
      } catch (error) {
        console.error('Error fetching user localization:', error);
        // Fallback to geolocation if database fetch fails
        const location = await getUserLocation();
        if (location && regions[location.countryCode]) {
          setCurrentRegion(regions[location.countryCode]);
        }
      }
    };

    fetchUserLocalization();
  }, []);

  // Save region to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('selectedRegion', JSON.stringify(currentRegion));
  }, [currentRegion]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currentRegion.currency,
    }).format(amount);
  };

  return (
    <LocalizationContext.Provider
      value={{
        currentRegion,
        setCurrentRegion,
        formatCurrency,
      }}
    >
      {children}
    </LocalizationContext.Provider>
  );
}

export function useLocalization() {
  const context = useContext(LocalizationContext);
  if (context === undefined) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
}
