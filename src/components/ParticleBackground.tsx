import { useEffect, useRef } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useEffects, type StarDensity } from "@/contexts/EffectsContext";
import { getAccent } from "@/config/accents";

/**
 * 星空粒子引擎 v2
 * - 高功效：三层景深 + 视差 + 流星 + 星座连线 + 星芒光晕
 * - 低功耗：寥寥数点，优雅漂浮，几乎不耗 GPU
 * - 配色实时跟随明暗主题与主题色（无需重建场景）
 * - 渲染循环常驻：设置变化不会中断动画；标签页隐藏时暂停
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
  colorIdx: number; // 在当前配色板中的下标（绘制时实时解析颜色）
  // 每帧计算的显示坐标（含视差），星座连线复用，保证线星合一
  dx: number;
  dy: number;
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

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const { settings } = useEffects();

  const themeRef = useRef(theme);
  const settingsRef = useRef(settings);
  themeRef.current = theme;
  settingsRef.current = settings;

  const isLowPower = settings.mode === "low";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lowPower = settingsRef.current.mode === "low";

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

    const palette = () => {
      const accent = getAccent(settingsRef.current.accent);
      return themeRef.current === "dark" ? accent.starsDark : accent.starsLight;
    };

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
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        z,
        size: lowPower ? 0.3 + z * 1.0 + Math.random() * 0.3 : 0.4 + z * 1.8 + Math.random() * 0.5,
        baseAlpha: lowPower
          ? 0.12 + z * 0.3 + Math.random() * 0.1
          : 0.15 + z * 0.45 + Math.random() * 0.15,
        twinkleSpeed: (lowPower ? 0.25 : 0.4) + Math.random() * (lowPower ? 0.6 : 1.4),
        twinklePhase: Math.random() * Math.PI * 2,
        vx: (Math.random() - 0.5) * (lowPower ? 0.04 : 0.08) * (0.4 + z),
        vy: (Math.random() - 0.5) * (lowPower ? 0.04 : 0.08) * (0.4 + z),
        colorIdx: Math.floor(Math.random() * 4),
        dx: 0,
        dy: 0,
      };
    };

    const init = () => {
      resize();
      const density = settingsRef.current.density;
      let count = Math.min(
        Math.floor((width * height) / DENSITY_DIVISOR[density]),
        DENSITY_CAP[density]
      );
      // 低功耗：寥寥数点更优雅
      if (lowPower) count = Math.min(Math.floor(count / 3), 36);
      stars = Array.from({ length: count }, makeStar);
      meteors = [];
      nextMeteorAt = time + 200 + Math.random() * 400;
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
      const colors = palette();
      const isDark = themeRef.current === "dark";
      const parallax = lowPower ? 8 : 30;

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
          : (lowPower ? 0.78 : 0.65) +
            (lowPower ? 0.22 : 0.35) * Math.sin(time * 0.02 * s.twinkleSpeed + s.twinklePhase);
        const alpha = s.baseAlpha * twinkle;
        const color = colors[s.colorIdx % colors.length];

        // 显示坐标（含视差），缓存给星座连线
        s.dx = s.x - mouse.px * parallax * s.z;
        s.dy = s.y - mouse.py * parallax * s.z;

        // 高功效：近处亮星加光晕
        if (!lowPower && s.z > 0.65 && isDark) {
          ctx.beginPath();
          ctx.arc(s.dx, s.dy, s.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${color},${alpha * 0.12})`;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(s.dx, s.dy, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color},${alpha})`;
        ctx.fill();

        // 高功效：最亮的星画十字星芒
        if (!lowPower && s.z > 0.85 && twinkle > 0.9) {
          const ray = s.size * 4 * twinkle;
          ctx.strokeStyle = `rgba(${color},${alpha * 0.35})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(s.dx - ray, s.dy);
          ctx.lineTo(s.dx + ray, s.dy);
          ctx.moveTo(s.dx, s.dy - ray);
          ctx.lineTo(s.dx, s.dy + ray);
          ctx.stroke();
        }
      }
    };

    const drawConstellation = () => {
      if (lowPower || !settingsRef.current.constellation || mouse.x < -999) return;
      const accent = getAccent(settingsRef.current.accent);
      const lineColor = themeRef.current === "dark" ? accent.bright : accent.rgb;
      const radius = 170;
      const near: Star[] = [];

      // 用显示坐标（含视差）判定与连线，确保线始终贴着星
      for (const s of stars) {
        const dx = s.dx - mouse.x;
        const dy = s.dy - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < radius) {
          near.push(s);
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${lineColor},${0.16 * (1 - dist / radius)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(s.dx, s.dy);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }

      for (let i = 0; i < near.length; i++) {
        for (let j = i + 1; j < near.length; j++) {
          const dx = near[i].dx - near[j].dx;
          const dy = near[i].dy - near[j].dy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${lineColor},${0.12 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(near[i].dx, near[i].dy);
            ctx.lineTo(near[j].dx, near[j].dy);
            ctx.stroke();
          }
        }
      }
    };

    const drawMeteors = () => {
      if (lowPower || !settingsRef.current.meteors || reducedMotion) {
        meteors = [];
        return;
      }
      if (time >= nextMeteorAt) {
        spawnMeteor();
        nextMeteorAt = time + 400 + Math.random() * 900;
      }

      const accent = getAccent(settingsRef.current.accent);
      const isDark = themeRef.current === "dark";
      const head = isDark ? "235,250,255" : accent.rgb;
      const tail = isDark ? accent.bright : accent.rgb2;

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

        ctx.beginPath();
        ctx.arc(m.x, m.y, 1.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${head},${fade})`;
        ctx.fill();
      }
    };

    // 渲染循环常驻：除标签页隐藏外不停止，保证特效持续
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      if (paused) return;
      time += 1;
      ctx.clearRect(0, 0, width, height);
      drawStars();
      drawConstellation();
      drawMeteors();
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
    };

    init();
    animationId = requestAnimationFrame(animate);

    window.addEventListener("resize", init);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", init);
      window.removeEventListener("mousemove", handleMouseMove);
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
    // 仅密度/模式变化时重建场景；主题与主题色在绘制时实时解析
  }, [settings.density, settings.mode]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-700"
      style={{ opacity: theme === "dark" ? (isLowPower ? 0.6 : 0.85) : (isLowPower ? 0.4 : 0.55) }}
      aria-hidden="true"
    />
  );
}
