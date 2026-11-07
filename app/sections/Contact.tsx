import { useRef, useState } from "react";
import { SignalField } from "~/components/SignalField";
import { profile } from "~/content/profile";
import { SplitText, gsap, prefersReducedMotion, useGSAP } from "~/lib/gsap";
import { useIntro } from "~/lib/intro";
import { scrollToTarget } from "~/lib/scroll";

/** Currículo em PDF (arquivo em public/). */
const CV_URL: string | null = "/curriculo-mariana-barbalho.pdf";

export function Contact() {
  const root = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const intro = useRef(1);
  const [copied, setCopied] = useState(false);
  const { ready } = useIntro();

  useGSAP(
    () => {
      if (!ready) return;
      const q = gsap.utils.selector(root);

      if (prefersReducedMotion()) {
        progress.current = 1;
        return;
      }

      // Fechamento do conceito: os pontos voltam a formar o sinal.
      gsap.to(progress, {
        current: 1,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top 85%", end: "top 10%", scrub: 0.8 },
      });

      const split = SplitText.create(q("[data-title]"), { type: "lines", mask: "lines", aria: "none" });
      gsap
        .timeline({ scrollTrigger: { trigger: root.current, start: "top 55%" } })
        .from(split.lines, { yPercent: 110, duration: 1.3, stagger: 0.1 })
        .from(q("[data-rise]"), { y: 30, opacity: 0, duration: 1, stagger: 0.07 }, 0.35)
        .add(() => split.revert());
    },
    { dependencies: [ready], scope: root },
  );

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.contact.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${profile.contact.email}`;
    }
  };

  return (
    <section
      id="contato"
      ref={root}
      aria-labelledby="contato-titulo"
      className="relative isolate flex min-h-svh flex-col overflow-hidden border-t border-line bg-abyss"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(900px_520px_at_15%_100%,rgba(37,99,235,0.18),transparent_65%),radial-gradient(600px_380px_at_90%_10%,rgba(139,92,246,0.08),transparent_70%)]"
      />
      <SignalField progress={progress} intro={intro} className="absolute inset-0 -z-10 size-full opacity-70" />

      <div className="flex flex-1 flex-col justify-center px-4 pt-28 pb-16 md:px-10">
        <p data-rise className="label-mono">
          <span className="text-signal-text">06</span> — Contato
        </p>
        <h2
          id="contato-titulo"
          data-title
          className="mt-6 max-w-[14ch] text-[length:clamp(52px,10vw,176px)] leading-[0.88] font-extrabold tracking-[-0.045em] text-white [font-stretch:120%]"
        >
          Vamos falar de <span className="accent-serif font-normal text-sky">dados</span>.
        </h2>
        <p data-rise className="mt-8 max-w-md text-lg text-mist">
          Escreva para conversar sobre dados, BI ou algum dos projetos.
        </p>

        <div className="mt-12 flex flex-col gap-6 md:mt-16 md:flex-row md:items-end md:justify-between">
          {/* E-mail */}
          <div data-rise>
            <p className="label-mono">E-mail</p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${profile.contact.email}`}
                className="link-draw pb-1 text-[length:clamp(18px,2.4vw,34px)] font-semibold break-all text-white [font-stretch:108%]"
              >
                {profile.contact.email}
              </a>
              <button
                type="button"
                onClick={copyEmail}
                className="label-mono rounded-full border border-line px-4 py-2 text-white transition-colors duration-300 hover:border-sky hover:bg-electric"
              >
                {copied ? "Copiado ✓" : "Copiar"}
              </button>
              <span role="status" aria-live="polite" className="sr-only">
                {copied ? "E-mail copiado para a área de transferência" : ""}
              </span>
            </div>
          </div>

          {/* Links */}
          <ul data-rise className="flex flex-wrap gap-3">
            <li>
              <a
                href={profile.contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="label-mono inline-flex items-center gap-2 rounded-full border border-line px-5 py-3 text-white transition-colors duration-300 hover:border-sky hover:bg-electric"
              >
                LinkedIn <span aria-hidden="true">↗</span>
                <span className="sr-only">(abre em nova aba)</span>
              </a>
            </li>
            <li>
              {CV_URL ? (
                <a
                  href={CV_URL}
                  download="Curriculo-Mariana-Barbalho.pdf"
                  type="application/pdf"
                  className="label-mono inline-flex items-center gap-2 rounded-full border border-line px-5 py-3 text-white transition-colors duration-300 hover:border-sky hover:bg-electric"
                >
                  Currículo (PDF) <span aria-hidden="true">↓</span>
                </a>
              ) : (
                <span
                  title="Placeholder: o PDF do currículo ainda será adicionado"
                  className="label-mono inline-flex items-center gap-2 rounded-full border border-dashed border-line px-5 py-3 text-fog"
                >
                  Currículo (PDF) <span className="text-signal-text">[ em breve ]</span>
                </span>
              )}
            </li>
          </ul>
        </div>
      </div>

      {/* Rodapé */}
      <footer className="flex flex-col gap-3 border-t border-line px-4 py-6 md:flex-row md:items-center md:justify-between md:px-10">
        <p className="label-mono">© {new Date().getFullYear()} {profile.name}</p>
        <p className="label-mono hidden md:block">React · GSAP · Lenis</p>
        <button
          type="button"
          onClick={() => scrollToTarget(0, false)}
          className="label-mono link-draw self-start pb-1 text-mist hover:text-white md:self-auto"
        >
          Voltar ao topo ↑
        </button>
      </footer>
    </section>
  );
}
