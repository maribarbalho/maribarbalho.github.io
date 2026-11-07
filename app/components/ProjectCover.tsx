import { shot } from "~/content/images";
import type { Project } from "~/content/projects";

type Props = {
  project: Project;
  /** Chave de outra captura (galeria). Por padrão, usa a capa do projeto. */
  imageKey?: string | null;
  sizes?: string;
  priority?: boolean;
  /** Nome compartilhado na transição card → case. */
  transitionName?: string;
  className?: string;
  imgClassName?: string;
  alt?: string;
};

/**
 * Captura real do dashboard ou, quando ainda não existe, um placeholder
 * identificado (nunca uma imagem inventada).
 */
export function ProjectCover({
  project,
  imageKey = project.cover,
  sizes = "(min-width: 768px) 40vw, 92vw",
  priority = false,
  transitionName,
  className = "",
  imgClassName = "",
  alt,
}: Props) {
  const img = imageKey ? shot(imageKey) : null;
  const style = transitionName ? { viewTransitionName: transitionName } : undefined;

  if (!img) {
    return (
      <div
        style={style}
        className={`relative grid place-items-center overflow-hidden bg-navy-2 ${className}`}
        role="img"
        aria-label={`${project.title}: captura de tela pendente`}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-60 [background-image:linear-gradient(var(--color-line)_1px,transparent_1px),linear-gradient(90deg,var(--color-line)_1px,transparent_1px)] [background-size:48px_48px]"
        />
        <div className="relative px-6 text-center">
          <p className="label-mono text-signal-text">[ Captura pendente ]</p>
          <p className="mt-3 font-mono text-sm text-ice/80">{project.tools.join(" · ")}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={style} className={`relative overflow-hidden bg-navy-2 ${className}`}>
      <img
        src={img.src}
        srcSet={img.srcSet}
        sizes={sizes}
        alt={alt ?? `Captura do dashboard ${project.title}`}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        className={`size-full object-cover object-top ${imgClassName}`}
      />
    </div>
  );
}
