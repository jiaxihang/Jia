import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffects, type StarDensity } from "@/contexts/EffectsContext";

/**
 * 星空控制台
 * 右下角悬浮按钮，打开后可自定义：星空密度 / 流星 / 星座连线 / 光标星尘
 */

const DENSITY_OPTIONS: { value: StarDensity; label: string }[] = [
  { value: "low", label: "疏朗" },
  { value: "medium", label: "适中" },
  { value: "high", label: "繁星" },
];

const TOGGLE_OPTIONS: { key: "meteors" | "constellation" | "stardust"; label: string; desc: string }[] = [
  { key: "meteors", label: "流星", desc: "夜空中偶尔划过的流星" },
  { key: "constellation", label: "星座连线", desc: "光标附近的星星连成星座" },
  { key: "stardust", label: "光标星尘", desc: "鼠标移动时洒落星屑" },
];

export function EffectsPanel() {
  const { settings, updateSettings, resetSettings } = useEffects();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // 点击面板外部时收起
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={panelRef} className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="w-72 glass rounded-2xl shadow-xl shadow-cyan-900/10 dark:shadow-black/30 p-5 origin-bottom-right"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-sm text-cyan-900 dark:text-cyan-100 tracking-wider flex items-center gap-2">
                <span className="text-cyan-400">✦</span> 星空控制台
              </h3>
              <button
                onClick={resetSettings}
                className="text-xs text-slate-400 hover:text-cyan-600 dark:text-slate-500 dark:hover:text-cyan-400 transition-colors font-sans"
              >
                恢复默认
              </button>
            </div>

            {/* 密度 */}
            <div className="mb-4">
              <span className="block text-xs text-slate-500 dark:text-slate-400 font-sans mb-2 tracking-wider">
                星空密度
              </span>
              <div className="flex gap-1.5">
                {DENSITY_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => updateSettings({ density: opt.value })}
                    className={`flex-1 py-1.5 text-xs font-sans rounded-full transition-all duration-300 ${
                      settings.density === opt.value
                        ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-sm shadow-cyan-500/30"
                        : "text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-slate-800/50 border border-cyan-100/50 dark:border-slate-700/50 hover:border-cyan-300 dark:hover:border-cyan-700"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 开关项 */}
            <div className="space-y-3">
              {TOGGLE_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => updateSettings({ [opt.key]: !settings[opt.key] })}
                  className="w-full flex items-center justify-between group"
                >
                  <span className="text-left">
                    <span className="block text-xs text-slate-600 dark:text-slate-300 font-sans">
                      {opt.label}
                    </span>
                    <span className="block text-[10px] text-slate-400 dark:text-slate-500 font-sans">
                      {opt.desc}
                    </span>
                  </span>
                  <span
                    className={`relative w-9 h-5 rounded-full transition-colors duration-300 shrink-0 ${
                      settings[opt.key]
                        ? "bg-gradient-to-r from-cyan-500 to-teal-500"
                        : "bg-slate-200 dark:bg-slate-700"
                    }`}
                  >
                    <motion.span
                      className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm"
                      animate={{ left: settings[opt.key] ? "calc(100% - 18px)" : "2px" }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen((v) => !v)}
        className="w-11 h-11 rounded-full glass shadow-lg shadow-cyan-500/10 flex items-center justify-center text-cyan-600 dark:text-cyan-300 hover:text-cyan-500 dark:hover:text-cyan-200"
        whileHover={{ scale: 1.1, rotate: 30 }}
        whileTap={{ scale: 0.9 }}
        aria-label={open ? "关闭星空控制台" : "打开星空控制台"}
        aria-expanded={open}
      >
        <motion.svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          animate={{ rotate: open ? 90 : 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 16 }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 2L14 8.5L20.5 9.2L15.8 13.6L17.2 20L12 16.8L6.8 20L8.2 13.6L3.5 9.2L10 8.5L12 2Z"
          />
        </motion.svg>
      </motion.button>
    </div>
  );
}
