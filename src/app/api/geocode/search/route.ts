import { NextResponse } from 'next/server';
import { searchCity } from '@/lib/api/geocode';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const query = searchParams.get('q') || '';

  if (!query || query.length < 2) {
    return NextResponse.json(
      { error: 'Search query must be at least 2 characters.' },
      { status: 400 }
    );
  }

  try {
    const data = await searchCity(query);

    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('City search API error:', error);

    return NextResponse.json(
      { error: 'Failed to search for cities.' },
      { status: 502 }
    );
  }
}
