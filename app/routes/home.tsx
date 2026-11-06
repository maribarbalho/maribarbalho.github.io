import { Header } from "~/components/Header";
import { Preloader } from "~/components/Preloader";
import { SmoothScroll } from "~/components/SmoothScroll";
import { profile } from "~/content/profile";
import { IntroProvider } from "~/lib/intro";
import { Hero } from "~/sections/Hero";
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
  ];
};

export default function Home() {
  return (
    <IntroProvider>
      <a href="#conteudo" className="skip-link">
        Pular para o conteúdo
      </a>
      <Preloader />
      <SmoothScroll>
        <Header />
        <main id="conteudo">
          <Hero />

          {/* PLACEHOLDER: próxima etapa (Sobre / Manifesto). Existe só para testar a rolagem do Hero. */}
          <section
            id="sobre"
            aria-label="Próxima seção (em construção)"
            className="grid min-h-svh place-items-center border-t border-line bg-navy px-4"
          >
            <div className="text-center">
              <p className="label-mono text-signal-text">[ Placeholder · Etapa 2 ]</p>
              <p className="mt-4 text-3xl font-bold text-white [font-stretch:112%] md:text-5xl">
                Sobre <span className="accent-serif text-sky">/ Manifesto</span>
              </p>
              <p className="mx-auto mt-4 max-w-md text-fog">
                Esta seção será desenvolvida na próxima etapa, após a aprovação do Hero.
              </p>
            </div>
          </section>
        </main>
      </SmoothScroll>
    </IntroProvider>
  );
}
