import type Lenis from "lenis";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { useLocation } from "react-router";
import { navigation, profile } from "~/content/profile";
import { ScrollTrigger, gsap, prefersReducedMotion, useGSAP } from "~/lib/gsap";
import { useIntro } from "~/lib/intro";
import { ThemeToggle } from "./ThemeToggle";
import { scrollToTarget } from "~/lib/scroll";

const getLenis = () => (window as unknown as { __lenis?: Lenis }).__lenis;

/**
 * Navegação fixa e minimalista. Some ao rolar para baixo e volta ao
 * rolar para cima. No mobile vira um menu em tela cheia.
 *
 * O menu mobile fica FORA do <header>: o header recebe transform (para
 * sumir ao rolar), e um elemento `position: fixed` dentro de um ancestral
 * com transform deixa de cobrir a tela inteira.
 */
export function Header() {
  const ref = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const { ready } = useIntro();
  // Fora da home, os links de seção apontam para "/#secao".
  const isHome = useLocation().pathname === "/";
  const base = isHome ? "" : "/";

  useGSAP(
    () => {
      if (!ready || !ref.current) return;
      const el = ref.current;

      if (prefersReducedMotion()) {
        gsap.set(el, { autoAlpha: 1 });
      } else {
        gsap.fromTo(el, { autoAlpha: 0, yPercent: -40 }, { autoAlpha: 1, yPercent: 0, duration: 1, delay: 0.9 });
      }

      const show = gsap.quickTo(el, "yPercent", { duration: 0.5, ease: "power3.out" });
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          if (self.scroll() < 120) return show(0);
          show(self.direction === 1 ? -110 : 0);
        },
      });
    },
    { dependencies: [ready], scope: ref },
  );

  // Menu aberto: trava a rolagem, garante o header visível, foca o primeiro
  // link e fecha com Esc. Ao fechar, devolve o foco ao botão.
  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    html.style.overflow = "hidden";
    getLenis()?.stop();
    if (ref.current) gsap.set(ref.current, { yPercent: 0 });
    const focusId = window.setTimeout(() => menuRef.current?.querySelector("a")?.focus(), 60);

    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(focusId);
      window.removeEventListener("keydown", onKey);
      html.style.overflow = "";
      getLenis()?.start();
      toggleRef.current?.focus({ preventScroll: true });
    };
  }, [open]);

  // Fecha o menu ao trocar de página.
  const { pathname } = useLocation();
  useEffect(() => setOpen(false), [pathname]);

  const onMenuLink = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!isHome) return setOpen(false); // navegação normal para "/#secao"
    e.preventDefault();
    setOpen(false);
    // Espera o menu liberar a rolagem antes de rolar até a seção.
    requestAnimationFrame(() => requestAnimationFrame(() => scrollToTarget(href, false)));
    history.replaceState(null, "", href);
  };

  return (
    <>
      <header ref={ref} data-intro className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-10 md:pt-6">
        <div className="flex items-center justify-between">
          <a href={base ? "/" : "#topo"} className="group flex items-center gap-3" aria-label={`${profile.name}, início`}>
            <span className="grid size-9 place-items-center rounded-full border border-line bg-abyss/40 text-[11px] font-bold tracking-wider text-white backdrop-blur transition-colors duration-300 group-hover:border-sky group-hover:bg-electric">
              MB
            </span>
            <span className="label-mono hidden text-mist sm:inline">{profile.name}</span>
          </a>

          <div className="flex items-center gap-2 md:gap-8">
            <nav aria-label="Principal" className="hidden md:block">
              <ul className="flex items-center gap-8">
                {navigation.map((item) => (
                  <li key={item.href}>
                    <a href={base + item.href} className="label-mono link-draw pb-1 text-mist hover:text-white">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <ThemeToggle />

            <button
              ref={toggleRef}
              type="button"
              className="label-mono rounded-full border border-line bg-abyss/40 px-4 py-2 text-white backdrop-blur md:hidden"
              aria-expanded={open}
              aria-controls="menu-mobile"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? "Fechar" : "Menu"}
            </button>
          </div>
        </div>
      </header>

      <nav
        ref={menuRef}
        id="menu-mobile"
        aria-label="Principal (mobile)"
        inert={!open}
        className={`fixed inset-0 z-40 flex flex-col justify-end bg-abyss/97 px-4 pb-10 backdrop-blur-md transition-[opacity,visibility] duration-500 md:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <ul className="space-y-2">
          {navigation.map((item, i) => (
            <li
              key={item.href}
              style={{ transitionDelay: open ? `${80 + i * 50}ms` : "0ms" }}
              className={`border-t border-line pt-2 transition-[opacity,transform] duration-500 ease-[var(--ease-expo)] ${
                open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
            >
              <a
                href={base + item.href}
                onClick={(e) => onMenuLink(e, item.href)}
                className="flex items-baseline justify-between gap-4 py-1 text-[length:clamp(34px,11vw,48px)] font-extrabold text-white [font-stretch:115%]"
              >
                {item.label}
                <span className="label-mono">0{i + 2}</span>
              </a>
            </li>
          ))}
        </ul>
        <a
          href={`mailto:${profile.contact.email}`}
          className="label-mono mt-10 break-all text-mist"
        >
          {profile.contact.email}
        </a>
      </nav>
    </>
  );
}
