import { useRef, type FocusEvent } from "react";
import { Link } from "react-router";
import { ProjectCover } from "~/components/ProjectCover";
import { projects } from "~/content/projects";
import { PIN_PRIORITY, MQ, ScrollTrigger, gsap, useGSAP } from "~/lib/gsap";
import { useIntro } from "~/lib/intro";
import { scrollToTarget } from "~/lib/scroll";

const pad = (n: number) => String(n).padStart(2, "0");

export function Projects() {
  const root = useRef<HTMLElement>(null);
  const trigger = useRef<ScrollTrigger | null>(null);
  const { ready } = useIntro();

  useGSAP(
    () => {
      if (!ready) return;
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      // Desktop: a seção fica fixa e os cards correm na horizontal.
      mm.add(MQ.desktop, () => {
        const track = q("[data-track]")[0] as HTMLElement;
        const counter = q("[data-counter]")[0] as HTMLElement;
        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);

        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: q("[data-pin]")[0],
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            refreshPriority: PIN_PRIORITY.projects,
            scrub: 0.8,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              gsap.set(q("[data-progress]"), { scaleX: self.progress });
              const i = Math.min(projects.length, Math.floor(self.progress * projects.length) + 1);
              if (counter) counter.textContent = pad(i);
            },
          },
        });
        trigger.current = tween.scrollTrigger ?? null;

        // Parallax interno das capturas enquanto o trilho se move.
        q("[data-card]").forEach((card) => {
          const img = card.querySelector("[data-parallax]");
          if (!img) return;
          gsap.fromTo(
            img,
            { xPercent: -5 },
            {
              xPercent: 5,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                containerAnimation: tween,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            },
          );
        });

        return () => {
          trigger.current = null;
        };
      });

      // Entrada do título e dos cards.
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(q("[data-head]"), {
          y: 40,
          autoAlpha: 0,
          duration: 1.1,
          stagger: 0.08,
          scrollTrigger: { trigger: root.current, start: "top 70%" },
        });
        gsap.from(q("[data-card]"), {
          y: 70,
          autoAlpha: 0,
          duration: 1.2,
          stagger: 0.1,
          scrollTrigger: { trigger: root.current, start: "top 55%" },
        });
      });
    },
    { dependencies: [ready], scope: root },
  );

  // Teclado: ao focar um card fora da tela, rola até ele dentro do trilho.
  const onCardFocus = (e: FocusEvent<HTMLElement>) => {
    const st = trigger.current;
    if (!st) return;
    const li = e.currentTarget.closest("li");
    const track = li?.parentElement;
    if (!li || !track) return;
    const max = Math.max(1, track.scrollWidth - window.innerWidth);
    const ratio = Math.min(1, Math.max(0, (li.offsetLeft - 80) / max));
    scrollToTarget(st.start + ratio * (st.end - st.start));
  };

  return (
    <section id="projetos" ref={root} aria-labelledby="projetos-titulo" className="relative border-t border-line bg-abyss">
      <div data-pin className="relative flex flex-col overflow-hidden py-24 md:h-svh md:justify-center md:py-0">
        {/* Cabeçalho */}
        <div className="flex flex-col gap-6 px-4 md:mb-10 md:flex-row md:items-end md:justify-between md:px-10">
          <div>
            <p data-head className="label-mono">
              <span className="text-signal-text">03</span> — Projetos
            </p>
            <h2
              id="projetos-titulo"
              data-head
              className="mt-4 text-[length:clamp(40px,6.4vw,104px)] leading-[0.9] font-extrabold tracking-[-0.035em] text-white [font-stretch:118%]"
            >
              Projetos <span className="accent-serif font-normal text-sky">em destaque</span>
            </h2>
          </div>
          <div data-head className="max-w-sm md:text-right">
            <p className="text-fog">
              Estudos de caso em BI e Analytics: o problema, os dados, o método e o que os números mostram.
            </p>
            <p className="label-mono mt-4 hidden md:block" aria-hidden="true">
              <span data-counter className="text-white">01</span> / {pad(projects.length)}
            </p>
          </div>
        </div>

        {/* Trilho de cards */}
        <ol
          data-track
          className="mt-12 flex flex-col gap-14 px-4 md:mt-0 md:w-max md:flex-row md:gap-8 md:pr-[12vw] md:pl-10"
        >
          {projects.map((p, i) => (
            <li key={p.slug} data-card className="md:w-[clamp(360px,38vw,600px)]">
              <Link
                to={`/projetos/${p.slug}`}
                viewTransition
                onFocus={onCardFocus}
                className="group block focus-visible:outline-offset-8"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <div data-parallax className="absolute -inset-x-[6%] inset-y-0">
                    <ProjectCover
                      project={p}
                      transitionName={`cover-${p.slug}`}
                      className="size-full transition-transform duration-[1.2s] ease-[var(--ease-expo)] group-hover:scale-[1.04]"
                      imgClassName="transition-[filter] duration-700 md:[filter:grayscale(0.85)_brightness(0.78)] md:group-hover:[filter:none] md:group-focus-visible:[filter:none]"
                    />
                  </div>
                  <span className="label-mono absolute right-4 bottom-4 flex items-center gap-2 rounded-full bg-abyss/80 px-3 py-2 text-white opacity-100 backdrop-blur transition-all duration-500 md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-visible:translate-y-0 md:group-focus-visible:opacity-100">
                    Ver case <span aria-hidden="true">→</span>
                  </span>
                </div>
                <div className="mt-5 flex items-baseline gap-4">
                  <span className="label-mono text-signal-text">{pad(i + 1)}</span>
                  <span className="label-mono truncate">{p.category}</span>
                </div>
                <h3 className="mt-2 text-[length:clamp(24px,2.4vw,36px)] leading-tight font-bold tracking-[-0.02em] text-white [font-stretch:110%]">
                  <span className="link-draw">{p.title}</span>
                </h3>
                <p className="mt-2 line-clamp-2 max-w-[52ch] text-[15px] leading-relaxed text-fog">{p.teaser}</p>
                <p className="label-mono mt-4 text-ice/80">{p.tools.join(" · ")}</p>
              </Link>
            </li>
          ))}
        </ol>

        {/* Progresso do trilho */}
        <div aria-hidden="true" className="absolute inset-x-10 bottom-8 hidden h-px bg-line md:block">
          <div data-progress className="h-full origin-left scale-x-0 bg-sky" />
        </div>
      </div>
    </section>
  );
}
