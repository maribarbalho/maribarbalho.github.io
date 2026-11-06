import { useRef } from "react";
import { INTRO_SEEN_KEY, useIntro } from "~/lib/intro";
import { gsap, prefersReducedMotion, useGSAP } from "~/lib/gsap";

/**
 * Contador 00 → 100 e cortina que sobe revelando o Hero.
 * Aparece só na primeira visita da sessão e nunca com movimento reduzido.
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const { setReady } = useIntro();

  useGSAP(
    () => {
      const el = root.current;
      const seen = (() => {
        try {
          return sessionStorage.getItem(INTRO_SEEN_KEY) === "1";
        } catch {
          return false;
        }
      })();

      if (!el || seen || prefersReducedMotion() || getComputedStyle(el).display === "none") {
        setReady(true);
        return;
      }

      const counter = el.querySelector<HTMLElement>("[data-counter]");
      const bar = el.querySelector<HTMLElement>("[data-bar]");
      const state = { v: 0 };

      gsap
        .timeline({
          onComplete: () => {
            try {
              sessionStorage.setItem(INTRO_SEEN_KEY, "1");
            } catch {
              /* armazenamento indisponível: segue sem lembrar */
            }
            el.style.display = "none";
          },
        })
        .to(state, {
          v: 100,
          duration: 1.1,
          ease: "power2.inOut",
          onUpdate: () => {
            if (counter) counter.textContent = String(Math.round(state.v)).padStart(2, "0");
          },
        })
        .to(bar, { scaleX: 1, duration: 1.1, ease: "power2.inOut" }, 0)
        .to(el.querySelector("[data-name]"), { yPercent: -110, duration: 0.6, ease: "power3.in" }, "-=0.15")
        .to(el, { clipPath: "inset(0 0 100% 0)", duration: 1, ease: "expo.inOut" }, "-=0.2")
        .add(() => setReady(true), "-=0.55");
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="preloader fixed inset-0 z-[60] flex-col justify-between bg-abyss p-6 md:p-10"
      style={{ clipPath: "inset(0 0 0 0)" }}
    >
      <div className="flex justify-between">
        <span className="label-mono">Mariana Barbalho</span>
        <span className="label-mono">Portfólio · 2026</span>
      </div>
      <div className="flex items-end justify-between gap-6">
        <div className="overflow-hidden">
          <p data-name className="label-mono text-mist">
            Do ruído ao sinal
          </p>
        </div>
        <span
          data-counter
          className="font-display text-[clamp(64px,14vw,180px)] leading-[0.8] font-extrabold text-white tabular-nums [font-stretch:118%]"
        >
          00
        </span>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-px bg-line">
        <div data-bar className="h-full origin-left scale-x-0 bg-sky" />
      </div>
    </div>
  );
}
