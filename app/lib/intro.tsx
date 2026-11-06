import { createContext, useContext, useState, type ReactNode } from "react";

// Coordena o preloader com a entrada do Hero: o Hero só anima
// depois que a cortina do preloader termina de subir.
type IntroState = { ready: boolean; setReady: (v: boolean) => void };

const IntroContext = createContext<IntroState>({ ready: false, setReady: () => {} });

export function IntroProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  return <IntroContext.Provider value={{ ready, setReady }}>{children}</IntroContext.Provider>;
}

export const useIntro = () => useContext(IntroContext);

export const INTRO_SEEN_KEY = "mb:intro-seen";
