import type Lenis from "lenis";

const getLenis = () =>
  typeof window === "undefined" ? undefined : (window as unknown as { __lenis?: Lenis }).__lenis;

/** Rola até um seletor ou posição, usando o Lenis quando ativo. */
export function scrollToTarget(target: string | number, immediate = true) {
  if (typeof window === "undefined") return;
  const lenis = getLenis();
  if (typeof target === "string") {
    const el = document.querySelector<HTMLElement>(target);
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { immediate });
    else el.scrollIntoView();
    return;
  }
  if (lenis) lenis.scrollTo(target, { immediate });
  else window.scrollTo(0, target);
}
