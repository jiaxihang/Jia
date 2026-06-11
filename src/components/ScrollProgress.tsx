import { motion, useScroll, useSpring } from "framer-motion";

/**
 * 全局阅读进度条
 * 顶部一道青绿渐变细线，带星点光头，随页面滚动伸展
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] origin-left z-[60] pointer-events-none"
      style={{
        scaleX,
        background: "linear-gradient(to right, #06b6d4, #2dd4bf, #5eead4)",
        boxShadow: "0 0 8px rgba(6,182,212,0.5), 0 0 2px rgba(6,182,212,0.8)",
      }}
      aria-hidden="true"
    />
  );
}
