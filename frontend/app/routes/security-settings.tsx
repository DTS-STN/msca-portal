import type { RouteHandle } from 'react-router';

import { useTranslation } from 'react-i18next';

import type { Route } from './+types/security-settings';

import { requireAuth } from '~/.server/utils/auth-utils';
import { InlineLink } from '~/components/links';
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

  const { ECAS_BASE_URL } = globalThis.__appEnvironment;

  if (!userinfoTokenClaims.sin) {
    throw new AppError('No SIN found in userinfo token', ErrorCodes.MISSING_SIN);
  }

  return { documentTitle: t('securitySettings:document-title'), ECAS_BASE_URL };
}

export function meta({ data }: Route.MetaArgs) {
  return [{ title: data.documentTitle }];
}

const aaPrefix = 'ESDC-EDSC_MSCA-MSDC-SCH:Security settings:';

export default function SecuritySettings({ loaderData, params }: Route.ComponentProps) {
  const { t } = useTranslation(handle.i18nNamespace);
  const { ECAS_BASE_URL } = loaderData;

  return (
    <>
      <div className="max-w-3xl">
        <div className="mb-8">
          <PageTitle className="after:w-14">{t('securitySettings:page-title')}</PageTitle>
        </div>

        <div className="text-gray-darker text-xl">
          <p className="mt-3 mb-8">{t('securitySettings:part-1')}</p>
          <InlineLink
            to={t('securitySettings:security-questions.href', { baseUri: ECAS_BASE_URL })}
            data-gc-analytics-customclick={aaPrefix + 'securityQuestionsLink'}
          >
            {t('securitySettings:security-questions')}
          </InlineLink>
          <p className="mb-8">{t('securitySettings:part-2')}</p>
        </div>
      </div>
    </>
  );
}
