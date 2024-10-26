import { useEffect, useState, ReactNode } from "react";
import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { useActiveLocale } from "hooks/useActiveLocale";
import { SupportedLocale } from "constants/locales";

async function dynamicActivate(locale: SupportedLocale) {
  const { messages } = await import(`./locales/${locale}.js`);
  i18n.load(locale, messages);
  i18n.activate(locale);
}

export interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const locale = useActiveLocale();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    dynamicActivate(locale)
      .then(() => {
        setLoaded(true);
      })
      .catch((error) => {
        console.error("Failed to activate locale", locale, error);
      });
  }, [locale]);

  return loaded ? <I18nProvider i18n={i18n}>{children}</I18nProvider> : null;
}
