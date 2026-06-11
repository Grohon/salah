import type { Metadata, Viewport } from 'next';
import { Inter, Noto_Naskh_Arabic } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/layout/theme-provider';
import { Header } from '@/components/layout/header';
import { MobileNav } from '@/components/layout/mobile-nav';
import { Footer } from '@/components/layout/footer';
import { BackgroundParticles } from '@/components/shared/background-particles';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const notoNaskhArabic = Noto_Naskh_Arabic({
  subsets: ['arabic'],
  display: 'swap',
  variable: '--font-arabic',
  weight: ['400', '600', '700'],
});

export const metadata: Metadata = {
  title: {
    template: '%s | Salah',
    default: 'Salah — Prayer Times, Qibla & Islamic Calendar',
  },
  description:
    'Prayer Times, Qibla & Islamic Calendar — Accurate salah times based on your location with Qibla direction and Hijri calendar.',
  keywords: [
    'salah',
    'prayer times',
    'bangladesh',
    'islamic prayer',
    'fajr',
    'dhuhr',
    'asr',
    'maghrib',
    'isha',
    'qibla',
    'hijri calendar',
    'muslim',
    'islam',
  ],
  authors: [{ name: 'Salah' }],
  creator: 'Salah',
  publisher: 'Salah',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Salah',
    title: 'Salah — Prayer Times, Qibla & Islamic Calendar',
    description:
      'Prayer Times, Qibla & Islamic Calendar — Accurate salah times based on your location.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Salah — Prayer Times, Qibla & Islamic Calendar',
    description:
      'Prayer Times, Qibla & Islamic Calendar — Accurate salah times based on your location.',
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/icons/icon.svg',
    apple: '/icons/icon.svg',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Salah',
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0a0e1a' },
    { media: '(prefers-color-scheme: light)', color: '#faf8f3' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${inter.variable} ${notoNaskhArabic.variable} dark`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider>
          <BackgroundParticles />
          <Header />
          <main className="relative z-10 mx-auto max-w-7xl px-4 pb-24 pt-6 md:px-6 md:pb-8">
            {children}
          </main>
          <Footer />
          <MobileNav />
        </ThemeProvider>
      </body>
    </html>
  );
}
