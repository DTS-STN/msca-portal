import { redirect } from 'react-router';
import type { RouteHandle } from 'react-router';

import { useTranslation } from 'react-i18next';

import type { Route } from './+types/inbox-notification-preferences';

import { getInboxPrefService } from '~/.server/domain/services/inbox-preference.service';
import { serverEnvironment } from '~/.server/environment';
import { requireAuth } from '~/.server/utils/auth-utils';
import { Button } from '~/components/button';
import { PageTitle } from '~/components/page-title';
import { AppError } from '~/errors/app-error';
import { ErrorCodes } from '~/errors/error-codes';
import { getTranslation } from '~/i18n-config.server';
import { handle as parentHandle } from '~/routes/layout';
import * as adobeAnalytics from '~/utils/adobe-analytics.client';
import { getLanguage } from '~/utils/i18n-utils';
import { getPathById } from '~/utils/route-utils';

export const handle = {
  breadcrumbs: [
    { labelI18nKey: 'gcweb:breadcrumbs.dashboard', routeId: 'my-dashboard' },
    { labelI18nKey: 'gcweb:breadcrumbs.profile-and-preferences', routeId: 'profile-and-preferences' },
  ],
  i18nNamespace: [...parentHandle.i18nNamespace],
} as const satisfies RouteHandle;

export async function loader({ context, params, request }: Route.LoaderArgs) {
  const { userinfoTokenClaims } = await requireAuth(request);
  const { t } = await getTranslation(request, handle.i18nNamespace);
  const inboxPrefService = getInboxPrefService();

  if (!userinfoTokenClaims.sin) {
    throw new AppError('No SIN found in userinfo token', ErrorCodes.MISSING_SIN);
  }

  const spid = userinfoTokenClaims.sub;
  const resp = await inboxPrefService.getInboxPre(spid);
  const paperless = resp.subscribedEvents.length === 0 || resp.subscribedEvents[0]?.eventTypeCode === 'PAPERLESS';

  return { documentTitle: t('inboxNotificationPreferences:page-title'), paperless };
}

export function meta({ loaderData }: Route.MetaArgs) {
  return [{ title: loaderData.documentTitle }];
}

export async function action({ context, params, request }: Route.ActionArgs) {
  const { userinfoTokenClaims } = await requireAuth(request);
  const lang = getLanguage(request) ?? '';
  const inboxPrefService = getInboxPrefService();

  const spid = userinfoTokenClaims.sub;
  const formData = await request.formData();
  const pref = formData.get('email-radio') === 'no' ? 'no' : 'yes';

  if (serverEnvironment.isProduction === true) {
    await inboxPrefService.setInboxPref(spid, pref);
  }

  const aaPrefix = 'ESDC-EDSC_MSCA-MSDC-SCH:Inbox notification preferences';

  function convertFormValueToFormPreference(formValue: string) {
    if (formValue === 'no') {
      return 'radio:email-preference:Paper mail';
    } else {
      return 'radio:email-preference:Email notification only';
    }
  }

  function aaPushSubmit(aaValue: string) {
    adobeAnalytics.pushFormSubmissionEvent(aaValue, aaPrefix);
  }

  if (globalThis.__appEnvironment.ADOBE_ANALYTICS_SRC) {
    aaPushSubmit(convertFormValueToFormPreference(pref));
  }
  return redirect(getPathById('inbox-notification-preferences-success', { lang }));
}

export default function InboxNotificationPreferences({ loaderData, params }: Route.ComponentProps) {
  const { t } = useTranslation(handle.i18nNamespace);
  const { paperless } = loaderData;

  return (
    <>
      <div className="mb-8">
        <PageTitle className="after:w-14">{t('inboxNotificationPreferences:page-title')}</PageTitle>
      </div>
      <p className="mt-8 w-full max-w-3xl text-xl">{t('inboxNotificationPreferences:intro-text-first')}</p>
      <p className="mt-8 w-full max-w-3xl text-xl">{t('inboxNotificationPreferences:intro-text-second')}</p>
      <h2 className="font-lato text-gray-750 py-2 text-4xl font-semibold md:mt-2 md:py-4">
        {t('inboxNotificationPreferences:debt-statements-heading')}
      </h2>
      <p className="mt-8 w-full max-w-3xl text-xl">{t('inboxNotificationPreferences:debt-statements-heading-intro-text')}</p>

      <form method="post">
        <fieldset>
          <legend className="text-gray-darker max-w-3xl pt-4 text-lg md:text-xl">
            <strong>{t('inboxNotificationPreferences:debt-statement-question')}</strong>
          </legend>

          <div className="pb-2" />

          <div className="flex flex-col py-8 text-lg md:text-xl">
            <div className="flex flex-row pb-3">
              <input
                type="radio"
                id="yes-email"
                name="email-radio"
                value="yes"
                className="size-[2.5em] shrink-0"
                defaultChecked={paperless}
              />
              <label htmlFor="yes-email" className="grow pl-2">
                <p className="pt-2 font-medium">
                  <strong>{t('inboxNotificationPreferences:debt-statement-email-option')}</strong>
                </p>
                <p className="col-span-6 pt-2 font-medium">
                  {t('inboxNotificationPreferences:debt-statement-email-option-info')}
                </p>
              </label>
            </div>
            <div className="flex flex-row">
              <input
                type="radio"
                id="no-email"
                name="email-radio"
                value="no"
                className="size-[2.5em] shrink-0"
                defaultChecked={!paperless}
              />
              <label htmlFor="no-email" className="grow pl-2">
                <p className="pt-2 font-medium">
                  <strong>{t('inboxNotificationPreferences:debt-statement-paper-mail-option')}</strong>
                </p>
                <p className="col-span-6 pt-2 font-medium">
                  {t('inboxNotificationPreferences:debt-statement-paper-mail-option-info')}
                </p>
              </label>
            </div>
          </div>
          <Button variant="primary">{t('inboxNotificationPreferences:save-preferences-button')}</Button>
        </fieldset>
      </form>
    </>
  );
}
