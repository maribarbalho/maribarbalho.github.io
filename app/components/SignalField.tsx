import { useEffect, useRef, type RefObject } from "react";
import { prefersReducedMotion } from "~/lib/gsap";

type Props = {
  /** 0 = ruído (pontos dispersos) · 1 = sinal (pontos formam uma linha de tendência). */
  progress: RefObject<number>;
  /** 0 → 1 durante a entrada do Hero (fade-in dos pontos). */
  intro: RefObject<number>;
  className?: string;
};

type Point = {
  nx: number; // posição de "ruído" (0..1)
  ny: number;
  t: number; // posição ao longo da linha (0..1)
  jitter: number; // espessura da linha
  seed: number;
  size: number;
  hot: boolean; // ponto de destaque quando o sinal se forma
  x: number;
  y: number;
};

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** Curva de tendência: crescimento com sazonalidade, desenhada como um gráfico. */
function signalY(t: number, h: number) {
  const trend = 0.8 - 0.46 * (t * t * (3 - 2 * t));
  const season = Math.sin(t * Math.PI * 6) * 0.028 * (0.4 + t);
  return (trend + season) * h;
}

/**
 * Campo de pontos em canvas 2D. Representa o conceito "Sinal":
 * dados dispersos que se organizam conforme a rolagem avança.
 * Reage discretamente ao cursor e pausa fora da tela.
 */
export function SignalField({ progress, intro, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = prefersReducedMotion();
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    let w = 0;
    let h = 0;
    let points: Point[] = [];
    let raf = 0;
    let visible = true;
    const mouse = { x: -9999, y: -9999 };

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = w < 700 ? 240 : Math.min(760, Math.round(w * 0.5));
      points = Array.from({ length: count }, (_, i) => {
        const p: Point = {
          nx: Math.random(),
          ny: Math.random(),
          t: i / (count - 1),
          jitter: (Math.random() - 0.5) * 2,
          seed: Math.random() * Math.PI * 2,
          size: Math.random() < 0.08 ? 2.2 : Math.random() * 1.1 + 0.7,
          hot: Math.random() < 0.035,
          x: 0,
          y: 0,
        };
        p.x = p.nx * w;
        p.y = p.ny * h;
        return p;
      });
    };

    const draw = (time: number) => {
      const k = easeInOut(Math.min(1, Math.max(0, progress.current ?? 0)));
      const alpha = Math.min(1, Math.max(0, intro.current ?? 1));
      const sec = reduced ? 0 : time / 1000;
      ctx.clearRect(0, 0, w, h);

      // Eixos aparecem à medida que o sinal se forma.
      if (k > 0.02) {
        ctx.globalAlpha = k * 0.5 * alpha;
        ctx.strokeStyle = "#1A2A42";
        ctx.lineWidth = 1;
        ctx.beginPath();
        const left = w * 0.06;
        const base = h * 0.84;
        ctx.moveTo(left, h * 0.24);
        ctx.lineTo(left, base);
        ctx.lineTo(left + (w * 0.88) * k, base);
        for (let i = 1; i <= 4; i++) {
          const gy = base - (h * 0.6 * i) / 4;
          ctx.moveTo(left, gy);
          ctx.lineTo(left + 6, gy);
        }
        ctx.stroke();
      }

      for (const p of points) {
        // Posição de ruído: deriva lenta e orgânica.
        const driftX = Math.sin(sec * 0.25 + p.seed) * 14;
        const driftY = Math.cos(sec * 0.2 + p.seed * 1.3) * 14;
        const noiseX = p.nx * w + driftX;
        const noiseY = p.ny * h + driftY;

        // Posição de sinal: sobre a curva de tendência.
        const sx = w * 0.06 + p.t * w * 0.88;
        const sy = signalY(p.t, h) + p.jitter * (1 - k) * 18 + p.jitter * 2.5;

        let tx = noiseX + (sx - noiseX) * k;
        let ty = noiseY + (sy - noiseY) * k;

        // Repulsão suave do cursor.
        if (!coarse && !reduced) {
          const dx = tx - mouse.x;
          const dy = ty - mouse.y;
          const d = Math.hypot(dx, dy);
          if (d < 130) {
            const f = ((130 - d) / 130) * 34;
            tx += (dx / (d || 1)) * f;
            ty += (dy / (d || 1)) * f;
          }
        }

        p.x += (tx - p.x) * (reduced ? 1 : 0.09);
        p.y += (ty - p.y) * (reduced ? 1 : 0.09);

        const hot = p.hot && k > 0.6;
        ctx.globalAlpha = alpha * (hot ? 1 : 0.35 + k * 0.35);
        ctx.fillStyle = hot ? "#8B5CF6" : k > 0.5 && p.size > 2 ? "#60A5FA" : "#94A3B8";
        const s = hot ? 3 : p.size;
        ctx.fillRect(p.x - s / 2, p.y - s / 2, s, s);
      }
      ctx.globalAlpha = 1;

      if (!reduced && visible) raf = requestAnimationFrame(draw);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => {
      mouse.x = mouse.y = -9999;
    };

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        build();
        if (reduced) start();
      }, 150);
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !reduced) start();
      else cancelAnimationFrame(raf);
    });

    build();
    io.observe(canvas);
    start();
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [progress, intro]);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}
