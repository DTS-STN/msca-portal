import appEn from '~/.server/locales/en/app.json';
import appFr from '~/.server/locales/fr/app.json';
import gcwebEn from '~/.server/locales/en/gcweb.json';
import gcwebFr from '~/.server/locales/fr/gcweb.json';
import inboxEn from '~/.server/locales/en/inbox.json';
import inboxFr from '~/.server/locales/fr/inbox.json';

export const i18nResourcesEn = {
  inbox: inboxEn,
  gcweb: gcwebEn,
  app: appEn,
} as const;

export const i18nResourcesFr = {
  inbox: inboxFr,
  gcweb: gcwebFr,
  app: appFr,
} as const;

export const i18nResources = {
  en: i18nResourcesEn,
  fr: i18nResourcesFr,
} as const satisfies Record<Language, typeof i18nResourcesEn>;

export type I18nResources = typeof i18nResources;
