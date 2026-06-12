import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), geolocation=(self), microphone=(), notifications=(self)' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob:",
              "font-src 'self' data:",
              "connect-src 'self' https://api.aladhan.com http://ip-api.com https://nominatim.openstreetmap.org https://geocoding-api.open-meteo.com https://api.open-meteo.com https://api.ipify.org",
              "frame-ancestors 'none'",
              "base-uri 'self'",
            ].join('; ')
          },
        ],
      },
    ];
  },
};

export default nextConfig;
module.exports = {
  allowedDevOrigins: ['192.168.0.152'],
}