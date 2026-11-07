import { useRef, type ReactNode } from "react";
import { Link } from "react-router";
import { ProjectCover } from "~/components/ProjectCover";
import { shot } from "~/content/images";
import { profile } from "~/content/profile";
import { getProject, projects, type Project } from "~/content/projects";
import { SplitText, gsap, useGSAP } from "~/lib/gsap";
import { useIntro } from "~/lib/intro";
import type { Route } from "./+types/project";

// Sem loader: assim o conteúdo do case entra inteiro no HTML pré-renderizado (SEO).

/** Blocos "[ A documentar ]": ocultos no site publicado. Mude para true para revê-los. */
const SHOW_PENDING = false;

export const meta: Route.MetaFunction = ({ params }) => {
  const project = getProject(params.slug);
  if (!project) return [{ title: `Projeto não encontrado · ${profile.name}` }];
  const title = `${project.title} · ${profile.name}`;
  const url = `${profile.url}projetos/${project.slug}`;
  const cover = project.cover ? shot(project.cover) : null;
  return [
    { title },
    { name: "description", content: project.teaser },
    { property: "og:type", content: "article" },
    { property: "og:locale", content: "pt_BR" },
    { property: "og:url", content: url },
    { property: "og:title", content: title },
    { property: "og:description", content: project.teaser },
    ...(cover ? [{ property: "og:image", content: new URL(cover.src, profile.url).href }] : []),
    { name: "twitter:card", content: "summary_large_image" },
    { tagName: "link", rel: "canonical", href: url },
  ];
};

const pad = (n: number) => String(n).padStart(2, "0");

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section data-rise className="grid gap-6 border-t border-line py-12 md:grid-cols-12 md:gap-10 md:py-16">
      <h2 className="label-mono md:col-span-3">{title}</h2>
      <div className="md:col-span-9">{children}</div>
    </section>
  );
}

function Pending({ label }: { label: string }) {
  return (
    <div className="border border-dashed border-line px-5 py-4">
      <p className="label-mono text-signal-text">[ A documentar ]</p>
      <p className="mt-1 text-fog">{label}</p>
    </div>
  );
}

function Bullets({ items }: { items: readonly string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-4 text-lg leading-relaxed text-mist">
          <span aria-hidden="true" className="mt-[0.7em] h-px w-4 shrink-0 bg-sky" />
          {item}
        </li>
      ))}
    </ul>
  );
}

function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="label-mono inline-flex items-center gap-2 rounded-full border border-line px-4 py-2.5 text-white transition-colors duration-300 hover:border-sky hover:bg-electric"
    >
      {children}
      <span aria-hidden="true">↗</span>
      <span className="sr-only">(abre em nova aba)</span>
    </a>
  );
}

export default function ProjectPage({ params }: Route.ComponentProps) {
  const project = getProject(params.slug);
  if (!project) {
    return (
      <main id="conteudo" className="grid min-h-svh place-items-center bg-abyss px-4 text-center">
        <div>
          <p className="label-mono">404</p>
          <h1 className="mt-4 text-5xl font-extrabold text-white [font-stretch:115%]">Projeto não encontrado.</h1>
          <Link to="/#projetos" className="link-draw mt-8 inline-block text-sky">
            Ver todos os projetos
          </Link>
        </div>
      </main>
    );
  }
  return <ProjectView project={project} />;
}

