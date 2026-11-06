import { Fragment, useRef } from "react";
import { about } from "~/content/profile";
import { PIN_PRIORITY, MQ, SplitText, gsap, useGSAP } from "~/lib/gsap";
import { useIntro } from "~/lib/intro";

/** Converte "texto {destaque} texto" em nós com o acento serifado. */
function withAccents(text: string) {
  return text.split(/(\{[^}]+\})/g).map((part, i) =>
    part.startsWith("{") ? (
      <span key={i} className="accent-serif text-sky">
        {part.slice(1, -1)}
      </span>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

export function About() {
  const root = useRef<HTMLElement>(null);
  const { ready } = useIntro();

  useGSAP(
    () => {
      // Espera o Hero criar o pin dele, para que as posições do scroll
      // sejam calculadas na ordem certa da página.
      if (!ready) return;
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      // Manifesto: as palavras "acendem" conforme a rolagem.
      const litWords = (pin: boolean) => {
        const split = SplitText.create(q("[data-manifesto]"), { type: "words" });
        gsap.set(split.words, { opacity: 0.14 });
        gsap.to(split.words, {
          opacity: 1,
          ease: "none",
          stagger: 0.1,
          scrollTrigger: pin
            ? { trigger: q("[data-pin]")[0], start: "top top", end: "+=110%", pin: true, scrub: 0.6, refreshPriority: PIN_PRIORITY.about }
            : { trigger: q("[data-manifesto]")[0], start: "top 80%", end: "bottom 45%", scrub: 0.6 },
        });
        return () => split.revert();
      };

      mm.add(MQ.desktop, () => litWords(true));
      mm.add(MQ.mobile, () => litWords(false));

      // Trajetória, números e pilares entram ao aparecer na tela.
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(q("[data-label]"), {
          y: 16,
          autoAlpha: 0,
          duration: 0.9,
          stagger: 0.08,
          scrollTrigger: { trigger: q("[data-pin]")[0], start: "top 75%" },
        });
        gsap.from(q("[data-rise]"), {
          y: 48,
          autoAlpha: 0,
          duration: 1.1,
          stagger: 0.09,
          scrollTrigger: { trigger: q("[data-details]")[0], start: "top 78%" },
        });
        gsap.from(q("[data-pillar]"), {
          y: 64,
          autoAlpha: 0,
          duration: 1.2,
          stagger: 0.12,
          scrollTrigger: { trigger: q("[data-pillars]")[0], start: "top 82%" },
        });
        gsap.from(q("[data-pillar-line]"), {
          scaleX: 0,
          transformOrigin: "left",
          duration: 1.4,
          ease: "power3.inOut",
          stagger: 0.12,
          scrollTrigger: { trigger: q("[data-pillars]")[0], start: "top 82%" },
        });
      });
    },
    { dependencies: [ready], scope: root },
  );

  return (
    <section
      id="sobre"
      ref={root}
      aria-labelledby="sobre-titulo"
      className="relative border-t border-line bg-navy"
    >
      {/* Manifesto (fixado no desktop enquanto as palavras acendem) */}
      <div data-pin className="flex min-h-svh flex-col justify-center px-4 py-24 md:px-10">
        <div className="grid gap-8 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-3">
            <p data-label className="label-mono">
              <span className="text-signal-text">02</span> — Sobre
            </p>
            <h2 id="sobre-titulo" data-label className="label-mono mt-2 text-mist">
              Abordagem analítica
            </h2>
          </div>
          <p
            data-manifesto
            className="text-[length:clamp(28px,4.1vw,64px)] leading-[1.08] font-semibold tracking-[-0.025em] text-white [font-stretch:108%] md:col-span-9"
          >
            {withAccents(about.manifesto)}
          </p>
        </div>
      </div>

      {/* Trajetória e pilares */}
      <div className="px-4 pb-24 md:px-10 md:pb-36">
        <div data-details className="grid gap-12 border-t border-line pt-12 md:grid-cols-12 md:gap-10 md:pt-16">
          <div className="md:col-span-9 md:col-start-4">
            <p data-rise className="max-w-[62ch] text-lg leading-relaxed text-mist md:text-xl">
              {about.trajectory}
            </p>

            <ol data-pillars className="mt-14 grid gap-4 md:mt-20 md:grid-cols-3 md:gap-6">
              {about.pillars.map((p) => (
                <li
                  key={p.n}
                  data-pillar
                  className="group relative bg-navy-2/60 p-6 transition-colors duration-500 hover:bg-navy-2 md:p-7"
                >
                  <span data-pillar-line aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-line">
                    <span className="block h-full origin-left scale-x-0 bg-sky transition-transform duration-700 ease-[var(--ease-expo)] group-hover:scale-x-100" />
                  </span>
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-2xl font-bold text-white [font-stretch:112%] md:text-3xl">{p.title}</h3>
                    <span className="label-mono transition-colors duration-500 group-hover:text-signal-text">{p.n}</span>
                  </div>
                  <p className="mt-4 text-[15px] leading-relaxed text-fog">{p.text}</p>
                  <ul aria-label={`Ferramentas para ${p.title}`} className="mt-6 flex flex-wrap gap-x-3 gap-y-1">
                    {p.tools.map((t) => (
                      <li key={t} className="label-mono text-ice/80">
                        {t}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
