import { useEffect } from "react";
import { useLocation } from "react-router";
import { profile } from "~/content/profile";
import { ScrollTrigger } from "~/lib/gsap";
import { useIntro } from "~/lib/intro";
import { scrollToTarget } from "~/lib/scroll";
import { About } from "~/sections/About";
import { Hero } from "~/sections/Hero";
import { Projects } from "~/sections/Projects";
import type { Route } from "./+types/home";

export const meta: Route.MetaFunction = () => {
  const title = `${profile.name} · Analista de Dados & Business Intelligence`;
  const description =
    "Analista de Dados especializada em Business Intelligence, Power BI, SQL e Python. Dashboards, KPIs, ETL e análises que apoiam a tomada de decisão.";
  return [
    { title },
    { name: "description", content: description },
    { name: "author", content: profile.name },
    { property: "og:type", content: "website" },
    { property: "og:locale", content: "pt_BR" },
    { property: "og:url", content: profile.url },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { name: "twitter:card", content: "summary_large_image" },
    { tagName: "link", rel: "canonical", href: profile.url },
  ];
};

export default function Home() {
  const { hash } = useLocation();
  const { ready } = useIntro();

  // Ao voltar de um case (ex.: "/#projetos"), rola até a seção depois que
  // os pins do GSAP já reservaram seus espaços.
  useEffect(() => {
    if (!ready || !hash) return;
    const go = () => {
      ScrollTrigger.refresh();
      scrollToTarget(hash);
    };
    // Repete depois que fontes e imagens assentam o layout.
    const ids = [80, 700].map((ms) => window.setTimeout(go, ms));
    return () => ids.forEach((id) => window.clearTimeout(id));
  }, [ready, hash]);

  return (
    <main id="conteudo">
      <Hero />
      <About />
      <Projects />

      {/* PLACEHOLDER: próxima etapa (Experiência). Existe só para testar a rolagem. */}
      <section
        id="experiencia"
        aria-label="Próxima seção (em construção)"
        className="grid min-h-svh place-items-center border-t border-line bg-navy px-4"
      >
        <div className="text-center">
          <p className="label-mono text-signal-text">[ Placeholder · Etapa 4 ]</p>
          <p className="mt-4 text-3xl font-bold text-white [font-stretch:112%] md:text-5xl">
            Experiência <span className="accent-serif text-sky">profissional</span>
          </p>
          <p className="mx-auto mt-4 max-w-md text-fog">
            Esta seção será desenvolvida na próxima etapa, após a aprovação de Projetos.
          </p>
        </div>
      </section>
    </main>
  );
}
