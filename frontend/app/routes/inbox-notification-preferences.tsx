import type { RouteHandle } from 'react-router';

import { useTranslation } from 'react-i18next';

import type { Route } from './+types/inbox-notification-preferences';

import { requireAuth } from '~/.server/utils/auth-utils';
import { ButtonLink } from '~/components/button-link';
import { PageTitle } from '~/components/page-title';
import { AppError } from '~/errors/app-error';
import { ErrorCodes } from '~/errors/error-codes';
import { getTranslation } from '~/i18n-config.server';
import { handle as parentHandle } from '~/routes/layout';

export const handle = {
  i18nNamespace: [...parentHandle.i18nNamespace],
} as const satisfies RouteHandle;

export async function loader({ context, params, request }: Route.LoaderArgs) {
  const { userinfoTokenClaims } = await requireAuth(context.session, request);
  const { t } = await getTranslation(request, handle.i18nNamespace);

  const { MSCA_BASE_URL } = globalThis.__appEnvironment;

  if (!userinfoTokenClaims.sin) {
    throw new AppError('No SIN found in userinfo token', ErrorCodes.MISSING_SIN);
  }

  return { documentTitle: t('inboxNotificationPreferences:page-title'), MSCA_BASE_URL };
}

export function meta({ data }: Route.MetaArgs) {
  return [{ title: data.documentTitle }];
}

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {};

export default function InboxNotificationPreferences({ loaderData, params }: Route.ComponentProps) {
  const { t } = useTranslation(handle.i18nNamespace);
  const { MSCA_BASE_URL } = loaderData;

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

      <form>
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
                onChange={handleChange}
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
                onChange={handleChange}
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
          <ButtonLink to={t('gcweb:app.inbox-notification-preferences-success.href', { baseUri: MSCA_BASE_URL })}>
            {t('inboxNotificationPreferences:save-preferences-button')}
          </ButtonLink>
        </fieldset>
      </form>
    </>
  );
}
