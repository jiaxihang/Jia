import { SITE, NAV_ITEMS } from "@/config/site";

interface FooterProps {
  onNavigate: (page: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="relative py-16 px-6 bg-gradient-to-b from-transparent to-cyan-50/30">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-200/30 to-transparent" />

      <div className="max-w-4xl mx-auto text-center">
        {/* Decorative element */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-3">
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-cyan-300/50" />
            <span className="text-cyan-300 text-sm">✦</span>
            <div className="w-8 h-px bg-gradient-to-r from-cyan-300/50 to-transparent" />
          </div>
        </div>

        {/* Logo */}
        <div className="mb-4">
          <span className="font-serif text-lg text-cyan-800 dark:text-cyan-200 tracking-wider">
            {SITE.name}
          </span>
        </div>

        {/* Quote */}
        <p className="font-serif text-sm text-slate-400 dark:text-slate-500 mb-8 max-w-md mx-auto leading-relaxed">
          「文字是时间的琥珀，代码是梦想的翅膀」
        </p>

        {/* Links */}
        <div className="flex items-center justify-center gap-8 mb-8">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="text-xs text-slate-400 dark:text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors font-sans tracking-wider"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Copyright */}
        <p className="text-xs text-slate-300 dark:text-slate-600 font-sans">
          © {SITE.year} {SITE.name} · {SITE.tagline}
        </p>
      </div>
    </footer>
  );
}
