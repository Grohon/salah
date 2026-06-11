import type { LocationData } from '../types';

const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org';
const GEOCODING_BASE = 'https://geocoding-api.open-meteo.com/v1';

interface NominatimResult {
  lat: string;
  lon: string;
  address: {
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    country?: string;
    country_code?: string;
  };
}

interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  country_code: string;
  admin1?: string;
  timezone?: string;
}

export async function reverseGeocode(
  latitude: number,
  longitude: number,
  source: LocationData['locationSource'] = 'gps'
): Promise<LocationData> {
  const params = new URLSearchParams({
    lat: latitude.toString(),
    lon: longitude.toString(),
    format: 'json',
  });

  const response = await fetch(`${NOMINATIM_BASE}/reverse?${params}`, {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'PrayerTimesApp/1.0',
    },
    next: { revalidate: 31536000 },
  });

  if (!response.ok) {
    throw new Error(`Geocoding API error: ${response.status}`);
  }

  const data: NominatimResult = await response.json();

  return {
    latitude,
    longitude,
    city: data.address.city || data.address.town || data.address.village || 'Unknown',
    state: data.address.state || '',
    country: data.address.country || 'Unknown',
    countryCode: data.address.country_code || '',
    locationSource: source,
    confidence: 'high',
    isApproximate: source !== 'gps',
  };
}

export async function searchCity(query: string): Promise<LocationData[]> {
  const params = new URLSearchParams({
    name: query,
    count: '10',
    language: 'en',
    format: 'json',
  });

  const response = await fetch(`${GEOCODING_BASE}/search?${params}`, {
    next: { revalidate: 31536000 },
  });

  if (!response.ok) {
    throw new Error(`City search API error: ${response.status}`);
  }

  const data = await response.json();
  const results: GeocodingResult[] = data.results || [];

  return results.map((r: GeocodingResult) => ({
    latitude: r.latitude,
    longitude: r.longitude,
    city: r.name,
    state: r.admin1 || '',
    country: r.country,
    countryCode: r.country_code,
    locationSource: 'user_selected' as LocationData['locationSource'],
    confidence: 'high' as LocationData['confidence'],
    isApproximate: false,
  }));
}
