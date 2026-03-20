/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import "i18next";

const en = (await import("../source/en-US.json")).default as Record<string, string>;

const resources = {
  translation: en,
} as const;

declare module "i18next" {
  interface CustomTypeOptions {
    resources: typeof resources;
  }
}
