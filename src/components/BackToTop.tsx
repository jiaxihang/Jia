import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * 回到顶部
 * 滚过一屏后浮现，悬浮时光环呼吸，点击平滑飞回星空之巅
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > window.innerHeight * 0.8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 16, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-24 right-6 z-50 w-11 h-11 rounded-full glass shadow-lg shadow-cyan-500/10 flex items-center justify-center text-cyan-600 dark:text-cyan-300 hover:text-cyan-500 dark:hover:text-cyan-200 group"
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.9 }}
          aria-label="回到顶部"
        >
          <motion.span
            className="absolute inset-0 rounded-full bg-cyan-400/10"
            animate={{ scale: [1, 1.35, 1], opacity: [0, 0.4, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
          <svg
            className="w-5 h-5 relative group-hover:-translate-y-0.5 transition-transform duration-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