function ProjectView({ project }: { project: Project }) {
  const index = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(index + 1) % projects.length];
  const root = useRef<HTMLElement>(null);
  const { ready } = useIntro();

  const gallery = (project.shots ?? []).filter((s) => s.key !== project.cover);

  useGSAP(
    () => {
      if (!ready || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const q = gsap.utils.selector(root);
      // Entrada do título só no desktop: no mobile o texto já aparece pronto (melhor LCP).
      if (window.matchMedia("(min-width: 768px)").matches) {
        const split = SplitText.create(q("[data-title]"), { type: "lines", mask: "lines", aria: "none" });
        gsap
          .timeline({ defaults: { ease: "expo.out" } })
          .from(split.lines, { yPercent: 105, duration: 1.3, stagger: 0.08 })
          .from(q("[data-fade]"), { y: 24, opacity: 0, duration: 1, stagger: 0.06 }, 0.2)
          .add(() => split.revert());
      }

      q("[data-rise]").forEach((el) => {
        gsap.from(el, {
          y: 50,
          opacity: 0,
          duration: 1.1,
          scrollTrigger: { trigger: el, start: "top 85%" },
        });
      });
    },
    { dependencies: [ready, project.slug], scope: root, revertOnUpdate: true },
  );

  return (
    <main id="conteudo">
      <article ref={root} key={project.slug} className="bg-abyss">
        {/* Cabeçalho */}
        <header className="px-4 pt-28 pb-12 md:px-10 md:pt-36 md:pb-16">
          <Link to="/#projetos" data-fade className="label-mono link-draw pb-1 text-mist hover:text-white">
            ← Todos os projetos
          </Link>
          <p data-fade className="label-mono mt-12">
            <span className="text-signal-text">{pad(index + 1)}</span> — {project.category}
          </p>
          <h1
            data-title
            className="mt-4 max-w-[16ch] text-[length:clamp(44px,7.4vw,120px)] leading-[0.92] font-extrabold tracking-[-0.035em] text-white [font-stretch:115%]"
          >
            {project.title}
          </h1>

          <div className="mt-10 grid gap-10 md:grid-cols-12">
            <p data-fade className="text-xl leading-relaxed text-mist md:col-span-7 md:text-2xl">
              {project.teaser}
            </p>
            <dl data-fade className="space-y-6 md:col-span-4 md:col-start-9">
              <div>
                <dt className="label-mono">Ferramentas</dt>
                <dd className="mt-2 text-ice">{project.tools.join(" · ")}</dd>
              </div>
              {(project.links.powerbi || project.links.github || project.links.demo) && (
                <div>
                  <dt className="label-mono">Acessar</dt>
                  <dd className="mt-3 flex flex-wrap gap-2">
                    {project.links.powerbi && <ExternalLink href={project.links.powerbi}>Power BI</ExternalLink>}
                    {project.links.github && <ExternalLink href={project.links.github}>GitHub</ExternalLink>}
                    {project.links.demo && <ExternalLink href={project.links.demo}>Demo</ExternalLink>}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </header>

        {/* Capa (compartilha a transição com o card da home) */}
        <div className="px-4 md:px-10">
          <ProjectCover
            project={project}
            priority
            sizes="(min-width: 768px) 92vw, 100vw"
            transitionName={`cover-${project.slug}`}
            className="aspect-[16/9] w-full border border-line"
          />
          {project.disclaimer && (
            <p className="label-mono mt-4 normal-case tracking-normal text-fog">{project.disclaimer}</p>
          )}
        </div>

        {/* Conteúdo */}
        <div className="px-4 pt-12 pb-24 md:px-10 md:pt-20">
          {(project.context || SHOW_PENDING) && (
          <Block title="Contexto">
            {project.context ? (
              <p className="max-w-[65ch] text-lg leading-relaxed text-mist md:text-xl">{project.context}</p>
            ) : (
              <Pending label="Contexto e problema de negócio" />
            )}
          </Block>
          )}

          {project.questions && (
            <Block title="Perguntas de negócio">
              <Bullets items={project.questions} />
            </Block>
          )}

          {project.method && (
            <Block title="Dados e método">
              <Bullets items={project.method} />
            </Block>
          )}

          {project.kpis && (
            <Block title="Indicadores">
              <dl className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-3">
                {project.kpis.items.map((k) => (
                  <div key={k.label} className="flex flex-col-reverse border-t border-line pt-4">
                    <dt className="mt-2 text-sm text-fog">{k.label}</dt>
                    <dd className="font-mono text-[length:clamp(28px,3.2vw,44px)] leading-none text-white">{k.value}</dd>
                  </div>
                ))}
              </dl>
              <p className="label-mono mt-8 max-w-[70ch] leading-relaxed normal-case tracking-normal">
                <span className="text-signal-text">Nota ·</span> {project.kpis.note}
              </p>
            </Block>
          )}

          {gallery.length > 0 && (
            <Block title="Telas do dashboard">
              <div className="grid gap-10">
                {gallery.map((s) => (
                  <figure key={s.key}>
                    <ProjectCover
                      project={project}
                      imageKey={s.key}
                      sizes="(min-width: 768px) 70vw, 100vw"
                      alt={`${project.title}: página ${s.caption}`}
                      className="aspect-[16/9] w-full border border-line"
                    />
                    <figcaption className="label-mono mt-3">{s.caption}</figcaption>
                  </figure>
                ))}
              </div>
            </Block>
          )}

          {project.insights && (
            <Block title="Insights">
              <Bullets items={project.insights} />
            </Block>
          )}

          {project.challenges && (
            <Block title="Desafios técnicos">
              <ol className="grid gap-8 md:grid-cols-3">
                {project.challenges.map((c, i) => (
                  <li key={c.title} className="border-t border-line pt-4">
                    <span className="label-mono text-signal-text">{pad(i + 1)}</span>
                    <h3 className="mt-2 text-lg font-semibold text-white">{c.title}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-fog">{c.text}</p>
                  </li>
                ))}
              </ol>
            </Block>
          )}

          {SHOW_PENDING && project.pending && project.pending.length > 0 && (
            <Block title="Em documentação">
              <div className="grid gap-3 md:grid-cols-2">
                {project.pending
                  .filter((label) => !(label.startsWith("Contexto") && !project.context))
                  .map((label) => (
                    <Pending key={label} label={label} />
                  ))}
              </div>
            </Block>
          )}
        </div>

        {/* Próximo projeto */}
        <nav aria-label="Próximo projeto" className="border-t border-line">
          <Link
            to={`/projetos/${next.slug}`}
            viewTransition
            className="group grid items-center gap-8 px-4 py-16 md:grid-cols-12 md:px-10 md:py-24"
          >
            <div className="md:col-span-8">
              <p className="label-mono">Próximo projeto</p>
              <p className="mt-4 text-[length:clamp(36px,5.6vw,88px)] leading-[0.95] font-extrabold tracking-[-0.03em] text-white [font-stretch:115%]">
                <span className="link-draw">{next.title}</span> <span aria-hidden="true" className="inline-block transition-transform duration-500 group-hover:translate-x-3">→</span>
              </p>
            </div>
            <ProjectCover
              project={next}
              transitionName={`cover-${next.slug}`}
              sizes="(min-width: 768px) 30vw, 92vw"
              className="aspect-[16/10] w-full md:col-span-4"
              imgClassName="transition-[filter] duration-700 [filter:grayscale(0.85)_brightness(0.78)] group-hover:[filter:none]"
            />
          </Link>
        </nav>
      </article>
    </main>
  );
}
