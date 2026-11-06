import { useRef, useState } from "react";
import { navigation, profile } from "~/content/profile";
import { ScrollTrigger, gsap, prefersReducedMotion, useGSAP } from "~/lib/gsap";
import { useIntro } from "~/lib/intro";

/**
 * Navegação fixa e minimalista. Some ao rolar para baixo e volta ao
 * rolar para cima. No mobile vira um menu em tela cheia.
 */
export function Header() {
  const ref = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const { ready } = useIntro();

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

  return (
    <header
      ref={ref}
      data-intro
      className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-10 md:pt-6"
    >
      <div className="flex items-center justify-between">
        <a href="#topo" className="group flex items-center gap-3" aria-label={`${profile.name}, início`}>
          <span className="grid size-9 place-items-center rounded-full border border-line text-[11px] font-bold tracking-wider text-white transition-colors duration-300 group-hover:border-sky group-hover:bg-electric">
            MB
          </span>
          <span className="label-mono hidden text-mist sm:inline">{profile.name}</span>
        </a>

        <nav aria-label="Principal" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {navigation.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="label-mono link-draw pb-1 text-mist hover:text-white">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          className="label-mono rounded-full border border-line px-4 py-2 text-white md:hidden"
          aria-expanded={open}
          aria-controls="menu-mobile"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Fechar" : "Menu"}
        </button>
      </div>

      <nav
        id="menu-mobile"
        aria-label="Principal (mobile)"
        className={`fixed inset-0 -z-10 flex flex-col justify-end bg-abyss/97 px-4 pb-10 backdrop-blur transition-[opacity,visibility] duration-500 md:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <ul className="space-y-2">
          {navigation.map((item, i) => (
            <li key={item.href} className="border-t border-line pt-2">
              <a
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-baseline justify-between text-5xl font-extrabold text-white [font-stretch:115%]"
              >
                {item.label}
                <span className="label-mono">0{i + 2}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
