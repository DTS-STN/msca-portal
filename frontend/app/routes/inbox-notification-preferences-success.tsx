import type { RouteHandle } from 'react-router';

import { useTranslation } from 'react-i18next';

import type { Route } from './+types/inbox-notification-preferences-success';

import { requireAuth } from '~/.server/utils/auth-utils';
import { ButtonLink } from '~/components/button-link';
import { ContextualAlert } from '~/components/contextual-alert';
import { PageTitle } from '~/components/page-title';
import { AppError } from '~/errors/app-error';
import { ErrorCodes } from '~/errors/error-codes';
import { getTranslation } from '~/i18n-config.server';
import { handle as parentHandle } from '~/routes/layout';

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

  if (!userinfoTokenClaims.sin) {
    throw new AppError('No SIN found in userinfo token', ErrorCodes.MISSING_SIN);
  }

  return { documentTitle: t('inboxNotificationPreferencesSuccess:document-title') };
}

export function meta({ data }: Route.MetaArgs) {
  return [{ title: data.documentTitle }];
}

const aaPrefix = 'ESDC-EDSC_MSCA-MSDC-SCH:Inbox notification preferences saved:';

export default function InboxNotificationPreferencesSuccess({ loaderData, params }: Route.ComponentProps) {
  const { t } = useTranslation(handle.i18nNamespace);

  return (
    <>
      <div className="mb-8">
        <PageTitle className="after:w-14">{t('inboxNotificationPreferencesSuccess:page-title')}</PageTitle>
      </div>
      <ContextualAlert type={'success'}>
        <div className="font-lato text-2xl font-bold">{t('inboxNotificationPreferencesSuccess:preferences-saved-message')}</div>
      </ContextualAlert>
      <div className="flex items-center justify-start gap-6 py-8">
        <ButtonLink
          file="routes/inbox-notification-preferences.tsx"
          variant="alternative"
          className="border-blue-default text-blue-default rounded border-2 bg-white"
          size="custom"
          data-gc-analytics-customclick={aaPrefix + 'task-back-inbox-notification-preferences'}
        >
          {t('inboxNotificationPreferencesSuccess:inbox-back-button')}
        </ButtonLink>
        <ButtonLink
          file="routes/my-dashboard.tsx"
          variant="primary"
          size="custom"
          className="border-0 py-2"
          data-gc-analytics-customclick={aaPrefix + 'tasks-go-to-my-dashboard'}
        >
          {t('inboxNotificationPreferencesSuccess:inbox-dashboard-button')}
        </ButtonLink>
      </div>
    </>
  );
}
