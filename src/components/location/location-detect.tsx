'use client';

import { Loader2, MapPin, RefreshCw, Wifi } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CitySearch } from './city-search';
import type { LocationData } from '@/lib/types';

interface LocationDetectProps {
  loading: boolean;
  error: string | null;
  onDetect: () => void;
  onSelect: (location: LocationData) => void;
  onFallbackToIp?: () => void;
}

export function LocationDetect({ loading, error, onDetect, onSelect, onFallbackToIp }: LocationDetectProps) {
  return (
    <div className="space-y-4">
      {loading && (
        <div className="flex items-center justify-center gap-3 rounded-2xl border border-border bg-muted/50 px-6 py-8 text-center">
          <Loader2 className="h-5 w-5 animate-spin dark:text-emerald-400 text-emerald-700" />
          <p className="text-muted-foreground">Detecting your location...</p>
        </div>
      )}

      {error && !loading && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 px-6 py-4 text-center">
            <MapPin className="mx-auto mb-2 h-6 w-6 dark:text-amber-400 text-amber-700" />
            <p className="text-sm text-muted-foreground">{error}</p>

            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onDetect}
                className="dark:text-emerald-400 text-emerald-700 hover:dark:text-emerald-300 hover:text-emerald-600"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try GPS Again
              </Button>

              {onFallbackToIp && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onFallbackToIp}
                  className="dark:text-amber-400 text-amber-700 hover:text-amber-300"
                >
                  <Wifi className="mr-2 h-4 w-4" />
                  Use Approximate
                </Button>
              )}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-3 text-xs text-muted-foreground">
                or search for your city
              </span>
            </div>
          </div>

          <CitySearch onSelect={onSelect} />
        </div>
      )}
    </div>
  );
}
