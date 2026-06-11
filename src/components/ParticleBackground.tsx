import { useEffect, useRef } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useEffects } from "@/contexts/EffectsContext";
import { getAccent } from "@/config/accents";

/**
 * 星空粒子引擎
 * - 三层景深星星 + 鼠标视差，呼吸式闪烁，亮星带十字星芒
 * - 流星常驻，随机划过夜空
 * - 周期性星座连线：星空中不时有星座浮现、停留、隐去，循环不息
 * - 配色实时跟随明暗主题与主题色；标签页隐藏时暂停
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
  colorIdx: number;
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

interface Constellation {
  edges: [number, number][]; // 星下标对
  birth: number;
  life: number;
}

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const { accent, density } = useEffects();

  const themeRef = useRef(theme);
  const accentRef = useRef(accent);
  const densityRef = useRef(density);
  themeRef.current = theme;
  accentRef.current = accent;
  densityRef.current = density;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let animationId = 0;
    let stars: Star[] = [];
    let meteors: Meteor[] = [];
    let constellations: Constellation[] = [];
    let width = 0;
    let height = 0;
    let dpr = 1;
    let time = 0;
    let nextMeteorAt = 0;
    let nextConstellationAt = 0;
    let paused = false;

    const mouse = { x: -9999, y: -9999, px: 0, py: 0 };

    const palette = () => {
      const a = getAccent(accentRef.current);
      return themeRef.current === "dark" ? a.starsDark : a.starsLight;
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
        size: 0.4 + z * 1.8 + Math.random() * 0.5,
        baseAlpha: 0.15 + z * 0.45 + Math.random() * 0.15,
        twinkleSpeed: 0.4 + Math.random() * 1.4,
        twinklePhase: Math.random() * Math.PI * 2,
        vx: (Math.random() - 0.5) * 0.08 * (0.4 + z),
        vy: (Math.random() - 0.5) * 0.08 * (0.4 + z),
        colorIdx: Math.floor(Math.random() * 4),
        dx: 0,
        dy: 0,
      };
    };

    /** 繁星滑块 0~100 → 数量系数：0 寥寥数点，50 基准，100 漫天繁星 */
    const targetStarCount = () => {
      const d = densityRef.current;
      const factor = d <= 50 ? 0.2 + (d / 50) * 0.8 : 1 + ((d - 50) / 50) * 1.4;
      const base = Math.min(Math.floor((width * height) / 14000), 140);
      return Math.min(Math.round(base * factor), 320);
    };

    const init = () => {
      resize();
      stars = Array.from({ length: targetStarCount() }, makeStar);
      meteors = [];
      constellations = [];
      nextMeteorAt = time + 200 + Math.random() * 400;
      nextConstellationAt = time + 90 + Math.random() * 120;
    };

    /** 滑块变化时每帧平滑增减星星，避免整片重建的跳变 */
    const adjustStarCount = () => {
      const target = targetStarCount();
      if (stars.length < target) {
        for (let i = 0; i < Math.min(4, target - stars.length); i++) stars.push(makeStar());
      } else if (stars.length > target) {
        stars.splice(Math.max(target, stars.length - 4));
      }
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

    /**
     * 以一颗亮星为锚点，把小范围内的近邻连成一组紧凑星座
     * 贪心最近邻串联成干净折线，超跨度的边直接舍弃，避免乱划线
     */
    const spawnConstellation = () => {
      if (stars.length < 8) return;
      const candidates = stars
        .map((s, i) => ({ s, i }))
        .filter((o) => o.s.z > 0.35);
      if (candidates.length === 0) return;
      const anchor = candidates[Math.floor(Math.random() * candidates.length)];

      // 范围收紧：130px 内才算同一星座
      const near = stars
        .map((s, i) => ({ i, d: Math.hypot(s.x - anchor.s.x, s.y - anchor.s.y) }))
        .filter((o) => o.i !== anchor.i && o.d < 130)
        .sort((a, b) => a.d - b.d)
        .slice(0, 5);
      if (near.length < 3) return;

      // 与已有星座保持距离，画面不凌乱
      for (const c of constellations) {
        const other = stars[c.edges[0]?.[0]];
        if (other && Math.hypot(other.x - anchor.s.x, other.y - anchor.s.y) < 420) return;
      }

      // 贪心最近邻串联：每步连最近的未访问星，单边超 110px 就停
      const pool = [...near.map((o) => o.i)];
      const path = [anchor.i];
      while (pool.length) {
        const last = stars[path[path.length - 1]];
        let bestK = 0;
        let bestD = Infinity;
        pool.forEach((idx, k) => {
          const d = Math.hypot(stars[idx].x - last.x, stars[idx].y - last.y);
          if (d < bestD) {
            bestD = d;
            bestK = k;
          }
        });
        if (bestD > 110) break;
        path.push(pool.splice(bestK, 1)[0]);
      }
      if (path.length < 4) return;

      const edges: [number, number][] = [];
      for (let k = 0; k < path.length - 1; k++) edges.push([path[k], path[k + 1]]);
      // 首尾相近则闭合成环，更像星座图形
      const first = stars[path[0]];
      const last = stars[path[path.length - 1]];
      if (Math.hypot(first.x - last.x, first.y - last.y) < 100 && Math.random() > 0.4) {
        edges.push([path[path.length - 1], path[0]]);
      }

      constellations.push({
        edges,
        birth: time,
        life: 420 + Math.random() * 240, // 约 7~11 秒
      });
    };

    const drawStars = () => {
      const colors = palette();
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
        const color = colors[s.colorIdx % colors.length];

        s.dx = s.x - mouse.px * 30 * s.z;
        s.dy = s.y - mouse.py * 30 * s.z;

        if (s.z > 0.65 && isDark) {
          ctx.beginPath();
          ctx.arc(s.dx, s.dy, s.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${color},${alpha * 0.12})`;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(s.dx, s.dy, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color},${alpha})`;
        ctx.fill();

        if (s.z > 0.85 && twinkle > 0.9) {
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

    /** 周期性星座：呼吸灯式整组统一亮起又暗下，错峰生灭循环不息 */
    const drawConstellations = () => {
      if (constellations.length < 2 && time >= nextConstellationAt) {
        spawnConstellation();
        nextConstellationAt = time + 260 + Math.random() * 320;
      }
      constellations = constellations.filter((c) => time - c.birth < c.life);
      if (constellations.length === 0) return;

      const a = getAccent(accentRef.current);
      const lineColor = themeRef.current === "dark" ? a.bright : a.rgb;
      const baseAlpha = themeRef.current === "dark" ? 0.32 : 0.24;

      for (const c of constellations) {
        const t = Math.min(1, Math.max(0, (time - c.birth) / c.life));
        // 呼吸灯：整组随 sin 曲线缓缓亮起、缓缓暗下
        const breath = Math.sin(Math.PI * t) ** 1.4;
        const alpha = baseAlpha * breath;
        if (alpha <= 0.005) continue;

        for (const [i, j] of c.edges) {
          const s1 = stars[i];
          const s2 = stars[j];
          if (!s1 || !s2) continue;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${lineColor},${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.moveTo(s1.dx, s1.dy);
          ctx.lineTo(s2.dx, s2.dy);
          ctx.stroke();
        }

        // 节点微光（顶点去重），星座成员随呼吸略亮于背景
        const nodes = new Set(c.edges.flat());
        for (const i of nodes) {
          const s = stars[i];
          if (!s) continue;
          ctx.beginPath();
          ctx.arc(s.dx, s.dy, s.size * 1.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${lineColor},${alpha * 0.4})`;
          ctx.fill();
        }
      }
    };

    const drawMeteors = () => {
      if (reducedMotion) return;
      if (time >= nextMeteorAt) {
        spawnMeteor();
        nextMeteorAt = time + 400 + Math.random() * 900;
      }

      const a = getAccent(accentRef.current);
      const isDark = themeRef.current === "dark";
      const head = isDark ? "235,250,255" : a.rgb;
      const tail = isDark ? a.bright : a.rgb2;

      meteors = meteors.filter(
        (m) => m.life > 0 && m.x > -200 && m.x < width + 200 && m.y < height + 200
      );
      for (const m of meteors) {
        m.x += m.vx;
        m.y += m.vy;
        m.life -= 1;

        const lifeRatio = m.life / m.maxLife;
        const fade = Math.sin(Math.min(1, lifeRatio) * Math.PI);
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

    // 渲染循环常驻，仅标签页隐藏时暂停
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      if (paused) return;
      time += 1;
      ctx.clearRect(0, 0, width, height);
      adjustStarCount();
      drawStars();
      drawConstellations();
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
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-700"
      style={{ opacity: theme === "dark" ? 0.85 : 0.55 }}
      aria-hidden="true"
    />
  );
}
