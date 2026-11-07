import type { Config } from "@react-router/dev/config";
import { projectSlugs } from "./app/content/projects";

// Site 100% estático: cada rota é pré-renderizada em HTML no build,
// o que garante SEO e compatibilidade com o GitHub Pages.
export default {
  ssr: false,
  prerender: ["/", ...projectSlugs.map((slug) => `/projetos/${slug}`)],
} satisfies Config;
