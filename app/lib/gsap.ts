import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

// Registro único dos plugins. No pré-render (Node) não há window,
// então o registro só acontece no navegador.
if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);
  gsap.defaults({ ease: "expo.out", duration: 0.9 });
}

export const EASE = {
  enter: "expo.out",
  transition: "power3.inOut",
} as const;

export const DURATION = {
  micro: 0.4,
  reveal: 0.9,
  cinematic: 1.4,
} as const;

/** Breakpoints usados com gsap.matchMedia(). */
export const MQ = {
  desktop: "(min-width: 900px) and (prefers-reduced-motion: no-preference)",
  mobile: "(max-width: 899px) and (prefers-reduced-motion: no-preference)",
  reduced: "(prefers-reduced-motion: reduce)",
} as const;

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export { gsap, ScrollTrigger, SplitText, useGSAP };
