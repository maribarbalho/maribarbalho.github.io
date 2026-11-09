import { useEffect, useState } from "react";

export const THEME_KEY = "mb:theme";
type Theme = "dark" | "light";

const THEME_COLOR: Record<Theme, string> = { dark: "#03070D", light: "#FFFFFF" };

function applyTheme(theme: Theme) {
  const html = document.documentElement;
  html.classList.add("theme-switching");
  if (theme === "light") html.setAttribute("data-theme", "light");
  else html.removeAttribute("data-theme");
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLOR[theme]);
  window.setTimeout(() => html.classList.remove("theme-switching"), 500);
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    /* armazenamento indisponível: o tema vale só nesta visita */
  }
}

/** Botão que alterna entre o tema escuro (padrão) e o claro. */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>("dark");

  // O tema real já foi aplicado pelo script de boot; aqui só sincroniza o estado.
  useEffect(() => {
    setTheme(document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark");
  }, []);

  const next: Theme = theme === "dark" ? "light" : "dark";
  const label = next === "light" ? "Ativar tema claro" : "Ativar tema escuro";

  return (
    <button
      type="button"
      onClick={() => {
        applyTheme(next);
        setTheme(next);
      }}
      aria-label={label}
      title={label}
      className={`group grid size-9 place-items-center rounded-full border border-line bg-abyss/40 text-white backdrop-blur transition-colors duration-300 hover:border-sky ${className}`}
    >
      {/* Sol no tema escuro (ação: clarear); lua no claro (ação: escurecer). */}
      <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4 transition-transform duration-500 group-hover:rotate-45">
        {theme === "dark" ? (
          <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <circle cx="12" cy="12" r="4.2" />
            <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6" />
          </g>
        ) : (
          <path fill="currentColor" d="M20.5 14.6A8.5 8.5 0 0 1 9.4 3.5a.6.6 0 0 0-.8-.7A9.5 9.5 0 1 0 21.2 15.4a.6.6 0 0 0-.7-.8Z" />
        )}
      </svg>
    </button>
  );
}
