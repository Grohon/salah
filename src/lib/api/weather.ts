import type { WeatherData } from '../types';

const OPEN_METEO_BASE = 'https://api.open-meteo.com/v1';

export async function fetchWeather(
  latitude: number,
  longitude: number
): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: 'temperature_2m,weather_code,wind_speed_10m',
    daily: 'sunrise,sunset',
    timezone: 'auto',
    forecast_days: '1',
  });

  const response = await fetch(`${OPEN_METEO_BASE}/forecast?${params}`, {
    next: { revalidate: 1800 },
  });

  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status}`);
  }

  const data = await response.json();

  return {
    temperature: data.current.temperature_2m,
    weatherCode: data.current.weather_code,
    windSpeed: data.current.wind_speed_10m,
    sunrise: data.daily.sunrise[0],
    sunset: data.daily.sunset[0],
  };
}

export function getWeatherDescription(code: number): string {
  if (code === 0) return 'Clear sky';
  if (code <= 3) return 'Partly cloudy';
  if (code <= 48) return 'Foggy';
  if (code <= 55) return 'Drizzle';
  if (code <= 65) return 'Rain';
  if (code <= 77) return 'Snow';
  if (code <= 82) return 'Rain showers';
  return 'Thunderstorm';
}

export function getWeatherIcon(code: number): string {
  if (code === 0) return 'sun';
  if (code <= 3) return 'cloud-sun';
  if (code <= 48) return 'cloud-fog';
  if (code <= 55) return 'cloud-drizzle';
  if (code <= 65) return 'cloud-rain';
  if (code <= 77) return 'cloud-snow';
  if (code <= 82) return 'cloud-rain';
  return 'cloud-lightning';
}
