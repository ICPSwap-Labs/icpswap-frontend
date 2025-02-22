import i18n from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { initReactI18next } from "react-i18next";

import { Locale } from "./constants";
import enUsLocale from "./locales/source/en-US.json";

let isSetup = false;

setupI18n();

export function setupI18n(): undefined {
  if (isSetup) {
    return;
  }
  isSetup = true;

  i18n
    .use(initReactI18next)
    .use(
      resourcesToBackend((locale: string) => {
        // not sure why but it tries to load es THEN es-ES, for any language, but we just want the second
        if (!locale.includes("-")) {
          return undefined;
        }

        if (locale === Locale.EnglishUnitedStates) {
          return enUsLocale;
        }

        const localeNameToFileNameOverrides: Record<string, string> = {
          [Locale.ChineseSimplified]: "zh-CN",
          [Locale.ChineseTraditional]: "zh-TW",
          [Locale.SpanishLatam]: Locale.SpanishSpain,
          [Locale.SpanishUnitedStates]: Locale.SpanishSpain,
        };

        if (Object.keys(localeNameToFileNameOverrides).includes(locale)) {
          return import(`./locales/translations/${localeNameToFileNameOverrides[locale]}.json`);
        }

        return import(`./locales/translations/${locale}.json`);
      }),
    )
    .on("failedLoading", (language, namespace, msg) => {
      console.error(new Error(`Error loading language ${language} ${namespace}: ${msg}`), {
        tags: {
          file: "i18n",
          function: "onFailedLoading",
        },
      });
    });

  i18n
    .init({
      react: {
        useSuspense: false,
      },
      returnEmptyString: false,
      keySeparator: false,
      lng: "en-US",
      fallbackLng: "en-US",
      interpolation: {
        escapeValue: false, // react already safes from xss
      },
    })
    .catch((err) => {
      console.error(new Error(`Error initializing i18n ${err}`), {
        tags: {
          file: "i18n",
          function: "onFailedInit",
        },
      });
    });

  // add default english translations right away
  i18n.addResourceBundle("en-US", "translations", {
    "en-US": {
      translation: enUsLocale,
    },
  });

  i18n.changeLanguage("en-US").catch((err) => {
    console.error(new Error(`${err}`), {
      tags: {
        file: "i18n",
        function: "setupi18n",
      },
    });
  });
}
