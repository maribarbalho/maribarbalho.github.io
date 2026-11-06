import type { Config } from "@react-router/dev/config";

// Site 100% estático: cada rota é pré-renderizada em HTML no build,
// o que garante SEO e compatibilidade com o GitHub Pages.
export default {
  ssr: false,
  prerender: ["/"],
} satisfies Config;
