import { useRef } from "react";
import { courseGroups, degrees, languages } from "~/content/education";
import { gsap, prefersReducedMotion, useGSAP } from "~/lib/gsap";
import { useIntro } from "~/lib/intro";

export function Education() {
  const root = useRef<HTMLElement>(null);
  const { ready } = useIntro();

  useGSAP(
    () => {
      if (!ready || prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);

      gsap.from(q("[data-head]"), {
        y: 40,
        opacity: 0,
        duration: 1.1,
        stagger: 0.08,
        scrollTrigger: { trigger: root.current, start: "top 70%" },
      });

      // Formações: a linha se desenha e o conteúdo sobe por máscara.
      q("[data-degree]").forEach((row) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: "top 85%" } });
        tl.from(row.querySelector("[data-rule]"), { scaleX: 0, duration: 1.4, ease: "power3.inOut" }).from(
          row.querySelectorAll("[data-reveal]"),
          { yPercent: 110, duration: 1.1, stagger: 0.06 },
          0.2,
        );
      });

      gsap.from(q("[data-group]"), {
        y: 50,
        opacity: 0,
        duration: 1.1,
        stagger: 0.1,
        scrollTrigger: { trigger: q("[data-courses]")[0], start: "top 80%" },
      });
    },
    { dependencies: [ready], scope: root },
  );

  return (
    <section
      id="formacao"
      ref={root}
      aria-labelledby="formacao-titulo"
      className="relative border-t border-line bg-abyss px-4 py-24 md:px-10 md:py-36"
    >
      <div className="grid gap-6 md:grid-cols-12 md:gap-10">
        <p data-head className="label-mono md:col-span-3 md:pt-4">
          <span className="text-signal-text">05</span> — Formação
        </p>
        <h2
          id="formacao-titulo"
          data-head
          className="text-[length:clamp(40px,6.4vw,104px)] leading-[0.9] font-extrabold tracking-[-0.035em] text-white [font-stretch:118%] md:col-span-9"
        >
          Formação <span className="accent-serif font-normal text-sky">e certificações</span>
        </h2>
      </div>

      {/* Formação acadêmica */}
      <ol aria-label="Formação acadêmica" className="mt-16 md:mt-24">
        {degrees.map((d) => (
          <li key={d.title} data-degree className="group relative py-8 md:py-10">
            <span data-rule aria-hidden="true" className="absolute inset-x-0 top-0 block h-px origin-left bg-line">
              <span className="block h-full origin-left scale-x-0 bg-sky transition-transform duration-700 ease-[var(--ease-expo)] group-hover:scale-x-100" />
            </span>
            <div className="grid gap-3 md:grid-cols-12 md:items-baseline md:gap-10">
              {/* O GSAP anima os [data-reveal]; o hover move só o span interno do título. */}
              <div className="overflow-hidden md:col-span-3">
                <p data-reveal className="label-mono">
                  {d.level}
                  {d.year && <span className="text-signal-text"> · {d.year}</span>}
                </p>
              </div>
              <div className="overflow-hidden md:col-span-6">
                <h3 className="text-[length:clamp(28px,3.1vw,48px)] leading-[1.02] font-bold tracking-[-0.025em] text-white [font-stretch:112%]">
                  <span data-reveal className="block">
                    <span className="inline-block transition-transform duration-700 ease-[var(--ease-expo)] md:group-hover:translate-x-3">
                      {d.title}
                    </span>
                  </span>
                </h3>
              </div>
              <div className="overflow-hidden md:col-span-3 md:text-right">
                <p data-reveal className="accent-serif text-xl text-sky md:text-2xl">
                  {d.institution}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ol>

      {/* Cursos complementares */}
      <div className="mt-16 grid gap-10 border-t border-line pt-14 md:mt-24 md:grid-cols-12 md:pt-20">
        <h3 data-head className="label-mono md:col-span-3">
          Cursos complementares
        </h3>
        <div data-courses className="grid gap-12 sm:grid-cols-2 md:col-span-9 md:gap-x-10 xl:grid-cols-4">
          {courseGroups.map(({ group, courses }) => (
            <div key={group} data-group>
              <h4 className="label-mono text-signal-text">{group}</h4>
              <ul className="mt-5 space-y-4">
                {courses.map((c) => (
                  <li key={c.title} className="border-t border-line/70 pt-3">
                    <p className="leading-snug text-white">{c.title}</p>
                    <p className="label-mono mt-1 normal-case tracking-normal">
                      {c.institution}
                      {c.hours && <span className="text-fog"> · {c.hours}h</span>}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Idiomas */}
      <div className="mt-16 grid gap-4 border-t border-line pt-8 md:grid-cols-12 md:gap-10">
        <h3 className="label-mono md:col-span-3">Idiomas</h3>
        <ul className="md:col-span-9">
          {languages.map((l) => (
            <li key={l.name} className="text-lg text-white">
              {l.name} <span className="accent-serif text-sky">· {l.level}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
