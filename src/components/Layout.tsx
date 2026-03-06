import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ParticleBackground } from "@/components/ParticleBackground";
import { NAV_ITEMS } from "@/config/site";

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const pathToNavId = (path: string) => {
    if (path === "/" || path === "") return "home";
    if (path.startsWith("/post")) return "blog";
    if (path.startsWith("/column")) return "columns";
    const item = NAV_ITEMS.find((n) => n.path === path);
    return item?.id ?? "home";
  };

  const activeNav = pathToNavId(location.pathname);

  const handleNavigate = (page: string) => {
    setIsTransitioning(true);
    const item = NAV_ITEMS.find((n) => n.id === page);
    const path = item?.path ?? "/";
    setTimeout(() => {
      navigate(path);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => setIsTransitioning(false), 100);
    }, 300);
  };

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
      <Header currentPage={activeNav} onNavigate={handleNavigate} />

      <main
        className={`relative z-10 transition-all duration-300 ${
          isTransitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
        }`}
      >
        <Outlet context={{ onNavigate: handleNavigate }} />
      </main>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
