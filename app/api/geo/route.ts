import { NextRequest, NextResponse } from 'next/server';
import { logAudit } from '@/libs/logger';

// Map found country codes to supported regions/currencies
const countryToRegion: Record<
  string,
  { code: 'US' | 'GB' | 'EU' | 'CA' | 'AU'; currency: string }
> = {
  US: { code: 'US', currency: 'USD' },
  GB: { code: 'GB', currency: 'GBP' },
  DE: { code: 'EU', currency: 'EUR' },
  FR: { code: 'EU', currency: 'EUR' },
  IT: { code: 'EU', currency: 'EUR' },
  ES: { code: 'EU', currency: 'EUR' },
  IE: { code: 'EU', currency: 'EUR' },
  NL: { code: 'EU', currency: 'EUR' },
  BE: { code: 'EU', currency: 'EUR' },
  AT: { code: 'EU', currency: 'EUR' },
  PT: { code: 'EU', currency: 'EUR' },
  FI: { code: 'EU', currency: 'EUR' },
  GR: { code: 'EU', currency: 'EUR' },
  LU: { code: 'EU', currency: 'EUR' },
  LV: { code: 'EU', currency: 'EUR' },
  LT: { code: 'EU', currency: 'EUR' },
  EE: { code: 'EU', currency: 'EUR' },
  SK: { code: 'EU', currency: 'EUR' },
  SI: { code: 'EU', currency: 'EUR' },
  MT: { code: 'EU', currency: 'EUR' },
  CY: { code: 'EU', currency: 'EUR' },
  CA: { code: 'CA', currency: 'CAD' },
  AU: { code: 'AU', currency: 'AUD' },
};

function detectCountryCode(req: NextRequest): string | null {
  // Hosting providers (Vercel/Cloudflare/AWS) often set a country header
  const headers = req.headers;
  const vercel = headers.get('x-vercel-ip-country');
  const cf = headers.get('cf-ipcountry');
  const cloudfront = headers.get('cloudfront-viewer-country');
  const manual = headers.get('x-country-code'); // for local testing
  const candidates = [vercel, cf, cloudfront, manual].filter(Boolean) as string[];

  if (candidates.length && /^[A-Z]{2}$/.test(candidates[0])) return candidates[0];

  // Fallback: derive from Accept-Language (e.g., en-US, en-GB, fr-FR)
  const al = headers.get('accept-language') || '';
  const match = al.match(/-[A-Z]{2}/);
  if (match) return match[0].slice(1);

  return null;
}

export async function GET(req: NextRequest) {
  try {
    const headers = req.headers;
    const debugHeaders = {
      vercel: headers.get('x-vercel-ip-country'),
      cf: headers.get('cf-ipcountry'),
      cloudfront: headers.get('cloudfront-viewer-country'),
      manual: headers.get('x-country-code'),
      acceptLanguage: headers.get('accept-language'),
    };
    console.debug('Geo headers (dev only)', debugHeaders);

    const cc = detectCountryCode(req) || 'US';
    const region = countryToRegion[cc] || { code: 'US', currency: 'USD' };
    console.debug('Geo decision (dev only)', {
      rawCountry: cc,
      mappedCode: region.code,
      currency: region.currency,
    });
    // Always log an audit line in production and development
    logAudit('geo_decision', {
      rawCountry: cc,
      mappedCode: region.code,
      currency: region.currency,
    });

    return NextResponse.json({
      countryCode: region.code,
      currency: region.currency,
    });
  } catch (e) {
    console.error('Geo endpoint error', { error: e });
    // Default to US if anything goes wrong
    return NextResponse.json({ countryCode: 'US', currency: 'USD' }, { status: 200 });
  }
}
