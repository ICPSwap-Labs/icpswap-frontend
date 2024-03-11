import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "constants/locales";
import { useMemo } from "react";
import { useUserLocale } from "store/global/hooks";
// import useParsedQueryString from "./useParsedQueryString";

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

// export function useSetLocaleFromUrl() {
//   const parsed = useParsedQueryString();
//   const [userLocale, setUserLocale] = useUserLocaleManager();

//   useEffect(() => {
//     const urlLocale =
//       typeof parsed.lng === "string" ? parseLocale(parsed.lng) : undefined;
//     if (urlLocale && urlLocale !== userLocale) {
//       setUserLocale(urlLocale);
//     }
//   }, [parsed.lng, setUserLocale, userLocale]);
// }

export function useActiveLocale() {
  const userLocale = useUserLocale();

  return useMemo(() => {
    return userLocale ?? navigatorLocale() ?? DEFAULT_LOCALE;
  }, [userLocale]);
}
