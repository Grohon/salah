import { NextResponse } from 'next/server';
import { fetchWeather } from '@/lib/api/weather';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const latitude = parseFloat(searchParams.get('latitude') || '');
  const longitude = parseFloat(searchParams.get('longitude') || '');

  if (isNaN(latitude) || isNaN(longitude)) {
    return NextResponse.json(
      { error: 'Invalid coordinates.' },
      { status: 400 }
    );
  }

  try {
    const data = await fetchWeather(latitude, longitude);

    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=900',
      },
    });
  } catch (error) {
    console.error('Weather API error:', error);

    return NextResponse.json(
      { error: 'Failed to fetch weather data.' },
      { status: 502 }
    );
  }
}
