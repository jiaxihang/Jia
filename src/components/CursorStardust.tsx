import { useEffect, useRef } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useEffects } from "@/contexts/EffectsContext";
import { getAccent } from "@/config/accents";

/**
 * 光标星尘拖尾
 * 鼠标移动时洒落细小星屑，缓缓飘散熄灭（触屏 / 减弱动效时不启用）
 */

interface Dust {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
  color: string;
  spin: number;
}

export function CursorStardust() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const { settings } = useEffects();

  const themeRef = useRef(theme);
  const accentRef = useRef(settings.accent);
  themeRef.current = theme;
  accentRef.current = settings.accent;

  const enabled =
    settings.stardust &&
    settings.mode === "high" &&
    typeof window !== "undefined" &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
    window.matchMedia("(pointer: fine)").matches;

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId = 0;
    let dusts: Dust[] = [];
    let width = 0;
    let height = 0;
    let dpr = 1;
    let lastX = -1;
    let lastY = -1;
    let running = false;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const spawn = (x: number, y: number, count: number) => {
      const accent = getAccent(accentRef.current);
      const colors = themeRef.current === "dark" ? accent.starsDark : accent.starsLight;
      for (let i = 0; i < count; i++) {
        const life = 30 + Math.random() * 35;
        dusts.push({
          x: x + (Math.random() - 0.5) * 6,
          y: y + (Math.random() - 0.5) * 6,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8 + 0.3, // 微微下落
          size: 0.6 + Math.random() * 1.6,
          life,
          maxLife: life,
          color: colors[Math.floor(Math.random() * colors.length)],
          spin: Math.random() * Math.PI,
        });
      }
      if (dusts.length > 160) dusts = dusts.slice(dusts.length - 160);
    };

    const drawStar = (x: number, y: number, r: number, rot: number, alpha: number, color: string) => {
      // 四芒星
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        const outerA = (i * Math.PI) / 2;
        const innerA = outerA + Math.PI / 4;
        ctx.lineTo(Math.cos(outerA) * r * 2, Math.sin(outerA) * r * 2);
        ctx.lineTo(Math.cos(innerA) * r * 0.6, Math.sin(innerA) * r * 0.6);
      }
      ctx.closePath();
      ctx.fillStyle = `rgba(${color},${alpha})`;
      ctx.fill();
      ctx.restore();
    };

    const loop = () => {
      ctx.clearRect(0, 0, width, height);
      dusts = dusts.filter((d) => d.life > 0);

      for (const d of dusts) {
        d.x += d.vx;
        d.y += d.vy;
        d.vx *= 0.97;
        d.vy *= 0.97;
        d.life -= 1;
        d.spin += 0.04;

        const lr = d.life / d.maxLife;
        const alpha = 0.7 * lr;

        if (d.size > 1.4) {
          drawStar(d.x, d.y, d.size * lr, d.spin, alpha, d.color);
        } else {
          ctx.beginPath();
          ctx.arc(d.x, d.y, d.size * lr, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${d.color},${alpha})`;
          ctx.fill();
        }
      }

      if (dusts.length > 0) {
        animationId = requestAnimationFrame(loop);
      } else {
        running = false;
      }
    };

    const handleMove = (e: MouseEvent) => {
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      const moved = Math.sqrt(dx * dx + dy * dy);
      // 移动越快洒得越多，但保持克制
      if (lastX < 0 || moved > 14) {
        spawn(e.clientX, e.clientY, Math.min(3, 1 + Math.floor(moved / 30)));
        lastX = e.clientX;
        lastY = e.clientY;
        if (!running) {
          running = true;
          animationId = requestAnimationFrame(loop);
        }
      }
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMove, { passive: true });

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMove);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 60 }}
      aria-hidden="true"
    />
  );
}
