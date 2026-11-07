import Lenis from "lenis";
import { useEffect, type ReactNode } from "react";
import { useLocation } from "react-router";
import { ScrollTrigger, gsap, prefersReducedMotion } from "~/lib/gsap";

/**
 * Scroll suave com Lenis, sincronizado ao ticker do GSAP para que
 * ScrollTrigger e Lenis usem o mesmo "relógio". Desligado quando o
 * usuário prefere movimento reduzido.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({ duration: 1.15, smoothWheel: true, anchors: { offset: -24 } });
    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, []);

  // Troca de página: volta ao topo (a âncora, quando existe, é tratada pela página).
  useEffect(() => {
    if (hash) return;
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
    else window.scrollTo(0, 0);
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, [pathname]);

  return <>{children}</>;
}
