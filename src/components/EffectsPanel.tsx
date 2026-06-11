import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffects, type StarDensity, type EffectsMode } from "@/contexts/EffectsContext";
import { ACCENTS } from "@/config/accents";

/**
 * 星空控制台
 * Header 上的星形按钮（主题切换旁），点开调整：
 * 高功效/低功耗模式、主题色、星空密度、流星/星座连线/光标星尘
 */

const MODE_OPTIONS: { value: EffectsMode; label: string; desc: string; icon: string }[] = [
  { value: "high", label: "高功效", desc: "全特效 · 更绚丽", icon: "✨" },
  { value: "low", label: "低功耗", desc: "点到为止 · 更省电", icon: "🍃" },
];

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
  const wrapRef = useRef<HTMLDivElement>(null);

  const isLowPower = settings.mode === "low";

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
        aria-label={open ? "关闭星空控制台" : "打开星空控制台"}
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
            className="absolute right-0 top-[calc(100%+12px)] w-72 glass rounded-2xl shadow-xl shadow-cyan-900/10 dark:shadow-black/30 p-5 origin-top-right"
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

            {/* 模式 */}
            <div className="mb-4">
              <span className="block text-xs text-slate-500 dark:text-slate-400 font-sans mb-2 tracking-wider">
                特效模式
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {MODE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => updateSettings({ mode: opt.value })}
                    className={`py-2 px-2 rounded-xl text-left transition-all duration-300 border ${
                      settings.mode === opt.value
                        ? "bg-gradient-to-br from-cyan-500/15 to-teal-500/10 border-cyan-400/50 dark:border-cyan-500/50"
                        : "border-cyan-100/50 dark:border-slate-700/50 bg-white/40 dark:bg-slate-800/40 hover:border-cyan-300 dark:hover:border-cyan-700"
                    }`}
                  >
                    <span className="block text-xs font-sans font-medium text-slate-700 dark:text-slate-200">
                      {opt.icon} {opt.label}
                    </span>
                    <span className="block text-[10px] text-slate-400 dark:text-slate-500 font-sans mt-0.5">
                      {opt.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 主题色 */}
            <div className="mb-4">
              <span className="block text-xs text-slate-500 dark:text-slate-400 font-sans mb-2 tracking-wider">
                主题色
              </span>
              <div className="flex items-center gap-2">
                {ACCENTS.map((a) => (
                  <motion.button
                    key={a.id}
                    onClick={() => updateSettings({ accent: a.id })}
                    className={`relative w-7 h-7 rounded-full transition-all duration-300 ${
                      settings.accent === a.id
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
                    {settings.accent === a.id && (
                      <span className="absolute inset-0 flex items-center justify-center text-white text-[10px]">
                        ✓
                      </span>
                    )}
                  </motion.button>
                ))}
              </div>
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

            {/* 开关项（低功耗下停用） */}
            <div className={`space-y-3 transition-opacity duration-300 ${isLowPower ? "opacity-40" : ""}`}>
              {TOGGLE_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => updateSettings({ [opt.key]: !settings[opt.key] })}
                  disabled={isLowPower}
                  className="w-full flex items-center justify-between group disabled:cursor-not-allowed"
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
                      settings[opt.key] && !isLowPower
                        ? "bg-gradient-to-r from-cyan-500 to-teal-500"
                        : "bg-slate-200 dark:bg-slate-700"
                    }`}
                  >
                    <motion.span
                      className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm"
                      animate={{
                        left: settings[opt.key] && !isLowPower ? "calc(100% - 18px)" : "2px",
                      }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  </span>
                </button>
              ))}
              {isLowPower && (
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-sans pt-1">
                  低功耗模式下已停用动态特效
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
