import { NextResponse } from 'next/server';
import { fetchPrayerTimes } from '@/lib/api/prayer-times';
import { isValidCalculationMethod } from '@/lib/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const latitude = parseFloat(searchParams.get('latitude') || '');
  const longitude = parseFloat(searchParams.get('longitude') || '');
  const method = parseInt(searchParams.get('method') || '1', 10);
  const dateParam = searchParams.get('date') || undefined;

  if (isNaN(latitude) || isNaN(longitude)) {
    return NextResponse.json(
      { error: 'Invalid coordinates. Provide latitude and longitude as numbers.' },
      { status: 400 }
    );
  }

  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    return NextResponse.json(
      { error: 'Coordinates out of range.' },
      { status: 400 }
    );
  }

  if (!isValidCalculationMethod(method)) {
    return NextResponse.json(
      { error: 'Invalid calculation method.' },
      { status: 400 }
    );
  }

  const date = dateParam ? parseDate(dateParam) : undefined;

  try {
    const data = await fetchPrayerTimes(latitude, longitude, method, date);

    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
      },
    });
  } catch (error) {
    console.error('Prayer times API error:', error);

    return NextResponse.json(
      { error: 'Failed to fetch prayer times. Please try again later.' },
      { status: 502 }
    );
  }
}

function parseDate(dateStr: string): Date {
  const [day, month, year] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}
