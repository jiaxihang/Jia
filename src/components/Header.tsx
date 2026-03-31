import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { NAV_ITEMS, SITE } from "@/config/site";
import { ThemeToggle } from "./ThemeToggle";

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Header({ currentPage, onNavigate }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
        ? "glass shadow-lg shadow-cyan-900/5 dark:shadow-black/20 py-3"
        : "bg-transparent py-5"
        }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => onNavigate("home")}
          className="flex items-center gap-3 group"
        >
          <div className="relative w-9 h-9">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400 to-teal-500 opacity-20 group-hover:opacity-40 transition-opacity duration-500 blur-sm" />
            <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center shadow-md shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all duration-500 group-hover:scale-110">
              <span className="text-white text-sm font-serif font-bold">J</span>
            </div>
          </div>
          <span className="font-serif text-lg text-cyan-900 dark:text-cyan-100 tracking-wider group-hover:text-cyan-700 dark:group-hover:text-cyan-300 transition-colors duration-300">
            {SITE.name}
          </span>
        </button>

        {/* Desktop Nav + Theme Toggle */}
        <div className="hidden md:flex items-center gap-2">
          <nav className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`relative px-5 py-2 text-sm tracking-wide transition-all duration-300 rounded-full ${currentPage === item.id
                  ? "text-cyan-700 dark:text-cyan-300 font-medium"
                  : "text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400"
                  }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
              >
                {currentPage === item.id && (
                  <span className="absolute inset-0 bg-cyan-50 dark:bg-cyan-900/40 rounded-full animate-scale-in" />
                )}
                <span className="relative">{item.label}</span>
              </motion.button>
            ))}
          </nav>
          <ThemeToggle />
        </div>

        {/* Mobile: theme toggle + menu button */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="relative w-8 h-8 flex flex-col items-center justify-center gap-1.5"
            aria-label={menuOpen ? "关闭菜单" : "打开菜单"}
          >
            <span
              className={`w-5 h-0.5 bg-cyan-700 dark:bg-cyan-400 transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-1" : ""
                }`}
            />
            <span
              className={`w-5 h-0.5 bg-cyan-700 dark:bg-cyan-400 transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-1" : ""
                }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-500 overflow-hidden bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border-t border-cyan-100/30 dark:border-slate-700/30 ${menuOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <div className="px-6 py-4 space-y-1">
          {NAV_ITEMS.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setMenuOpen(false);
              }}
              className={`block w-full text-left px-4 py-3 rounded-xl text-sm transition-all duration-300 ${currentPage === item.id
                ? "text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-900/40 font-medium"
                : "text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-50/50 dark:hover:bg-cyan-900/20"
                }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
            >
              {item.label}
            </motion.button>
          ))}
        </div>
      </div>
    </header>
  );
}
