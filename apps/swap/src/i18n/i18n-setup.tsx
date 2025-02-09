import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enUS from "./locales/source/en-US.json";

import { MissingI18nInterpolationError } from "./shared";

import "./locales/@types/i18next";

const resources = {
  "en-US": { translation: enUS },
};

const defaultNS = "translation";

i18n
  .use(initReactI18next)
  .init({
    defaultNS,
    lng: "en-US",
    fallbackLng: "en-US",
    resources,
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    react: {
      transSupportBasicHtmlNodes: false, // disabling since this breaks for mobile
    },
    missingInterpolationHandler: (text) => {
      console.error(new MissingI18nInterpolationError(`Missing i18n interpolation value: ${text}`), {
        tags: {
          file: "i18n.ts",
          function: "init",
        },
      });
      return ""; // Using empty string for missing interpolation
    },
  })
  .catch(() => undefined);

i18n.on("missingKey", (_lngs, _ns, key, _res) => {
  console.error(new Error(`Missing i18n string key ${key} for language ${i18n.language}`), {
    tags: {
      file: "i18n.ts",
      function: "onMissingKey",
    },
  });
});
