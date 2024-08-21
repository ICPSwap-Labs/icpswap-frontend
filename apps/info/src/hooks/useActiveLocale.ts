import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "constants/locales";
import { useMemo } from "react";
import { useUserLocale } from "store/global/hooks";

function parseLocale(maybeSupportedLocale: string) {
  const lowerMaybeSupportedLocale = maybeSupportedLocale.toLowerCase();
  return SUPPORTED_LOCALES.find(
    (locale) =>
      locale.toLowerCase() === lowerMaybeSupportedLocale || locale.split("-")[0] === lowerMaybeSupportedLocale,
  );
}

export function navigatorLocale() {
  if (!navigator.language) return undefined;

  const [language, region] = navigator.language.split("-");

  if (region) {
    return parseLocale(`${language}-${region.toUpperCase()}`) ?? parseLocale(language);
  }

  return parseLocale(language);
}

export function useActiveLocale() {
  const userLocale = useUserLocale();

  return useMemo(() => {
    return userLocale ?? navigatorLocale() ?? DEFAULT_LOCALE;
  }, [userLocale]);
}
