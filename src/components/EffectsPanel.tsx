import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffects } from "@/contexts/EffectsContext";
import { ACCENTS } from "@/config/accents";

/**
 * 主题色面板
 * Header 上的星形按钮（主题切换旁），点开选择全站主题色
 */
export function EffectsPanel() {
  const { accent, setAccent, density, setDensity } = useEffects();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // 点击外部 / Esc 收起
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="relative">
      {/* 星形按钮 */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        className={`p-2 rounded-full transition-all duration-300 relative ${
          open
            ? "text-cyan-500 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-900/40"
            : "text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-900/30"
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label={open ? "关闭主题色面板" : "打开主题色面板"}
        aria-expanded={open}
      >
        <motion.svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill={open ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth={1.5}
          animate={{ rotate: open ? 72 : 0, scale: open ? 1.05 : 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 16 }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 2L14 8.5L20.5 9.2L15.8 13.6L17.2 20L12 16.8L6.8 20L8.2 13.6L3.5 9.2L10 8.5L12 2Z"
          />
        </motion.svg>
      </motion.button>

      {/* 弹出面板 */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="absolute right-0 top-[calc(100%+12px)] glass rounded-2xl shadow-xl shadow-cyan-900/10 dark:shadow-black/30 p-4 origin-top-right"
          >
            <h3 className="font-serif text-sm text-cyan-900 dark:text-cyan-100 tracking-wider flex items-center gap-2 mb-3 whitespace-nowrap">
              <span className="text-cyan-400">✦</span> 主题色
            </h3>
            <div className="flex items-center gap-2">
              {ACCENTS.map((a) => (
                <motion.button
                  key={a.id}
                  onClick={() => setAccent(a.id)}
                  className={`relative w-7 h-7 rounded-full transition-all duration-300 ${
                    accent === a.id
                      ? "ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 scale-110"
                      : "hover:scale-110 opacity-80 hover:opacity-100"
                  }`}
                  style={{
                    background: `linear-gradient(135deg, ${a.swatch}, ${a.swatch}cc)`,
                    // @ts-expect-error CSS 变量
                    "--tw-ring-color": a.swatch,
                  }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={`主题色：${a.label}`}
                  title={a.label}
                >
                  {accent === a.id && (
                    <span className="absolute inset-0 flex items-center justify-center text-white text-[10px]">
                      ✓
                    </span>
                  )}
                </motion.button>
              ))}
            </div>

            {/* 繁星密度滑块 */}
            <div className="mt-4 flex items-center gap-3">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-sans tracking-wider shrink-0">
                繁星
              </span>
              <input
                type="range"
                min={0}
                max={100}
                value={density}
                onChange={(e) => setDensity(Number(e.target.value))}
                className="star-slider flex-1"
                style={{ "--fill": `${density}%` } as React.CSSProperties}
                aria-label="繁星密度"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
