'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/shared/glass-card';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { useNotifications } from '@/hooks/use-notifications';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CALCULATION_METHODS, type CalculationMethod, type NotificationPreferences, safeParseMethod, isValidCalculationMethod } from '@/lib/types';
import { STORAGE_KEYS, DEFAULT_NOTIFICATION_PREFS } from '@/lib/constants';
import { Bell, Shield, Moon, Calculator, RotateCcw } from 'lucide-react';

function loadStoredMethod(): CalculationMethod {
  if (typeof window === 'undefined') return 1;
  return safeParseMethod(localStorage.getItem(STORAGE_KEYS.CALC_METHOD), 1);
}

function loadStoredNotifs(): NotificationPreferences {
  if (typeof window === 'undefined') return DEFAULT_NOTIFICATION_PREFS;
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.NOTIFICATION_PREFS);
    if (stored) return { ...DEFAULT_NOTIFICATION_PREFS, ...JSON.parse(stored) };
  } catch {
    // ignore
  }
  return DEFAULT_NOTIFICATION_PREFS;
}

export default function SettingsPage() {
  const [method, setMethod] = useState<CalculationMethod>(loadStoredMethod);
  const [notifPrefs, setNotifPrefs] = useState<NotificationPreferences>(loadStoredNotifs);
  const { permission, requestPermission } = useNotifications();

  useEffect(() => {
    document.title = 'Settings | Salah';
  }, []);

  const handleMethodChange = (value: string | null) => {
    if (!value) return;
    const newMethod = Number(value) as CalculationMethod;
    if (!isValidCalculationMethod(newMethod)) return;
    setMethod(newMethod);
    localStorage.setItem(STORAGE_KEYS.CALC_METHOD, JSON.stringify(newMethod));
  };

  const handleNotificationToggle = async (enabled: boolean) => {
    if (enabled && permission === 'default') {
      const result = await requestPermission();
      if (result !== 'granted') return;
    }

    const updated = { ...notifPrefs, enabled };
    setNotifPrefs(updated);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATION_PREFS, JSON.stringify(updated));
  };

  const updateNotifMinutes = (prayer: keyof NotificationPreferences, value: string) => {
    const minutes = Math.max(0, Math.min(60, Number(value) || 0));
    const updated = { ...notifPrefs, [prayer]: minutes };
    setNotifPrefs(updated);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATION_PREFS, JSON.stringify(updated));
  };

  const resetToDefaults = () => {
    setMethod(1);
    setNotifPrefs(DEFAULT_NOTIFICATION_PREFS);
    localStorage.removeItem(STORAGE_KEYS.CALC_METHOD);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATION_PREFS);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 py-4 md:py-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="mt-1 text-muted-foreground">
            Customize your prayer times experience
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={resetToDefaults} className="text-muted-foreground">
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset
        </Button>
      </div>

      <GlassCard>
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
            <Calculator className="h-5 w-5 dark:text-emerald-400 text-emerald-700" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Calculation Method</h2>
            <p className="text-sm text-muted-foreground">
              Choose the method used to calculate prayer times
            </p>
          </div>
        </div>

        <Select
          value={method.toString()}
          onValueChange={handleMethodChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select calculation method">
              {CALCULATION_METHODS.find(m => m.id === method)?.name}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {CALCULATION_METHODS.map((m) => (
              <SelectItem key={m.id} value={m.id.toString()}>
                {m.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </GlassCard>

      <GlassCard>
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl dark:bg-amber-500/10 bg-amber-100">
            <Bell className="h-5 w-5 dark:text-amber-400 text-amber-700" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
            <p className="text-sm text-muted-foreground">
              Get reminded before each prayer time
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Enable notifications</span>
            </div>
            <Switch
              checked={notifPrefs.enabled}
              onCheckedChange={handleNotificationToggle}
              aria-label="Toggle prayer notifications"
            />
          </div>

          {permission === 'denied' && (
            <div className="flex items-center gap-2 rounded-lg dark:bg-amber-500/10 bg-amber-50 px-4 py-3 text-sm dark:text-amber-400 text-amber-700">
              <Shield className="h-4 w-4 shrink-0" />
              <span>
                Notifications are blocked. Please enable them in your browser settings.
              </span>
            </div>
          )}

          {notifPrefs.enabled && (
            <div className="space-y-4">
              {(['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const).map((prayer) => {
                const key = `before${prayer}` as keyof NotificationPreferences;
                return (
                  <div key={prayer} className="flex items-center justify-between">
                    <span className="text-sm">{prayer}</span>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min={0}
                        max={60}
                        value={notifPrefs[key] as number}
                        onChange={(e) => updateNotifMinutes(key, e.target.value)}
                        className="h-8 w-20 text-center text-sm"
                        aria-label={`Minutes before ${prayer}`}
                      />
                      <span className="text-xs text-muted-foreground">min before</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </GlassCard>

      <GlassCard>
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10">
            <Moon className="h-5 w-5 dark:text-purple-400 text-purple-700" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Appearance</h2>
            <p className="text-sm text-muted-foreground">
              Toggle between dark and light mode
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Moon className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Theme</span>
          </div>
          <ThemeToggle />
        </div>
      </GlassCard>
    </motion.div>
  );
}
