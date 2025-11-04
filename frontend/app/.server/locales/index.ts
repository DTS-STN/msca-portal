import appEn from '~/.server/locales/en/app.json';
import contactUsEiEn from '~/.server/locales/en/contact-us-ei.json';
import contactUsEn from '~/.server/locales/en/contact-us.json';
import errorsEn from '~/.server/locales/en/errors.json';
import gcwebEn from '~/.server/locales/en/gcweb.json';
import inboxNotificationPreferencesSuccessEn from '~/.server/locales/en/inbox-notification-preferences-success.json';
import inboxNotificationPreferencesEn from '~/.server/locales/en/inbox-notification-preferences.json';
import inboxNowAvailableEn from '~/.server/locales/en/inbox-now-available.json';
import inboxEn from '~/.server/locales/en/inbox.json';
import securitySettingsEn from '~/.server/locales/en/security-settings.json';
import appFr from '~/.server/locales/fr/app.json';
import contactUsEiFr from '~/.server/locales/fr/contact-us-ei.json';
import contactUsFr from '~/.server/locales/fr/contact-us.json';
import errorsFr from '~/.server/locales/fr/errors.json';
import gcwebFr from '~/.server/locales/fr/gcweb.json';
import inboxNotificationPreferencesSuccessFr from '~/.server/locales/fr/inbox-notification-preferences-success.json';
import inboxNotificationPreferencesFr from '~/.server/locales/fr/inbox-notification-preferences.json';
import inboxNowAvailableFr from '~/.server/locales/fr/inbox-now-available.json';
import inboxFr from '~/.server/locales/fr/inbox.json';
import securitySettingsFr from '~/.server/locales/fr/security-settings.json';

export const i18nResourcesEn = {
  inbox: inboxEn,
  gcweb: gcwebEn,
  app: appEn,
  error: errorsEn,
  inboxNowAvailable: inboxNowAvailableEn,
  inboxNotificationPreferences: inboxNotificationPreferencesEn,
  inboxNotificationPreferencesSuccess: inboxNotificationPreferencesSuccessEn,
  contactUs: contactUsEn,
  contactUsEi: contactUsEiEn,
  securitySettings: securitySettingsEn,
} as const;

export const i18nResourcesFr = {
  inbox: inboxFr,
  gcweb: gcwebFr,
  app: appFr,
  error: errorsFr,
  inboxNowAvailable: inboxNowAvailableFr,
  inboxNotificationPreferences: inboxNotificationPreferencesFr,
  inboxNotificationPreferencesSuccess: inboxNotificationPreferencesSuccessFr,
  contactUs: contactUsFr,
  contactUsEi: contactUsEiFr,
  securitySettings: securitySettingsFr,
} as const;

export const i18nResources = {
  en: i18nResourcesEn,
  fr: i18nResourcesFr,
} as const satisfies Record<Language, typeof i18nResourcesEn>;

export type I18nResources = typeof i18nResources;
