import { useEffect, useRef } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useEffects, type StarDensity } from "@/contexts/EffectsContext";

/**
 * 星空粒子引擎
 * - 三层景深星星 + 鼠标视差
 * - 呼吸式闪烁、缓慢漂移
 * - 随机流星划过
 * - 光标附近"连星成座"
 * - 跟随明暗主题切换配色，标签页隐藏时暂停
 */

interface Star {
  x: number;
  y: number;
  z: number; // 景深 0(远)~1(近)
  size: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  vx: number;
  vy: number;
  color: string; // "r,g,b"
}

interface Meteor {
  x: number;
  y: number;
  vx: number;
  vy: number;
  len: number;
  life: number;
  maxLife: number;
}

const DENSITY_DIVISOR: Record<StarDensity, number> = {
  low: 26000,
  medium: 14000,
  high: 8000,
};

const DENSITY_CAP: Record<StarDensity, number> = {
  low: 70,
  medium: 140,
  high: 240,
};

// 明暗两套星色：暗色夜空更亮更白，浅色用青绿墨点
const DARK_COLORS = ["165,243,252", "153,246,228", "224,242,254", "94,234,212", "255,255,255"];
const LIGHT_COLORS = ["8,145,178", "13,148,136", "6,182,212", "14,116,144"];

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const { settings } = useEffects();

  const themeRef = useRef(theme);
  const settingsRef = useRef(settings);
  themeRef.current = theme;
  settingsRef.current = settings;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let animationId = 0;
    let stars: Star[] = [];
    let meteors: Meteor[] = [];
    let width = 0;
    let height = 0;
    let dpr = 1;
    let time = 0;
    let nextMeteorAt = 0;
    let paused = false;

    const mouse = { x: -9999, y: -9999, px: 0, py: 0 };

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

    const makeStar = (): Star => {
      const z = Math.random();
      const colors = themeRef.current === "dark" ? DARK_COLORS : LIGHT_COLORS;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        z,
        size: 0.4 + z * 1.8 + Math.random() * 0.5,
        baseAlpha: 0.15 + z * 0.45 + Math.random() * 0.15,
        twinkleSpeed: 0.4 + Math.random() * 1.4,
        twinklePhase: Math.random() * Math.PI * 2,
        vx: (Math.random() - 0.5) * 0.08 * (0.4 + z),
        vy: (Math.random() - 0.5) * 0.08 * (0.4 + z),
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    };

    const init = () => {
      resize();
      const density = settingsRef.current.density;
      const count = Math.min(
        Math.floor((width * height) / DENSITY_DIVISOR[density]),
        DENSITY_CAP[density]
      );
      stars = Array.from({ length: count }, makeStar);
      meteors = [];
      nextMeteorAt = time + 200 + Math.random() * 400;
    };

    const recolor = () => {
      const colors = themeRef.current === "dark" ? DARK_COLORS : LIGHT_COLORS;
      stars.forEach((s) => {
        s.color = colors[Math.floor(Math.random() * colors.length)];
      });
    };

    const spawnMeteor = () => {
      const fromLeft = Math.random() > 0.5;
      const speed = 7 + Math.random() * 6;
      const angle = (25 + Math.random() * 20) * (Math.PI / 180);
      const life = 60 + Math.random() * 40;
      meteors.push({
        x: fromLeft ? Math.random() * width * 0.5 : width * 0.4 + Math.random() * width * 0.6,
        y: -20 + Math.random() * height * 0.3,
        vx: Math.cos(angle) * speed * (fromLeft ? 1 : -1),
        vy: Math.sin(angle) * speed,
        len: 80 + Math.random() * 120,
        life,
        maxLife: life,
      });
    };

    const drawStars = () => {
      const isDark = themeRef.current === "dark";
      // 鼠标视差目标（平滑跟随）
      const targetPx = mouse.x > -999 ? (mouse.x - width / 2) / width : 0;
      const targetPy = mouse.y > -999 ? (mouse.y - height / 2) / height : 0;
      mouse.px += (targetPx - mouse.px) * 0.03;
      mouse.py += (targetPy - mouse.py) * 0.03;

      for (const s of stars) {
        s.x += s.vx;
        s.y += s.vy;
        if (s.x < -10) s.x = width + 10;
        if (s.x > width + 10) s.x = -10;
        if (s.y < -10) s.y = height + 10;
        if (s.y > height + 10) s.y = -10;

        const twinkle = reducedMotion
          ? 1
          : 0.65 + 0.35 * Math.sin(time * 0.02 * s.twinkleSpeed + s.twinklePhase);
        const alpha = s.baseAlpha * twinkle;

        const ox = -mouse.px * 30 * s.z;
        const oy = -mouse.py * 30 * s.z;
        const x = s.x + ox;
        const y = s.y + oy;

        // 近处亮星加光晕
        if (s.z > 0.65 && isDark) {
          ctx.beginPath();
          ctx.arc(x, y, s.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${s.color},${alpha * 0.12})`;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(x, y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.color},${alpha})`;
        ctx.fill();

        // 最亮的星画十字星芒
        if (s.z > 0.85 && twinkle > 0.9) {
          const ray = s.size * 4 * twinkle;
          ctx.strokeStyle = `rgba(${s.color},${alpha * 0.35})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(x - ray, y);
          ctx.lineTo(x + ray, y);
          ctx.moveTo(x, y - ray);
          ctx.lineTo(x, y + ray);
          ctx.stroke();
        }
      }
    };

    const drawConstellation = () => {
      if (!settingsRef.current.constellation || mouse.x < -999) return;
      const isDark = themeRef.current === "dark";
      const radius = 160;
      const lineColor = isDark ? "103,232,249" : "8,145,178";
      const near: Star[] = [];

      for (const s of stars) {
        const dx = s.x - mouse.x;
        const dy = s.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < radius) {
          near.push(s);
          // 星与光标之间的细线
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${lineColor},${0.14 * (1 - dist / radius)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }

      // 邻近星之间连线，形成"星座"
      for (let i = 0; i < near.length; i++) {
        for (let j = i + 1; j < near.length; j++) {
          const dx = near[i].x - near[j].x;
          const dy = near[i].y - near[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${lineColor},${0.1 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(near[i].x, near[i].y);
            ctx.lineTo(near[j].x, near[j].y);
            ctx.stroke();
          }
        }
      }
    };

    const drawMeteors = () => {
      if (!settingsRef.current.meteors || reducedMotion) {
        meteors = [];
        return;
      }
      if (time >= nextMeteorAt) {
        spawnMeteor();
        nextMeteorAt = time + 400 + Math.random() * 900;
      }

      const isDark = themeRef.current === "dark";
      const head = isDark ? "224,242,254" : "8,145,178";
      const tail = isDark ? "103,232,249" : "13,148,136";

      meteors = meteors.filter(
        (m) => m.life > 0 && m.x > -200 && m.x < width + 200 && m.y < height + 200
      );
      for (const m of meteors) {
        m.x += m.vx;
        m.y += m.vy;
        m.life -= 1;

        const lifeRatio = m.life / m.maxLife;
        const fade = Math.sin(Math.min(1, lifeRatio) * Math.PI); // 渐入渐出
        const speedNorm = Math.sqrt(m.vx * m.vx + m.vy * m.vy);
        const tx = m.x - (m.vx / speedNorm) * m.len;
        const ty = m.y - (m.vy / speedNorm) * m.len;

        const grad = ctx.createLinearGradient(m.x, m.y, tx, ty);
        grad.addColorStop(0, `rgba(${head},${0.85 * fade})`);
        grad.addColorStop(0.3, `rgba(${tail},${0.4 * fade})`);
        grad.addColorStop(1, `rgba(${tail},0)`);

        ctx.beginPath();
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.6;
        ctx.lineCap = "round";
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(tx, ty);
        ctx.stroke();

        // 流星头部光点
        ctx.beginPath();
        ctx.arc(m.x, m.y, 1.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${head},${fade})`;
        ctx.fill();
      }
    };

    const animate = () => {
      if (paused) return;
      time += 1;
      ctx.clearRect(0, 0, width, height);
      drawStars();
      drawConstellation();
      drawMeteors();
      animationId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const handleMouseLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    const handleVisibility = () => {
      paused = document.hidden;
      if (!paused) {
        cancelAnimationFrame(animationId);
        animationId = requestAnimationFrame(animate);
      }
    };

    init();
    animate();

    window.addEventListener("resize", init);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("visibilitychange", handleVisibility);

    // 主题/设置变化时由外部 effect 触发重建（见下方第二个 useEffect 的 key 机制）
    const observer = new MutationObserver(() => recolor());
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", init);
      window.removeEventListener("mousemove", handleMouseMove);
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("visibilitychange", handleVisibility);
      observer.disconnect();
    };
    // 密度变化时重建整个场景
  }, [settings.density]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-700"
      style={{ opacity: theme === "dark" ? 0.85 : 0.55 }}
      aria-hidden="true"
    />
  );
}
