import { createContext, useContext, useEffect, useState } from "react";
import { ACCENTS, type AccentId } from "@/config/accents";

/**
 * 全局特效设置：仅主题色可调，持久化到 localStorage
 * 特效本身全量常驻（星空、流星、周期性星座连线）
 */

interface EffectsContextType {
  accent: AccentId;
  setAccent: (accent: AccentId) => void;
}

const STORAGE_KEY = "blog-effects";

const EffectsContext = createContext<EffectsContextType | null>(null);

function loadAccent(): AccentId {
  if (typeof window === "undefined") return "cyan";
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}") as { accent?: string };
    if (ACCENTS.some((a) => a.id === stored.accent)) return stored.accent as AccentId;
  } catch {
    // ignore
  }
  return "cyan";
}

export function EffectsProvider({ children }: { children: React.ReactNode }) {
  const [accent, setAccent] = useState<AccentId>(loadAccent);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ accent }));
    // 主题色通过 data-accent 让 CSS 覆盖整站色板
    document.documentElement.dataset.accent = accent;
  }, [accent]);

  return (
    <EffectsContext.Provider value={{ accent, setAccent }}>
      {children}
    </EffectsContext.Provider>
  );
}

export function useEffects() {
  const ctx = useContext(EffectsContext);
  if (!ctx) throw new Error("useEffects must be used within EffectsProvider");
  return ctx;
}
