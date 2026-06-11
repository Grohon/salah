import { KAABA_LATITUDE, KAABA_LONGITUDE } from './constants';

export function calculateQiblaDirection(userLat: number, userLng: number): number {
  const toRadians = (deg: number) => (deg * Math.PI) / 180;
  const toDegrees = (rad: number) => (rad * 180) / Math.PI;

  const φq = toRadians(KAABA_LATITUDE);
  const φo = toRadians(userLat);
  const ΔL = toRadians(KAABA_LONGITUDE - userLng);

  const X = Math.cos(φq) * Math.sin(ΔL);
  const Y = Math.cos(φo) * Math.sin(φq) - Math.sin(φo) * Math.cos(φq) * Math.cos(ΔL);

  let bearing = toDegrees(Math.atan2(X, Y));
  bearing = (bearing + 360) % 360;

  return bearing;
}

export function getCompassDirection(degrees: number): string {
  const directions = [
    'N', 'NNE', 'NE', 'ENE',
    'E', 'ESE', 'SE', 'SSE',
    'S', 'SSW', 'SW', 'WSW',
    'W', 'WNW', 'NW', 'NNW',
  ];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}
