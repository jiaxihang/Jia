import { useState, useEffect } from "react";
import { SITE } from "@/config/site";

interface HeroProps {
  onNavigate: (page: string) => void;
}

export function Hero({ onNavigate }: HeroProps) {
  const [typedText, setTypedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
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

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-200/18 rounded-full blur-3xl animate-gentle-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-200/12 rounded-full blur-3xl animate-gentle-pulse" style={{ animationDelay: "2s" }} />
      <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-cyan-300/8 rounded-full blur-2xl animate-float" />

      {/* Decorative circle outlines */}
      <svg className="absolute top-32 right-20 w-32 h-32 opacity-10" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="none" stroke="#06b6d4" strokeWidth="0.5" strokeDasharray="4 4" />
      </svg>
      <svg className="absolute bottom-40 left-20 w-24 h-24 opacity-10" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="none" stroke="#0d9488" strokeWidth="0.5" />
      </svg>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
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
    </section>
  );
}
