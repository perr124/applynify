'use client';

import { useState } from 'react';
import Image from 'next/image';

interface Region {
  code: string;
  name: string;
  flag: string;
  currency: string;
}

const regions: Region[] = [
  { code: 'US', name: 'United States', flag: '🇺🇸', currency: 'USD' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', currency: 'GBP' },
  { code: 'EU', name: 'European Union', flag: '🇪🇺', currency: 'EUR' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', currency: 'CAD' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', currency: 'AUD' },
];

interface LanguageSelectorProps {
  onRegionChange: (region: Region) => void;
  currentRegion: Region;
}

const LanguageSelector = ({ onRegionChange, currentRegion }: LanguageSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='relative'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-base-300 transition-colors'
      >
        <span className='text-xl'>{currentRegion.flag}</span>
        <span className='text-sm font-medium'>{currentRegion.currency}</span>
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
