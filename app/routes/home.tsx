import { useEffect } from "react";
import { useLocation } from "react-router";
import { profile } from "~/content/profile";
import { ScrollTrigger } from "~/lib/gsap";
import { useIntro } from "~/lib/intro";
import { scrollToTarget } from "~/lib/scroll";
import { About } from "~/sections/About";
import { Contact } from "~/sections/Contact";
import { Education } from "~/sections/Education";
import { Experience } from "~/sections/Experience";
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

  // Depois que todas as seções criaram suas animações, ordena os gatilhos
  // (pins primeiro, de cima para baixo) e recalcula as posições.
  useEffect(() => {
    if (!ready) return;
    const id = requestAnimationFrame(() => {
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    });
    return () => cancelAnimationFrame(id);
  }, [ready]);

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
      <Experience />
      <Education />
      <Contact />
    </main>
  );
}
