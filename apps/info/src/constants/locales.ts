export const SUPPORTED_LOCALES = [
  // order as they appear in the language dropdown
  "en-US",
  "ja-JP",
  "ko-KR",
  "vi-VN",
  "zh-CN",
  "zh-TW",
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
};
