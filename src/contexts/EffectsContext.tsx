import { createContext, useContext, useEffect, useState } from "react";
import { ACCENTS, type AccentId } from "@/config/accents";

/**
 * 全局特效设置：主题色 + 繁星密度（滑块 0~100），持久化到 localStorage
 * 特效本身全量常驻（星空、流星、周期性星座连线）
 */

interface EffectsContextType {
  accent: AccentId;
  setAccent: (accent: AccentId) => void;
  density: number; // 0~100，50 为基准密度
  setDensity: (density: number) => void;
}

const STORAGE_KEY = "blog-effects";
const DEFAULT_DENSITY = 50;

const EffectsContext = createContext<EffectsContextType | null>(null);

function loadStored(): { accent: AccentId; density: number } {
  const fallback = { accent: "cyan" as AccentId, density: DEFAULT_DENSITY };
  if (typeof window === "undefined") return fallback;
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}") as {
      accent?: string;
      density?: number;
    };
    return {
      accent: ACCENTS.some((a) => a.id === stored.accent)
        ? (stored.accent as AccentId)
        : fallback.accent,
      density:
        typeof stored.density === "number"
          ? Math.min(100, Math.max(0, stored.density))
          : fallback.density,
    };
  } catch {
    return fallback;
  }
}

export function EffectsProvider({ children }: { children: React.ReactNode }) {
  const initial = loadStored();
  const [accent, setAccent] = useState<AccentId>(initial.accent);
  const [density, setDensity] = useState<number>(initial.density);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ accent, density }));
    // 主题色通过 data-accent 让 CSS 覆盖整站色板
    document.documentElement.dataset.accent = accent;
  }, [accent, density]);

  return (
    <EffectsContext.Provider value={{ accent, setAccent, density, setDensity }}>
      {children}
    </EffectsContext.Provider>
  );
}

export function useEffects() {
  const ctx = useContext(EffectsContext);
  if (!ctx) throw new Error("useEffects must be used within EffectsProvider");
  return ctx;
}
