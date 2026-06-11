import { NextResponse } from 'next/server';
import { reverseGeocode } from '@/lib/api/geocode';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const latitude = parseFloat(searchParams.get('latitude') || '');
  const longitude = parseFloat(searchParams.get('longitude') || '');

  if (isNaN(latitude) || isNaN(longitude) || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    return NextResponse.json(
      { error: 'Invalid coordinates.' },
      { status: 400 }
    );
  }

  try {
    const data = await reverseGeocode(latitude, longitude);

    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Geocoding API error:', error);

    return NextResponse.json(
      { error: 'Failed to determine location.' },
      { status: 502 }
    );
  }
}
