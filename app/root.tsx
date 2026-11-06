import type { ReactNode } from "react";
import { Links, Meta, Outlet, Scripts, ScrollRestoration, isRouteErrorResponse } from "react-router";
import type { Route } from "./+types/root";
import { profile } from "./content/profile";
import "./styles/app.css";

// Roda antes da primeira pintura: marca se há JS + movimento permitido
// e se a introdução já foi vista nesta sessão (evita piscar o conteúdo).
const bootScript = `(function(){try{var d=document.documentElement;
if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('motion')}
if(sessionStorage.getItem('mb:intro-seen')){d.classList.add('intro-seen')}}catch(e){}})();`;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.role,
  url: profile.url,
  sameAs: [profile.contact.linkedin],
  alumniOf: [
    { "@type": "CollegeOrUniversity", name: "FIAP" },
    { "@type": "CollegeOrUniversity", name: "Universidade São Judas Tadeu" },
  ],
  knowsAbout: ["Business Intelligence", "Power BI", "SQL", "Python", "ETL", "Data Analytics"],
};

export const links: Route.LinksFunction = () => [
  { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
  { rel: "canonical", href: profile.url },
];

export function Layout({ children }: { children: ReactNode }) {
  return (
    // As classes "motion" e "intro-seen" são aplicadas pelo bootScript antes da hidratação.
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#03070D" />
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <Meta />
        <Links />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const notFound = isRouteErrorResponse(error) && error.status === 404;
  return (
    <main className="grid min-h-svh place-items-center bg-abyss px-4 text-center">
      <div>
        <p className="label-mono">{notFound ? "404" : "Erro"}</p>
        <h1 className="mt-4 text-5xl font-extrabold text-white [font-stretch:115%]">
          {notFound ? "Página não encontrada." : "Algo saiu do esperado."}
        </h1>
        <a href="/" className="link-draw mt-8 inline-block text-sky">
          Voltar ao início
        </a>
      </div>
    </main>
  );
}
