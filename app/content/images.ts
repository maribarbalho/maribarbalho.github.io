// Resolve as capturas dos projetos (app/assets/projects/<chave>-<largura>.webp)
// em src + srcSet otimizados pelo Vite.
const files = import.meta.glob<string>("../assets/projects/*.webp", {
  eager: true,
  import: "default",
});

export function shot(key: string) {
  const at = (w: number) => files[`../assets/projects/${key}-${w}.webp`];
  const src = at(1600);
  if (!src) return null;
  return { src, srcSet: `${at(800)} 800w, ${src} 1600w` };
}
