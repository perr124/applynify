'use client';

import { useState, useEffect } from 'react';

interface Region {
  code: string;
  name: string;
  flag: string;
  currency: string;
}

interface LanguageSelectorProps {
  currentRegion: Region;
  onRegionChange: (region: Region) => void;
}

const regions: Region[] = [
  { code: 'US', name: 'United States', flag: '🇺🇸', currency: 'USD' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', currency: 'GBP' },
  { code: 'EU', name: 'European Union', flag: '🇪🇺', currency: 'EUR' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', currency: 'CAD' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', currency: 'AUD' },
];

const LanguageSelector = ({ currentRegion, onRegionChange }: LanguageSelectorProps) => {
  const [isClient, setIsClient] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Show loading state during server-side rendering
  if (!isClient) {
    return (
      <div className='relative'>
        <button
          type='button'
          className='inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
        >
          <div className='h-4 w-4 bg-gray-200 rounded animate-pulse'></div>
        </button>
      </div>
    );
  }

  return (
    <div className='relative'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-base-300 transition-colors'
      >
        <span className='text-xl'>{currentRegion.flag}</span>
        <span className='text-sm font-medium'>{currentRegion.code}</span>
      </button>

      {isOpen && (
        <div className='absolute right-0 mt-2 w-48 bg-base-200 rounded-lg shadow-lg z-50'>
          <div className='py-1'>
            {regions.map((region) => (
              <button
                key={region.code}
                onClick={() => {
                  onRegionChange(region);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-base-300 transition-colors ${
                  currentRegion.code === region.code ? 'bg-base-300' : ''
                }`}
              >
                <span className='text-xl'>{region.flag}</span>
                <span className='text-sm font-medium'>{region.name}</span>
                <span className='text-sm text-base-content/60 ml-auto'>{region.currency}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
