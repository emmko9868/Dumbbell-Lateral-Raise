"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { translations, type Locale, type Translations } from "./translations";

interface LangContextValue {
  locale: Locale;
  t: Translations;
  setLocale: (l: Locale) => void;
}

const LangContext = createContext<LangContextValue>({
  locale: "ko",
  t: translations.ko,
  setLocale: () => {},
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("ko");

  useEffect(() => {
    const saved = localStorage.getItem("locale") as Locale | null;
    if (saved === "ko" || saved === "zh-TW") setLocaleState(saved);
  }, []);

  function setLocale(l: Locale) {
    setLocaleState(l);
    localStorage.setItem("locale", l);
  }

  return (
    <LangContext.Provider value={{ locale, t: translations[locale], setLocale }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
