'use client';

import { useState, useEffect } from 'react';

interface Region {
  code: string;
  name: string;
  flagPath: string;
  currency: string;
}

interface LanguageSelectorProps {
  currentRegion: Region;
  onRegionChange: (region: Region) => void;
}

const regions: Region[] = [
  { code: 'US', name: 'United States', flagPath: '/us.svg', currency: 'USD' },
  { code: 'GB', name: 'United Kingdom', flagPath: '/gb.svg', currency: 'GBP' },
  { code: 'EU', name: 'Europe', flagPath: '/eu.svg', currency: 'EUR' },
  { code: 'CA', name: 'Canada', flagPath: '/ca.svg', currency: 'CAD' },
  { code: 'AU', name: 'Australia', flagPath: '/au.svg', currency: 'AUD' },
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
        <img
          src={currentRegion.flagPath}
          alt={`${currentRegion.name} flag`}
          className='w-5 h-4 object-contain'
        />
        <span className='text-sm font-medium'>{currentRegion.code}</span>
      </button>

      {isOpen && (
        <div className='fixed left-4 right-4 sm:left-auto sm:right-0 sm:absolute mt-2 w-auto sm:w-48 bg-base-200 rounded-lg shadow-lg z-[100]'>
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
                <img
                  src={region.flagPath}
                  alt={`${region.name} flag`}
                  className='w-5 h-4 object-contain'
                />
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
