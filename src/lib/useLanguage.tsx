"use client";

import {
  createContext,
  useContext,
  useCallback,
  ReactNode,
} from "react";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/src/i18n/routing";
import { translations, Lang, TranslationKey } from "@/src/lib/translations";

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  // Use next-intl as the single source of truth for language
  const locale = useLocale() as Lang;
  const router = useRouter();
  const pathname = usePathname();

  const setLang = useCallback((newLang: Lang) => {
    router.replace(pathname, { locale: newLang });
  }, [router, pathname]);

  const t = useCallback(
    (key: TranslationKey): string => {
      // Safely fallback if language is unsupported or key is missing
      const currentTranslations = translations[locale] || translations.en;
      return currentTranslations[key] ?? key;
    },
    [locale]
  );

  return (
    <LanguageContext.Provider value={{ lang: locale, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used inside <LanguageProvider>");
  }
  return ctx;
}
