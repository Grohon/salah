import { NextRequest, NextResponse } from 'next/server';
import { computeConfidence, buildLocationFromIp } from '@/lib/api/ip-geolocation';
import type { IpApiResponse } from '@/lib/api/ip-geolocation';

const IP_API_BASE = 'http://ip-api.com/json';

async function fetchIpFromServer(clientIp?: string): Promise<IpApiResponse> {
  const path = clientIp ? `/${clientIp}` : '';
  const params = new URLSearchParams({
    fields: 'status,country,countryCode,region,regionName,city,lat,lon,timezone,query',
  });

  const response = await fetch(`${IP_API_BASE}${path}?${params}`, {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'PrayerTimesApp/1.0',
    },
  });

  if (!response.ok) {
    throw new Error(`IP geolocation API error: ${response.status}`);
  }

  const data: IpApiResponse = await response.json();

  if (data.status !== 'success') {
    throw new Error('IP geolocation failed to determine location');
  }

  return data;
}

export async function GET(request: NextRequest) {
  try {
    const clientIp = request.nextUrl.searchParams.get('ip') || undefined;
    const ipData = await fetchIpFromServer(clientIp);
    const { confidence } = computeConfidence(ipData);
    const location = buildLocationFromIp(ipData, confidence);

    return NextResponse.json(location, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800',
      },
    });
  } catch (error) {
    console.error('IP geolocation API error:', error);

    return NextResponse.json(
      { error: 'Failed to determine location from IP address.' },
      { status: 502 }
    );
  }
}
