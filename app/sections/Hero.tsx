import { useRef } from "react";
import portrait from "~/assets/mariana-retrato.jpg";
import { SignalField } from "~/components/SignalField";
import { profile } from "~/content/profile";
import { PIN_PRIORITY, MQ, ScrollTrigger, SplitText, gsap, useGSAP } from "~/lib/gsap";
import { useIntro } from "~/lib/intro";

/** Uma volta da faixa: grupos com rótulo e chips. */
function StackRow({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center gap-2 pr-2">
      {profile.stack.map(({ group, items }) => (
        <li key={group} className="flex items-center gap-2">
          <span className="label-mono pl-3 text-signal-text">{group}</span>
          <ul className="flex items-center gap-2">
            {items.map((s) => (
              <li
                key={s}
                className="label-mono rounded-full border border-line bg-navy/60 px-3 py-1.5 whitespace-nowrap text-ice backdrop-blur-sm"
              >
                {s}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}

/**
 * Ferramentas e competências em faixa contínua (pausa ao passar o mouse).
 * Com movimento reduzido, vira uma lista estática com quebra de linha.
 */
function StackTicker() {
  return (
    <div aria-label="Ferramentas e competências" role="region">
      <div className="group relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)] motion-reduce:hidden">
        <div className="flex w-max animate-[ticker_48s_linear_infinite] group-hover:[animation-play-state:paused]">
          <StackRow />
          <StackRow hidden />
        </div>
      </div>
      <div className="hidden flex-wrap gap-2 motion-reduce:flex">
        {profile.stack.flatMap(({ items }) => items).map((s) => (
          <span key={s} className="label-mono rounded-full border border-line px-3 py-1.5 text-ice">
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const intro = useRef(0);
  const { ready } = useIntro();

  useGSAP(
    () => {
      if (!ready) return;
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      // ---------- Movimento reduzido: estado final, sem animação ----------
      mm.add(MQ.reduced, () => {
        progress.current = 0.85;
        intro.current = 1;
      });

      // ---------- Entrada cinematográfica (desktop e mobile) ----------
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // No mobile, resumo e ferramentas já aparecem prontos (melhora o LCP);
        // a entrada animada deles fica só no desktop.
        const desktop = window.matchMedia("(min-width: 900px)").matches;
        const split = desktop
          ? SplitText.create(q("[data-summary]"), { type: "lines", mask: "lines", aria: "none" })
          : null;

        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        if (desktop && split) {
          tl.set(q("[data-intro-desktop]"), { autoAlpha: 1 })
            .from(split.lines, { yPercent: 100, duration: 1.1, stagger: 0.07 }, 0.65)
            .from(q("[data-chip]"), { y: 12, autoAlpha: 0, duration: 1 }, 0.9);
        }
        tl.set(q("[data-intro]"), { autoAlpha: 1 })
          .to(intro, { current: 1, duration: 2, ease: "power2.out" }, 0)
          .from(q("[data-name-line]"), { yPercent: 115, duration: 1.4, stagger: 0.1 }, 0.05)
          .fromTo(
            q("[data-photo]"),
            { clipPath: "inset(100% 0% 0% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "expo.inOut" },
            0.1,
          )
          .from(q("[data-photo-img]"), { scale: 1.35, duration: 1.8 }, 0.1)
          .from(q("[data-meta]"), { y: 16, autoAlpha: 0, duration: 1, stagger: 0.06 }, 0.5)
          .from(q("[data-cue-line]"), { scaleY: 0, transformOrigin: "top", duration: 1 }, 1.1)
          // Devolve o texto ao fluxo natural para que ele quebre certo ao redimensionar.
          .add(() => split?.revert());

        return () => split?.revert();
      });

      // ---------- Desktop: pin + ruído → sinal + parallax + cursor ----------
      mm.add(MQ.desktop, () => {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: "+=75%",
              pin: true,
              refreshPriority: PIN_PRIORITY.hero,
              scrub: 0.8,
            },
            defaults: { ease: "none" },
          })
          .to(progress, { current: 1 }, 0)
          .to(q("[data-photo]"), { yPercent: -10 }, 0)
          .to(q("[data-photo-img]"), { scale: 1.08 }, 0)
          .to(q("[data-name-row='1']"), { xPercent: -4 }, 0)
          .to(q("[data-name-row='2']"), { xPercent: 5 }, 0)
          .to(q("[data-fade-on-scroll]"), { autoAlpha: 0, y: -40, stagger: 0.04 }, 0);

        // Foto responde discretamente ao cursor.
        const photo = q("[data-photo-wrap]")[0];
        const xTo = gsap.quickTo(photo, "x", { duration: 1.2, ease: "power3.out" });
        const yTo = gsap.quickTo(photo, "y", { duration: 1.2, ease: "power3.out" });
        const onMove = (e: PointerEvent) => {
          xTo((e.clientX / window.innerWidth - 0.5) * 18);
          yTo((e.clientY / window.innerHeight - 0.5) * 14);
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        return () => window.removeEventListener("pointermove", onMove);
      });

      // ---------- Mobile: sem pin, sinal se forma ao rolar o Hero ----------
      mm.add(MQ.mobile, () => {
        gsap
          .timeline({
            scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 0.6 },
            defaults: { ease: "none" },
          })
          .to(progress, { current: 1 }, 0)
          .to(q("[data-photo]"), { yPercent: -8 }, 0);
      });

      ScrollTrigger.refresh();
    },
    { dependencies: [ready], scope: root },
  );

  return (
    <section
      id="topo"
      ref={root}
      aria-labelledby="hero-title"
      className="relative isolate h-svh min-h-[640px] overflow-hidden bg-abyss"
    >
      {/* Brilho azul ao fundo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_520px_at_82%_8%,rgba(37,99,235,0.2),transparent_65%),radial-gradient(700px_400px_at_10%_100%,rgba(139,92,246,0.08),transparent_70%)]"
      />
      <SignalField progress={progress} intro={intro} className="absolute inset-0 size-full" />

      <div className="relative z-10 flex h-full flex-col px-4 pt-20 pb-6 md:block md:px-10 md:pt-0 md:pb-0">
        {/* Linha de metadados */}
        <div
          data-intro
          data-fade-on-scroll
          className="flex items-start justify-between gap-4 md:absolute md:inset-x-10 md:top-[108px]"
        >
          <p data-meta className="label-mono text-mist">
            {profile.role}
            <span className="text-fog"> · </span>
            <br className="md:hidden" />
            {profile.area}
          </p>
          <p data-meta className="label-mono hidden text-right md:block">
            {profile.location}
          </p>
        </div>

        {/* Resumo */}
        <div
          data-fade-on-scroll
          className="order-3 mt-6 max-w-[34rem] md:absolute md:top-[21svh] md:left-10 md:mt-0 md:max-w-[30rem] lg:max-w-[34rem]"
        >
          <p className="text-[clamp(26px,3vw,44px)] leading-[1.02] font-semibold tracking-[-0.02em] text-white [font-stretch:108%]">
            Dados que viram <span className="accent-serif text-sky">decisão</span>.
          </p>
          <p data-intro-desktop data-summary className="mt-5 text-[15px] leading-relaxed text-mist md:text-base">
            {profile.summary}
          </p>
          <div data-intro-desktop data-chip className="mt-6">
            <StackTicker />
          </div>
        </div>

        {/* Retrato */}
        <div
          data-photo-wrap
          className="order-1 mt-8 w-[40vw] max-w-[200px] self-end md:absolute md:top-[38svh] md:right-[9vw] md:mt-0 md:w-[clamp(170px,min(16vw,32svh),250px)] md:max-w-none"
        >
          <p data-intro data-meta className="label-mono mb-3 hidden md:block">
            Fig. 01 <span className="text-signal-text">—</span> Retrato
          </p>
          <figure data-intro data-photo className="relative aspect-[4/5] overflow-hidden bg-navy-2">
            <img
              data-photo-img
              src={portrait}
              alt="Retrato de Mariana Barbalho"
              width={720}
              height={900}
              fetchPriority="high"
              decoding="async"
              className="size-full object-cover opacity-80 [filter:brightness(0.82)_contrast(0.92)]"
            />
            {/* Véu azul-marinho: integra a foto ao fundo e reduz o destaque */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-abyss/70 via-navy/25 to-transparent" />
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 ring-1 ring-white/5 ring-inset" />
          </figure>
        </div>

        {/* Nome oversized */}
        <h1
          id="hero-title"
          data-intro
          className="order-2 -mt-[9vw] text-white mix-blend-difference md:absolute md:inset-x-10 md:bottom-[9svh] md:mt-0"
        >
          <span className="sr-only">
            {profile.name}, {profile.role}
          </span>
          <span
            aria-hidden="true"
            className="block text-[length:clamp(64px,min(15.5vw,21svh),280px)] leading-[0.84] font-extrabold tracking-[-0.045em] [font-stretch:120%]"
          >
            <span data-name-row="1" className="block overflow-hidden pb-[0.04em]">
              <span data-name-line className="block">
                {profile.firstName}
              </span>
            </span>
            <span data-name-row="2" className="block overflow-hidden pb-[0.04em] md:pl-[14vw]">
              <span data-name-line className="block">
                {profile.lastName}
              </span>
            </span>
          </span>
        </h1>

        {/* Indicação de rolagem */}
        <div
          data-intro
          data-fade-on-scroll
          className="order-4 mt-auto flex items-end justify-between pt-6 md:absolute md:inset-x-10 md:bottom-6 md:pt-0"
        >
          <span data-meta className="label-mono">
            Portfólio <span className="text-signal-text">·</span> 2026
          </span>
          <a href="#sobre" data-meta className="label-mono flex items-center gap-3 text-mist hover:text-white">
            Role para explorar
            <span aria-hidden="true" className="relative block h-8 w-px overflow-hidden bg-line">
              <span data-cue-line className="absolute inset-0 block bg-sky motion-safe:animate-[cue_2.4s_ease-in-out_infinite]" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
