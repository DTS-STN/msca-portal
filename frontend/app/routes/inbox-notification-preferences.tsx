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
  return [{ title: data?.documentTitle }];
}

export default function InboxNotificationPreferences({ loaderData, params }: Route.ComponentProps) {
  const { t } = useTranslation(handle.i18nNamespace);
  const { MSCA_BASE_URL } = loaderData;

  return (
    <>
      <div className="mb-8">
        <PageTitle className="after:w-14">{t('inboxNotificationPreferences:page-title')}</PageTitle>
      </div>
      <ul className="mt-8 w-full max-w-3xl">{t('inboxNotificationPreferences:text1')}</ul>
      <div className="flex items-center justify-start gap-6 py-8">
        <ButtonLink to={t('gcweb:app.inbox-notification-preferences.href', { baseUri: MSCA_BASE_URL })}>
          {t('inboxNotificationPreferences:text2')}
        </ButtonLink>
        <ButtonLink to={t('gcweb:app.menu-dashboard.href', { baseUri: MSCA_BASE_URL })}>
          {t('inboxNotificationPreferences:text3')}
        </ButtonLink>
      </div>
    </>
  );
}
