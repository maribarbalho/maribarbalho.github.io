import { useRef } from "react";
import { experience } from "~/content/experience";
import { ScrollTrigger, gsap, prefersReducedMotion, useGSAP } from "~/lib/gsap";
import { useIntro } from "~/lib/intro";

export function Experience() {
  const root = useRef<HTMLElement>(null);
  const { ready } = useIntro();

  useGSAP(
    () => {
      if (!ready) return;
      const q = gsap.utils.selector(root);
      const reduced = prefersReducedMotion();
      const yearEl = q("[data-year]")[0] as HTMLElement | undefined;
      const companyEl = q("[data-year-company]")[0] as HTMLElement | undefined;
      let current = 0;

      // Troca o ano grande fixo quando outra experiência fica ativa.
      const activate = (i: number) => {
        q("[data-job]").forEach((el, j) => el.toggleAttribute("data-active", j === i));
        if (i === current || !yearEl || !companyEl) return;
        const dir = i > current ? 1 : -1;
        current = i;
        if (reduced) {
          yearEl.textContent = experience[i].years;
          companyEl.textContent = experience[i].company;
          return;
        }
        gsap
          .timeline()
          .to([yearEl, companyEl], { yPercent: -60 * dir, autoAlpha: 0, duration: 0.25, ease: "power2.in" })
          .add(() => {
            yearEl.textContent = experience[i].years;
            companyEl.textContent = experience[i].company;
          })
          .fromTo(
            [yearEl, companyEl],
            { yPercent: 60 * dir, autoAlpha: 0 },
            { yPercent: 0, autoAlpha: 1, duration: 0.6, ease: "expo.out", stagger: 0.04 },
          );
      };

      q("[data-job]").forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => self.isActive && activate(i),
        });
      });
      activate(0);

      if (reduced) return;

      // Linha do tempo desenhada pela rolagem.
      gsap.fromTo(
        q("[data-line-fill]"),
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: q("[data-timeline]")[0], start: "top 55%", end: "bottom 55%", scrub: 0.6 },
        },
      );

      gsap.from(q("[data-head]"), {
        y: 40,
        opacity: 0,
        duration: 1.1,
        stagger: 0.08,
        scrollTrigger: { trigger: root.current, start: "top 70%" },
      });

      q("[data-job]").forEach((el) => {
        gsap.from(el.querySelectorAll("[data-rise]"), {
          y: 40,
          opacity: 0,
          duration: 1.1,
          stagger: 0.07,
          scrollTrigger: { trigger: el, start: "top 80%" },
        });
      });
    },
    { dependencies: [ready], scope: root },
  );

  return (
    <section
      id="experiencia"
      ref={root}
      aria-labelledby="experiencia-titulo"
      className="relative border-t border-line bg-navy px-4 py-16 md:px-10 md:py-36"
    >
      <div className="grid gap-6 md:grid-cols-12 md:gap-10">
        <p data-head className="label-mono md:col-span-3 md:pt-4">
          <span className="text-signal-text">04</span> — Experiência
        </p>
        <h2
          id="experiencia-titulo"
          data-head
          className="text-[length:clamp(40px,6.4vw,104px)] leading-[0.9] font-extrabold tracking-[-0.035em] text-white [font-stretch:118%] md:col-span-9"
        >
          Trajetória <span className="accent-serif font-normal text-sky">profissional</span>
        </h2>
      </div>

      <div className="mt-10 grid gap-10 md:mt-24 md:grid-cols-12">
        {/* Ano fixo (desktop) */}
        <div aria-hidden="true" className="hidden md:col-span-3 md:block">
          <div className="sticky top-32 overflow-hidden">
            <p
              data-year
              className="text-[length:clamp(48px,6vw,96px)] leading-none font-extrabold tracking-[-0.04em] text-white tabular-nums [font-stretch:118%]"
            >
              {experience[0].years}
            </p>
            <p data-year-company className="label-mono mt-4 text-signal-text">
              {experience[0].company}
            </p>
          </div>
        </div>

        {/* Linha do tempo */}
        <div data-timeline className="relative md:col-span-9">
          <div aria-hidden="true" className="absolute top-2 bottom-0 left-[3px] w-px bg-line">
            <div data-line-fill className="h-full origin-top bg-sky" />
          </div>

          <ol className="space-y-20 md:space-y-28">
            {experience.map((job) => (
              <li key={job.company} data-job className="group relative pl-10 md:pl-16">
                <span
                  aria-hidden="true"
                  className="absolute top-2 left-0 size-[7px] rounded-full bg-line ring-4 ring-navy transition-colors duration-500 group-data-[active]:bg-sky"
                />
                <p data-rise className="label-mono">
                  <time>{job.start}</time> — <time>{job.end}</time>
                  <span className="text-fog"> · </span>
                  {job.sector}
                </p>
                <h3
                  data-rise
                  className="mt-4 text-[length:clamp(36px,4.6vw,72px)] leading-[0.95] font-extrabold tracking-[-0.03em] text-white [font-stretch:115%]"
                >
                  {job.company}
                </h3>
                <p data-rise className="accent-serif mt-2 text-2xl text-sky md:text-3xl">
                  {job.role}
                </p>
                <ul data-rise className="mt-8 max-w-[62ch] space-y-3">
                  {job.highlights.map((h) => (
                    <li key={h} className="flex gap-4 text-lg leading-relaxed text-mist">
                      <span aria-hidden="true" className="mt-[0.7em] h-px w-4 shrink-0 bg-fog/50" />
                      {h}
                    </li>
                  ))}
                </ul>
                <ul data-rise aria-label={`Ferramentas na ${job.company}`} className="mt-8 flex flex-wrap gap-2">
                  {job.tools.map((t) => (
                    <li key={t} className="label-mono rounded-full border border-line px-3 py-1.5 text-ice">
                      {t}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
