import { createContext, useContext, useEffect, useState } from "react";

/**
 * 全局特效设置
 * 星空密度、流星、星座连线、光标星尘均可自定义，持久化到 localStorage
 */

export type StarDensity = "low" | "medium" | "high";

export interface EffectsSettings {
  density: StarDensity;
  meteors: boolean;
  constellation: boolean;
  stardust: boolean;
}

interface EffectsContextType {
  settings: EffectsSettings;
  updateSettings: (patch: Partial<EffectsSettings>) => void;
  resetSettings: () => void;
}

const DEFAULT_SETTINGS: EffectsSettings = {
  density: "medium",
  meteors: true,
  constellation: true,
  stardust: true,
};

const STORAGE_KEY = "blog-effects";

const EffectsContext = createContext<EffectsContextType | null>(null);

function loadSettings(): EffectsSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(stored) as Partial<EffectsSettings>;
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function EffectsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<EffectsSettings>(loadSettings);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (patch: Partial<EffectsSettings>) =>
    setSettings((s) => ({ ...s, ...patch }));

  const resetSettings = () => setSettings(DEFAULT_SETTINGS);

  return (
    <EffectsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </EffectsContext.Provider>
  );
}

export function useEffects() {
  const ctx = useContext(EffectsContext);
  if (!ctx) throw new Error("useEffects must be used within EffectsProvider");
  return ctx;
}
