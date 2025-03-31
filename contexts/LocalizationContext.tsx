'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getUserLocation } from '@/libs/geolocation';

interface Region {
  code: string;
  name: string;
  flag: string;
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
  flag: '🇺🇸',
  currency: 'USD',
};

const regions: Record<string, Region> = {
  US: { code: 'US', name: 'United States', flag: '🇺🇸', currency: 'USD' },
  GB: { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', currency: 'GBP' },
  EU: { code: 'EU', name: 'European Union', flag: '🇪🇺', currency: 'EUR' },
  CA: { code: 'CA', name: 'Canada', flag: '🇨🇦', currency: 'CAD' },
  AU: { code: 'AU', name: 'Australia', flag: '🇦🇺', currency: 'AUD' },
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

  // Detect user's location on first load
  useEffect(() => {
    const detectLocation = async () => {
      // Only detect if no region is saved
      if (!localStorage.getItem('selectedRegion')) {
        const location = await getUserLocation();
        if (location && regions[location.countryCode]) {
          setCurrentRegion(regions[location.countryCode]);
        }
      }
    };

    detectLocation();
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
