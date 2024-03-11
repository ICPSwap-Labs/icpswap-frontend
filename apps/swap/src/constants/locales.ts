export const SUPPORTED_LOCALES = [
  // order as they appear in the language dropdown
  "en-US",
  "zh-CN",
  "zh-TW",
  "vi-VN",
  "ja-JP",
  "ko-KR",
  "it-IT",
  "es-ES",
] as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: SupportedLocale = "en-US";

export const LOCALE_LABEL: { [locale in SupportedLocale]: string } = {
  "en-US": "English",
  "ja-JP": "日本語",
  "ko-KR": "한국어",
  "vi-VN": "Tiếng Việt",
  "zh-CN": "简体中文",
  "zh-TW": "繁体中文",
  "it-IT": "Italiano",
  "es-ES": "Español",
  // 'af-ZA': 'Afrikaans',
  // 'ar-SA': 'العربية',
  // 'ca-ES': 'Català',
  // 'cs-CZ': 'čeština',
  // 'da-DK': 'dansk',
  // 'de-DE': 'Deutsch',
  // 'el-GR': 'ελληνικά',
  // 'en-US': 'English',

  // 'fi-FI': 'Suomalainen',
  // 'fr-FR': 'français',
  // 'he-IL': 'עִברִית',
  // 'hu-HU': 'Magyar',
  // 'id-ID': 'bahasa Indonesia',
  // 'ko-KR': '한국어',
  // 'nl-NL': 'Nederlands',
  // 'no-NO': 'norsk',
  // 'pl-PL': 'Polskie',
  // 'pt-BR': 'português',
  // 'pt-PT': 'português',
  // 'ro-RO': 'Română',
  // 'ru-RU': 'русский',
  // 'sr-SP': 'Српски',
  // 'sv-SE': 'svenska',
  // 'tr-TR': 'Türkçe',
  // 'uk-UA': 'Український',
};

export const getLocalLabel = (local: SupportedLocale) => {
  return LOCALE_LABEL[local];
};
