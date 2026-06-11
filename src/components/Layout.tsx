import { useEffect } from "react";
import { useLocation, useNavigate, useOutlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ParticleBackground } from "@/components/ParticleBackground";
import { CursorStardust } from "@/components/CursorStardust";
import { ScrollProgress } from "@/components/ScrollProgress";
import { BackToTop } from "@/components/BackToTop";
import { NAV_ITEMS } from "@/config/site";
import { useEffects } from "@/contexts/EffectsContext";

/** 页面转场：高功效 = 模糊缩放浮动，低功耗 = 轻快淡入淡出 */
const pageVariants = {
  high: {
    initial: { opacity: 0, y: 28, scale: 0.99, filter: "blur(10px)" },
    enter: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.995,
      filter: "blur(8px)",
      transition: { duration: 0.28, ease: [0.4, 0, 1, 1] as const },
    },
  },
  low: {
    initial: { opacity: 0 },
    enter: { opacity: 1, transition: { duration: 0.25 } },
    exit: { opacity: 0, transition: { duration: 0.15 } },
  },
};

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { settings } = useEffects();
  const isHighFx = settings.mode === "high";

  const handleNavigate = (page: string) => {
    const item = NAV_ITEMS.find((n) => n.id === page);
    navigate(item?.path ?? "/");
  };

  // useOutlet 抓取当前路由元素：转场期间旧页面保持原样退场
  const outlet = useOutlet({ onNavigate: handleNavigate });

  const pathToNavId = (path: string) => {
    if (path === "/" || path === "") return "home";
    if (path.startsWith("/post")) return "blog";
    if (path.startsWith("/column")) return "columns";
    const item = NAV_ITEMS.find((n) => n.path === path);
    return item?.id ?? "home";
  };

  const activeNav = pathToNavId(location.pathname);
  const variants = isHighFx ? pageVariants.high : pageVariants.low;

  useEffect(() => {
    document.body.style.opacity = "0";
    document.body.style.transition = "opacity 0.5s ease";
    requestAnimationFrame(() => {
      document.body.style.opacity = "1";
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-cyan-50/15 to-teal-50/10 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 font-sans relative transition-colors duration-500">
      <ParticleBackground />
      <CursorStardust />
      <ScrollProgress />
      <Header currentPage={activeNav} onNavigate={handleNavigate} />

      {/* 高功效模式：换页时一道星河光束扫过 */}
      {isHighFx && (
        <motion.div
          key={`sweep-${location.pathname}`}
          className="page-sweep"
          initial={{ x: "-130%", opacity: 0 }}
          animate={{ x: "350%", opacity: [0, 1, 1, 0] }}
          transition={{ duration: 0.65, ease: "easeInOut" }}
          aria-hidden="true"
        />
      )}

      <AnimatePresence
        mode="wait"
        onExitComplete={() => window.scrollTo({ top: 0, behavior: "instant" })}
      >
        <motion.main
          key={location.pathname}
          className="relative z-10"
          variants={variants}
          initial="initial"
          animate="enter"
          exit="exit"
        >
          {outlet}
        </motion.main>
      </AnimatePresence>

      <Footer onNavigate={handleNavigate} />
      <BackToTop />
    </div>
  );
}
