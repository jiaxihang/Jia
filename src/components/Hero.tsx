import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { SITE } from "@/config/site";

interface HeroProps {
  onNavigate: (page: string) => void;
}

export function Hero({ onNavigate }: HeroProps) {
  const [typedText, setTypedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLElement>(null);
  const fullText = SITE.tagline;

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 100);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);
    return () => clearInterval(cursorTimer);
  }, []);

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const heroTop = rect.top + scrollTop;
        const relativeScroll = scrollTop - heroTop;

        // Only apply parallax when hero is in viewport
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          setScrollY(relativeScroll);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Seamless background transition gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-cyan-50/20 dark:to-slate-900/30 pointer-events-none" />

      {/* Aurora 极光层 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div
          className="aurora-band absolute -top-1/4 left-[-10%] w-[70%] h-[60%]"
          style={{ transform: `translateY(${scrollY * 0.15}px)` }}
        />
        <div
          className="aurora-band aurora-band-alt absolute top-[-15%] right-[-15%] w-[65%] h-[55%]"
          style={{ transform: `translateY(${scrollY * 0.1}px)`, animationDelay: "-6s" }}
        />
      </div>

      {/* 星光点缀 */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {[
          { top: "18%", left: "16%", size: "text-base", delay: "0s" },
          { top: "26%", left: "78%", size: "text-xs", delay: "1.2s" },
          { top: "62%", left: "12%", size: "text-sm", delay: "2.1s" },
          { top: "70%", left: "84%", size: "text-base", delay: "0.6s" },
          { top: "40%", left: "90%", size: "text-[10px]", delay: "1.8s" },
          { top: "82%", left: "30%", size: "text-xs", delay: "2.6s" },
        ].map((star, i) => (
          <span
            key={i}
            className={`star-glint absolute ${star.size} text-cyan-400/60 dark:text-cyan-300/70 select-none`}
            style={{ top: star.top, left: star.left, animationDelay: star.delay }}
          >
            ✦
          </span>
        ))}
      </div>

      {/* Decorative elements with parallax */}
      <div
        className="absolute top-20 left-10 w-72 h-72 bg-cyan-200/18 rounded-full blur-3xl animate-gentle-pulse"
        style={{ transform: `translateY(${scrollY * 0.3}px)` }}
      />
      <div
        className="absolute bottom-40 right-10 w-82 h-70 bg-teal-200/12 rounded-full blur-3xl animate-gentle-pulse"
        style={{ transform: `translateY(${scrollY * 0.2}px)`, animationDelay: "2s" }}
      />
      <div
        className="absolute top-1/3 right-1/4 w-48 h-48 bg-cyan-300/8 rounded-full blur-2xl animate-float"
        style={{ transform: `translateY(${scrollY * 0.4}px)` }}
      />

      {/* Decorative circle outlines with parallax */}
      <svg
        className="absolute top-32 right-20 w-32 h-32 opacity-10"
        viewBox="0 0 100 100"
        style={{ transform: `translateY(${scrollY * 0.25}px)` }}
      >
        <circle cx="50" cy="50" r="45" fill="none" stroke="#06b6d4" strokeWidth="0.5" strokeDasharray="4 4" />
      </svg>
      <svg
        className="absolute bottom-40 left-20 w-24 h-24 opacity-10"
        viewBox="0 0 100 100"
        style={{ transform: `translateY(${scrollY * 0.35}px)` }}
      >
        <circle cx="50" cy="50" r="45" fill="none" stroke="#0d9488" strokeWidth="0.5" />
      </svg>

      <div
        className="relative z-10 text-center px-6 max-w-4xl mx-auto"
        style={{ transform: `translateY(${scrollY * -0.1}px)` }}
      >
        {/* Main Title */}
        <div className="mb-4 animate-fade-in-down">
          <span className="inline-block text-sm tracking-[0.3em] text-cyan-600/70 dark:text-cyan-400/70 font-sans uppercase">
            Personal Blog
          </span>
        </div>

        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-gradient mb-8 animate-fade-in-up leading-tight">
          {SITE.name}
        </h1>

        <div className="w-16 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto mb-8 animate-fade-in" />

        {/* Typing effect subtitle */}
        <div className="h-10 flex items-center justify-center mb-10">
          <p className="font-serif text-lg md:text-xl text-slate-500 dark:text-slate-400 tracking-wider">
            {typedText}
            <span
              className={`inline-block w-0.5 h-5 bg-cyan-500 ml-1 align-middle transition-opacity duration-100 ${showCursor ? "opacity-100" : "opacity-0"
                }`}
            />
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: "0.8s", opacity: 0 }}>
          <button
            onClick={() => onNavigate("blog")}
            className="group relative px-8 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-full font-sans text-sm tracking-wider shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-500 hover:scale-105 overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="relative flex items-center gap-2">
              阅读文章
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </button>
          <button
            onClick={() => onNavigate("about")}
            className="px-8 py-3 text-cyan-700 border border-cyan-200 rounded-full font-sans text-sm tracking-wider hover:bg-cyan-50 hover:border-cyan-300 transition-all duration-500 hover:scale-105"
          >
            了解更多
          </button>
        </div>
      </div>

      {/* 下滑指示 */}
      <motion.button
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-cyan-500/60 dark:text-cyan-400/60 hover:text-cyan-500 dark:hover:text-cyan-300 transition-colors duration-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        aria-label="向下滚动"
      >
        <span className="text-[10px] tracking-[0.3em] font-sans uppercase">Scroll</span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.span>
      </motion.button>
    </section>
  );
}
