import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Direction = 'en-es' | 'es-en';

export type Settings = {
  direction: Direction;
  haptics: boolean;
  autoPlayAudio: boolean;
  onboarded: boolean;
};

const DEFAULTS: Settings = {
  direction: 'en-es',
  haptics: true,
  autoPlayAudio: true,
  onboarded: false,
};

const KEY = 'spanish-cards:settings:v1';

type Ctx = {
  settings: Settings;
  /** True once settings have loaded from storage. */
  ready: boolean;
  update: (patch: Partial<Settings>) => void;
};

const SettingsContext = createContext<Ctx>({
  settings: DEFAULTS,
  ready: false,
  update: () => {},
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(KEY)
      .then((raw) => {
        if (active && raw) setSettings({ ...DEFAULTS, ...JSON.parse(raw) });
      })
      .catch(() => {})
      .finally(() => active && setReady(true));
    return () => {
      active = false;
    };
  }, []);

  const update = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const value = useMemo(() => ({ settings, ready, update }), [settings, ready, update]);
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  return useContext(SettingsContext);
}
