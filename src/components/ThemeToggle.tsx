import { useRef, useState, useEffect, useCallback } from "react";
import { flushSync } from "react-dom";
import { motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import { useEffects } from "@/contexts/EffectsContext";
import { getAccent } from "@/config/accents";

declare global {
    interface Document {
        startViewTransition(
            callback: () => void | Promise<void>
        ): ViewTransition;
    }
}

interface ViewTransition {
    ready: Promise<void>;
    finished: Promise<void>;
    updateCallbackDone: Promise<void>;
}

/* ═══════════════════════════════════════════
   涟漪粒子 Canvas
   ═══════════════════════════════════════════ */

interface Particle {
    x: number;
    y: number;
    size: number;
    opacity: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
}

interface Ring {
    radius: number;
    maxRadius: number;
    baseOpacity: number;
    speed: number;
    lineWidth: number;
    started: boolean;
}

const LEAD_SPEED = 18;

function calcMaxRadius(x: number, y: number) {
    const w = window.innerWidth;
    const h = window.innerHeight;
    return (
        Math.sqrt(
            Math.max(
                x * x + y * y,
                (w - x) ** 2 + y * y,
                x * x + (h - y) ** 2,
                (w - x) ** 2 + (h - y) ** 2
            )
        ) * 1.12
    );
}

function calcDuration(maxR: number) {
    return maxR / (LEAD_SPEED * 60);
}

interface RippleOptions {
    color: string; // "r,g,b"
    rings: number;
    particles: boolean;
}

function useRippleCanvas(
    active: boolean,
    ox: number,
    oy: number,
    options: RippleOptions,
    onRadiusUpdate?: (r: number) => void
) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const ringsRef = useRef<Ring[]>([]);
    const particlesRef = useRef<Particle[]>([]);
    const frameRef = useRef(0);
    const lastSpawnR = useRef(0);
    const optionsRef = useRef(options);
    optionsRef.current = options;

    const spawnOnRing = useCallback(
        (cx: number, cy: number, r: number, count: number) => {
            for (let i = 0; i < count; i++) {
                const a = Math.random() * Math.PI * 2;
                const spread = (Math.random() - 0.5) * 24;
                const spd = 0.2 + Math.random() * 1.0;
                const life = 50 + Math.random() * 70;
                particlesRef.current.push({
                    x: cx + Math.cos(a) * (r + spread),
                    y: cy + Math.sin(a) * (r + spread),
                    size: Math.random() * 2 + 0.5,
                    opacity: 0.35 + Math.random() * 0.45,
                    vx: Math.cos(a) * spd + (Math.random() - 0.5) * 0.4,
                    vy: Math.sin(a) * spd + (Math.random() - 0.5) * 0.4,
                    life,
                    maxLife: life,
                });
            }
        },
        []
    );

    useEffect(() => {
        if (!active) {
            ringsRef.current = [];
            particlesRef.current = [];
            lastSpawnR.current = 0;
            if (frameRef.current) cancelAnimationFrame(frameRef.current);
            return;
        }

        const cvs = canvasRef.current;
        if (!cvs) return;
        const ctx = cvs.getContext("2d");
        if (!ctx) return;

        cvs.width = window.innerWidth;
        cvs.height = window.innerHeight;

        const maxR = calcMaxRadius(ox, oy);
        const { color, rings, particles } = optionsRef.current;

        ringsRef.current = Array.from({ length: rings }, (_, i) => ({
            radius: 0,
            maxRadius: maxR,
            baseOpacity: 0.5 - i * 0.06,
            speed: LEAD_SPEED - i * 1.5,
            lineWidth: 2 - i * 0.2,
            started: i === 0,
        }));
        lastSpawnR.current = 0;

        const loop = () => {
            ctx.clearRect(0, 0, cvs.width, cvs.height);
            let leadR = 0;
            let allRingsDone = true;

            ringsRef.current.forEach((ring, idx) => {
                if (!ring.started) {
                    const prev = ringsRef.current[idx - 1];
                    if (prev && prev.radius > 40 + idx * 15) ring.started = true;
                    else return;
                }

                if (ring.radius < ring.maxRadius) {
                    allRingsDone = false;
                    ring.radius += ring.speed;
                }
                if (idx === 0) leadR = ring.radius;

                const progress = ring.radius / ring.maxRadius;
                const fadeStart = 0.7;
                const alpha =
                    progress < fadeStart
                        ? ring.baseOpacity
                        : ring.baseOpacity *
                        Math.max(0, 1 - (progress - fadeStart) / (1 - fadeStart));
                if (alpha < 0.003) return;

                ctx.beginPath();
                ctx.arc(ox, oy, ring.radius, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(${color},${alpha})`;
                ctx.lineWidth = ring.lineWidth;
                ctx.stroke();

                ctx.beginPath();
                ctx.arc(ox, oy, Math.max(0, ring.radius - 5), 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(${color},${alpha * 0.3})`;
                ctx.lineWidth = ring.lineWidth * 3;
                ctx.stroke();

                ctx.beginPath();
                ctx.arc(ox, oy, ring.radius + 4, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(${color},${alpha * 0.15})`;
                ctx.lineWidth = ring.lineWidth * 5;
                ctx.stroke();
            });

            onRadiusUpdate?.(leadR);

            if (
                particles &&
                leadR > 0 &&
                leadR < maxR &&
                leadR - lastSpawnR.current > 25
            ) {
                spawnOnRing(ox, oy, leadR, 6 + Math.floor(Math.random() * 10));
                lastSpawnR.current = leadR;
            }

            particlesRef.current = particlesRef.current.filter((p) => p.life > 0);
            particlesRef.current.forEach((p) => {
                p.x += p.vx;
                p.y += p.vy;
                p.vx *= 0.985;
                p.vy *= 0.985;
                p.life -= 1;
                const lr = p.life / p.maxLife;
                const a = p.opacity * lr;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${color},${a})`;
                ctx.fill();

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${color},${a * 0.12})`;
                ctx.fill();
            });

            const vis = particlesRef.current.filter(
                (p) => p.life / p.maxLife > 0.25
            );
            for (let i = 0; i < vis.length; i++) {
                for (let j = i + 1; j < vis.length; j++) {
                    const dx = vis[i].x - vis[j].x;
                    const dy = vis[i].y - vis[j].y;
                    const d = Math.sqrt(dx * dx + dy * dy);
                    if (d < 70) {
                        const la =
                            0.1 *
                            (1 - d / 70) *
                            Math.min(
                                vis[i].life / vis[i].maxLife,
                                vis[j].life / vis[j].maxLife
                            );
                        ctx.beginPath();
                        ctx.moveTo(vis[i].x, vis[i].y);
                        ctx.lineTo(vis[j].x, vis[j].y);
                        ctx.strokeStyle = `rgba(${color},${la})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }

            if (!allRingsDone || particlesRef.current.length > 0) {
                frameRef.current = requestAnimationFrame(loop);
            }
        };

        frameRef.current = requestAnimationFrame(loop);
        return () => {
            if (frameRef.current) cancelAnimationFrame(frameRef.current);
        };
    }, [active, ox, oy, onRadiusUpdate, spawnOnRing]);

    return canvasRef;
}

/* ═══════════════════════════════════════════
   水纹位移滤镜
   高功效模式下，View Transition 的新画面经过
   feDisplacementMap 扭曲——文字与版面随涟漪波动，
   随涟漪推向尽头时扭曲幅度归零，水面归于平静
   ═══════════════════════════════════════════ */

function useWaterRipple() {
    const turbulenceRef = useRef<SVGFETurbulenceElement>(null);
    const displacementRef = useRef<SVGFEDisplacementMapElement>(null);
    const rafRef = useRef(0);

    const run = useCallback((durationMs: number) => {
        const turb = turbulenceRef.current;
        const disp = displacementRef.current;
        if (!turb || !disp) return;

        document.documentElement.classList.add("vt-water");

        const start = performance.now();
        const maxScale = 32;

        const tick = (now: number) => {
            const t = Math.min(1, (now - start) / durationMs);
            // easeOutCubic：开始波动剧烈，推向尽头渐归平静
            const ease = 1 - Math.pow(1 - t, 3);
            const scale = maxScale * (1 - ease);
            disp.setAttribute("scale", scale.toFixed(2));
            // 噪声频率微漂移，让水纹"流动"
            const bf = 0.012 + 0.006 * Math.sin(t * Math.PI * 3);
            turb.setAttribute("baseFrequency", `${bf.toFixed(4)} ${(bf * 1.6).toFixed(4)}`);

            if (t < 1) {
                rafRef.current = requestAnimationFrame(tick);
            } else {
                // 只归零位移，不移除 vt-water：转场进行中换 animation-name
                // 会让涟漪动画从 0% 重播（表现为"切换走了两次"）。
                // 类名由 transition.finished 后的 cancel() 统一清理。
                disp.setAttribute("scale", "0");
            }
        };
        rafRef.current = requestAnimationFrame(tick);
    }, []);

    const cancel = useCallback(() => {
        cancelAnimationFrame(rafRef.current);
        displacementRef.current?.setAttribute("scale", "0");
        document.documentElement.classList.remove("vt-water");
    }, []);

    useEffect(() => cancel, [cancel]);

    const filterSvg = (
        <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
            <filter id="theme-water" x="-5%" y="-5%" width="110%" height="110%">
                <feTurbulence
                    ref={turbulenceRef}
                    type="fractalNoise"
                    baseFrequency="0.012 0.019"
                    numOctaves="2"
                    seed="7"
                    result="noise"
                />
                <feDisplacementMap
                    ref={displacementRef}
                    in="SourceGraphic"
                    in2="noise"
                    scale="0"
                    xChannelSelector="R"
                    yChannelSelector="G"
                />
            </filter>
        </svg>
    );

    return { filterSvg, run, cancel };
}

/* ═══════════════════════════════════════════
   ThemeToggle
   ═══════════════════════════════════════════ */

interface RevealState {
    active: boolean;
    x: number;
    y: number;
    oldTheme: "light" | "dark";
}

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    const { settings } = useEffects();
    const btnRef = useRef<HTMLButtonElement>(null);

    const accent = getAccent(settings.accent);
    const isHighFx = settings.mode === "high";
    const rippleColor = theme === "dark" ? accent.bright : accent.rgb;

    const [reveal, setReveal] = useState<RevealState>({
        active: false,
        x: 0,
        y: 0,
        oldTheme: "light",
    });
    const [maskR, setMaskR] = useState(0);

    // 控制 Canvas 淡出，防止颜色突变
    const [canvasFading, setCanvasFading] = useState(false);

    const { filterSvg, run: runWater, cancel: cancelWater } = useWaterRipple();

    const handleRadiusUpdate = useCallback((r: number) => setMaskR(r), []);

    const canvasRef = useRippleCanvas(
        reveal.active,
        reveal.x,
        reveal.y,
        {
            color: rippleColor,
            rings: isHighFx ? 5 : 2,
            particles: isHighFx,
        },
        handleRadiusUpdate
    );

    const cleanUp = useCallback(() => {
        setCanvasFading(true);
        setTimeout(() => {
            setReveal((s) => ({ ...s, active: false }));
            setMaskR(0);
            setCanvasFading(false);
        }, 700);
    }, []);

    const handleClick = () => {
        const btn = btnRef.current;
        if (!btn || reveal.active) return;

        const rect = btn.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        const oldTheme = theme;
        const maxR = calcMaxRadius(x, y);
        const duration = calcDuration(maxR);

        const supportsVT = "startViewTransition" in document;
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (supportsVT) {
            const root = document.documentElement;
            root.style.setProperty("--vt-rx", `${x}px`);
            root.style.setProperty("--vt-ry", `${y}px`);
            root.style.setProperty("--vt-max-r", `${maxR}px`);
            root.style.setProperty("--vt-duration", `${duration}s`);

            // 高功效：水纹位移；低功耗：轻量光晕
            if (isHighFx && !reducedMotion) {
                runWater(duration * 1000 * 0.85);
            } else {
                root.classList.add("vt-lite");
            }

            setReveal({ active: true, x, y, oldTheme });
            setCanvasFading(false);

            const transition = document.startViewTransition!(() => {
                flushSync(() => {
                    toggleTheme();
                });
            });

            transition.finished.then(() => {
                cancelWater();
                root.classList.remove("vt-lite");
                cleanUp();
            });
        } else {
            setReveal({ active: true, x, y, oldTheme });
            setCanvasFading(false);
            requestAnimationFrame(() => toggleTheme());
        }
    };

    // 降级方案：涟漪走完后清理
    useEffect(() => {
        if (!reveal.active || canvasFading) return;
        if ("startViewTransition" in document) return;

        const maxR = calcMaxRadius(reveal.x, reveal.y);
        if (maskR >= maxR && maxR > 0) {
            cleanUp();
        }
    }, [maskR, reveal, canvasFading, cleanUp]);

    const oldBg = reveal.oldTheme === "dark" ? "#0f172a" : "#f8fafc";
    const showFallback =
        reveal.active && !("startViewTransition" in document);

    return (
        <>
            {filterSvg}

            {showFallback && (
                <div
                    className="fixed inset-0 pointer-events-none"
                    style={{
                        zIndex: 9998,
                        backgroundColor: oldBg,
                        opacity: canvasFading ? 0 : 1,
                        transition: "opacity 0.7s ease-out",
                        maskImage: `radial-gradient(circle at ${reveal.x}px ${reveal.y}px, transparent 0px, transparent ${Math.max(0, maskR - 30)}px, rgba(0,0,0,0.4) ${maskR}px, black ${maskR + 8}px)`,
                        WebkitMaskImage: `radial-gradient(circle at ${reveal.x}px ${reveal.y}px, transparent 0px, transparent ${Math.max(0, maskR - 30)}px, rgba(0,0,0,0.4) ${maskR}px, black ${maskR + 8}px)`,
                    }}
                />
            )}

            {/* Canvas：opacity transition 淡出，避免突然消失 */}
            {reveal.active && (
                <canvas
                    ref={canvasRef}
                    className="fixed inset-0 pointer-events-none"
                    style={{
                        zIndex: 2147483647,
                        width: "100%",
                        height: "100%",
                        opacity: canvasFading ? 0 : 1,
                        transition: "opacity 0.7s ease-out",
                    }}
                />
            )}

            <motion.button
                ref={btnRef}
                onClick={handleClick}
                className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-900/30 transition-all duration-300 relative overflow-hidden"
                aria-label={
                    theme === "dark" ? "切换至浅色模式" : "切换至深色模式"
                }
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                disabled={reveal.active}
            >
                {reveal.active && (
                    <>
                        <motion.div
                            className="absolute inset-0 rounded-full bg-cyan-400/20"
                            initial={{ scale: 1, opacity: 0.6 }}
                            animate={{ scale: 2.5, opacity: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                        />
                        <motion.div
                            className="absolute inset-0 rounded-full bg-cyan-400/15"
                            initial={{ scale: 1, opacity: 0.4 }}
                            animate={{ scale: 3.5, opacity: 0 }}
                            transition={{ duration: 0.9, ease: "easeOut", delay: 0.08 }}
                        />
                    </>
                )}

                {!reveal.active && isHighFx && (
                    <motion.div
                        className="absolute inset-0 rounded-full bg-cyan-400/10 dark:bg-cyan-500/5"
                        animate={{ scale: [1, 1.2, 1], opacity: [0, 0.3, 0] }}
                        transition={{ duration: 2.5, repeat: Infinity }}
                    />
                )}

                <motion.div
                    initial={false}
                    animate={{ rotate: theme === "dark" ? 0 : 180 }}
                    transition={{
                        duration: 0.6,
                        type: "spring",
                        stiffness: 180,
                        damping: 12,
                    }}
                    className="relative"
                >
                    {theme === "dark" ? (
                        <motion.svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                            />
                        </motion.svg>
                    ) : (
                        <motion.svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                            />
                        </motion.svg>
                    )}
                </motion.div>
            </motion.button>
        </>
    );
}
