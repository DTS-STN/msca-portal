import type { RouteHandle } from 'react-router';

import { useTranslation } from 'react-i18next';

import type { Route } from './+types/inbox-now-available';

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

  return { documentTitle: t('inboxNowAvailable:document-title'), MSCA_BASE_URL };
}

export function meta({ data }: Route.MetaArgs) {
  return [{ title: data.documentTitle }];
}

export default function InboxNowAvailable({ loaderData, params }: Route.ComponentProps) {
  const { t } = useTranslation(handle.i18nNamespace);
  const { MSCA_BASE_URL } = loaderData;

  return (
    <>
      <div className="max-w-3xl">
        <div className="mb-8 max-w-3xl">
          <PageTitle className="after:w-14">{t('inboxNowAvailable:page-title')}</PageTitle>
        </div>

        <div className="text-gray-darker text-xl">
          <p className="pb-4">{t('inboxNowAvailable:new-inbox-para-1')}</p>
          <p className="pb-4">{t('inboxNowAvailable:new-inbox-para-2')}</p>
        </div>

        <ButtonLink
          to={t('gcweb:app.menu-dashboard.href', { baseUri: MSCA_BASE_URL })}
          variant="primary"
          size="custom"
          className="border-0"
        >
          {t('inboxNowAvailable:inbox-pref-button')}
        </ButtonLink>
      </div>
    </>
  );
}
