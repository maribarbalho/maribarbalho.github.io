# Portfólio · Mariana Barbalho

Portfólio de Analista de Dados e Business Intelligence.

**🌐 [maribarbalho.github.io](https://maribarbalho.github.io/)**

> Publicado automaticamente pelo GitHub Actions a cada push na `main`. A versão anterior (HTML/CSS) está na tag `site-antigo`.

## Stack

- **React 19 + React Router 8** (modo framework, `ssr: false` com pré-renderização): cada rota vira HTML estático no build, compatível com o GitHub Pages e bom para SEO.
- **Vite 8** e **Tailwind CSS 4**: os tokens de cor e tipografia ficam em `app/styles/app.css`.
- **GSAP** (ScrollTrigger, SplitText) e **Lenis**: animações e scroll suave, respeitando `prefers-reduced-motion`.
- Fontes self-hosted via Fontsource: Archivo (variável, eixo de largura), Instrument Serif e JetBrains Mono.

## Estrutura

```
app/
  content/     dados profissionais (editar aqui para atualizar textos)
  components/  peças reutilizáveis (Header, Preloader, SignalField, SmoothScroll)
  sections/    seções da página (Hero, …)
  lib/         configuração do GSAP e da introdução
  routes/      páginas
  styles/      CSS global e tokens
public/        arquivos servidos como estão (favicon)
```

## Rodando localmente

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # gera build/client
npm run typecheck
```

## Projetos relacionados

- [Logistics Performance Analytics](https://github.com/maribarbalho/logistics-performance-analytics): case de BI em Power BI
- [Dashboard de RH](https://github.com/maribarbalho/dashboard-rh): Streamlit e Plotly
- [Dashboard de Vendas](https://github.com/maribarbalho/dashboard_vendas): Streamlit com dados de API
- [Bikcraft](https://github.com/maribarbalho/bikcraft): projeto de estudo de front-end

## Publicação

O workflow `.github/workflows/deploy.yml` faz o build e publica no GitHub Pages a cada push na `main` (ou manualmente, em Actions). O Pages está configurado com a origem **GitHub Actions**.

O build gera `404.html` (fallback da SPA), `robots.txt`, `sitemap.xml` e a imagem de compartilhamento `og-image.png`.

Para voltar à versão antiga: reverter a `main` para a tag `site-antigo` e, em Settings → Pages, trocar a origem para "Deploy from a branch".
