import type { LocationData } from '../types';

export interface IpApiResponse {
  status: 'success' | 'fail';
  country: string;
  countryCode: string;
  region: string;
  regionName: string;
  city: string;
  lat: number;
  lon: number;
  timezone: string;
  query: string;
}

export async function fetchIpGeolocation(): Promise<LocationData> {
  let ipParam = '';

  try {
    const ipifyRes = await fetch('https://api.ipify.org?format=json', { signal: AbortSignal.timeout(5000) });
    const ipifyData = await ipifyRes.json();
    if (ipifyData.ip) {
      ipParam = `?ip=${encodeURIComponent(ipifyData.ip)}`;
    }
  } catch {
    // ipify unreachable; proxy will use server IP as fallback
  }

  const response = await fetch(`/api/geocode/ip${ipParam}`);

  if (!response.ok) {
    throw new Error('IP geolocation proxy error');
  }

  const data = await response.json();

  if (!data.latitude || !data.longitude) {
    throw new Error('IP geolocation failed to determine location');
  }

  return data as LocationData;
}

export function computeConfidence(
  ipData: IpApiResponse
): {
  confidence: LocationData['confidence'];
  reason: string;
} {
  const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const ipTimezone = ipData.timezone;
  const localeCountry = extractCountryFromLocale();

  const signals: string[] = [];

  const timezoneMatch = browserTimezone === ipTimezone;
  if (timezoneMatch) {
    signals.push('timezone_match');
  }

  const countryMatch = !localeCountry || localeCountry === ipData.countryCode.toUpperCase();
  if (countryMatch) {
    signals.push('country_match');
  }

  if (signals.length >= 2 && ipData.city && ipData.city !== '') {
    return { confidence: 'high', reason: 'city_region_timezone_consistent' };
  }

  if (signals.length >= 1 && ipData.regionName) {
    return {
      confidence: 'medium',
      reason: timezoneMatch ? 'timezone_matches_but_city_uncertain' : 'country_matches_but_city_uncertain',
    };
  }

  if (signals.length === 0 && ipData.country) {
    return {
      confidence: 'low',
      reason: 'conflicting_signals_or_missing_data',
    };
  }

  return {
    confidence: 'medium',
    reason: 'partial_signals',
  };
}

function extractCountryFromLocale(): string | null {
  try {
    const locales = navigator.languages || [navigator.language];
    for (const locale of locales) {
      if (locale.includes('-')) {
        const parts = locale.split('-');
        if (parts[1] && parts[1].length === 2) {
          return parts[1].toUpperCase();
        }
      }
    }
  } catch {
    // best-effort
  }
  return null;
}

export function buildLocationFromIp(
  ipData: IpApiResponse,
  confidence: LocationData['confidence']
): LocationData {
  return {
    latitude: ipData.lat,
    longitude: ipData.lon,
    city: ipData.city || ipData.regionName || 'Unknown',
    state: ipData.regionName || '',
    country: ipData.country,
    countryCode: ipData.countryCode.toLowerCase(),
    locationSource: 'ip_geolocation',
    confidence,
    isApproximate: true,
  };
}
