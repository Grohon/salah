# API Specification — Salah App

## Overview

This application uses three external APIs, proxied through Next.js API routes for caching, error handling, and response transformation. No API keys are required for any of the chosen services.

---

## 1. Prayer Times API (Aladhan)

### Base URL
```
https://api.aladhan.com/v1
```

### Endpoints

#### GET /timings/{date}
Get prayer times for a specific date. Called via the proxy route `/api/prayer-times`.

**Parameters:**
| Param | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `date` | string (DD-MM-YYYY) | ✅ | — | Date for prayer times |
| `latitude` | float | ✅ | — | Latitude |
| `longitude` | float | ✅ | — | Longitude |
| `method` | int | ❌ | 1 | Calculation method (Karachi default) |
| `school` | int | ❌ | 1 | School: 0=Shafi, 1=Hanafi |

**Calculation Methods:**
| ID | Method |
|----|--------|
| 0 | Shia Ithna-Ansari |
| 1 | University of Islamic Sciences, Karachi |
| 2 | Islamic Society of North America (ISNA) |
| 3 | Muslim World League |
| 4 | Umm Al-Qura University, Makkah |
| 5 | Egyptian General Authority of Survey |
| 7 | Institute of Geophysics, University of Tehran |
| 8 | Gulf Region |
| 9 | Kuwait |
| 10 | Qatar |
| 11 | Majlis Ugama Islam Singapura, Singapore |
| 12 | Union Organization Islamic de France |
| 13 | Diyanet İşleri Başkanlığı, Turkey |
| 14 | Spiritual Administration of Muslims of Russia |

**Response (transformed):**
```typescript
interface PrayerTimesData {
  timings: Record<PrayerKey, string>;  // fajr, sunrise, dhuhr, asr, maghrib, isha (Tahajjud client-side)
  hijri: HijriDate;
  gregorian: GregorianDate;
  timezone: string;
  dateTimestamp: string;
}
```

Tahajjud is NOT fetched from the API. It is computed client-side as the last third of the night (maghrib to next sunrise).

### Proxy Route

```
GET /api/prayer-times?latitude={lat}&longitude={lng}&method={method}&date={date}
```

- Validates coordinates (range checks) and calculation method
- Forwards to Aladhan API with `school=1` (Hanafi)
- Sets `Cache-Control: public, s-maxage=86400, stale-while-revalidate=43200`
- Returns 6 timings only (fajr, sunrise, dhuhr, asr, maghrib, isha)

### Caching Strategy
- Server-side: 24-hour CDN cache (prayer times are fixed per date/location)
- Client-side: localStorage fallback with no TTL (overwritten on next successful fetch)

---

## 2. Weather API (Open-Meteo)

### Base URL
```
https://api.open-meteo.com/v1
```

### Proxy Route

```
GET /api/weather?latitude={lat}&longitude={lng}
```

**Response:**
```typescript
interface WeatherData {
  temperature: number;
  weatherCode: number;      // WMO weather code
  windSpeed: number;
  sunrise: string;
  sunset: string;
}
```

### Caching Strategy
- Server-side: 30-minute CDN cache
- Client-side: fetched on mount from proxy

---

## 3. Geocoding API (Nominatim / Open-Meteo)

### 3a. Reverse Geocoding (Coordinates → City)
Uses Nominatim (OpenStreetMap), proxied through `/api/geocode/reverse`.

### 3b. City Search (City → Coordinates)
Uses Open-Meteo Geocoding API, proxied through `/api/geocode/search`.

### 3c. IP Geolocation
Uses ip-api.com, proxied through `/api/geocode/ip`.

**Usage Policy:**
- Nominatim: Max 1 request per second, requires User-Agent header
- Open-Meteo: Free, no restrictions
- ip-api.com: Free for non-commercial, HTTP only

### Caching Strategy
- Reverse geocoding: Immutable (coordinates map to same city forever)
- City search: Immutable (city names map to same coordinates)
- IP geolocation: 1 hour

---

## 4. Qibla Direction (Calculation)

No external API needed. Great Circle formula implemented in `src/lib/qibla.ts`.

**Implemented functions:**
- `calculateQiblaDirection(userLat, userLng)` → bearing in degrees
- `getCompassDirection(degrees)` → 16-point compass string (N, NNE, NE, etc.)

---

## 5. Notification API (Browser)

### Permissions
```typescript
Notification.requestPermission()
  → 'granted' | 'denied' | 'default'
```

### Preferences (localStorage)
```typescript
interface NotificationPreferences {
  enabled: boolean;
  beforeFajr: number;     // minutes before
  beforeDhuhr: number;
  beforeAsr: number;
  beforeMaghrib: number;
  beforeIsha: number;
}
```

---

## 6. Error Handling

### Server-Side (API Routes)
- Input validation returns 400 with descriptive message
- Upstream failures return 502 with generic error message
- Error details logged server-side via `console.error`

### Client-Side
- Empty catch blocks silently discard corrupted cache
- Prayer times: fall back to cached data on fetch failure with error banner
- Weather: shows "Weather unavailable" on error
- Location: retry buttons + city search fallback on GPS failure

---

## 7. API Route Implementation

All API routes are `GET` only (no state mutation):

```
GET /api/prayer-times?latitude=...&longitude=...&method=...&date=...
GET /api/weather?latitude=...&longitude=...
GET /api/geocode/reverse?lat=...&lon=...
GET /api/geocode/search?q=...
GET /api/geocode/ip
```

All API routes:
1. Validate input parameters
2. Cache responses with appropriate Cache-Control headers
3. Return consistent error format
4. Log errors server-side for monitoring
