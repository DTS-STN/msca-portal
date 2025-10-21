import appEn from '~/.server/locales/en/app.json';
import appFr from '~/.server/locales/fr/app.json';
import gcwebEn from '~/.server/locales/en/gcweb.json';
import gcwebFr from '~/.server/locales/fr/gcweb.json';

export const i18nResourcesEn = {
  gcweb: gcwebEn,
  app: appEn,
} as const;

export const i18nResourcesFr = {
  gcweb: gcwebFr,
  app: appFr,
} as const;

export const i18nResources = {
  en: i18nResourcesEn,
  fr: i18nResourcesFr,
} as const satisfies Record<Language, typeof i18nResourcesEn>;

export type I18nResources = typeof i18nResources;
