import type { RouteHandle } from 'react-router';

import { Trans, useTranslation } from 'react-i18next';

import type { Route } from './+types/decision-reviews';

import { requireAuth } from '~/.server/utils/auth-utils';
import { ButtonLink } from '~/components/button-link';
import { PageTitle } from '~/components/page-title';
import { AppError } from '~/errors/app-error';
import { ErrorCodes } from '~/errors/error-codes';
import { getTranslation } from '~/i18n-config.server';
import { handle as parentHandle } from '~/routes/layout';

export const handle = {
  breadcrumbs: [{ labelI18nKey: 'gcweb:breadcrumbs.dashboard', routeId: 'my-dashboard' }],
  i18nNamespace: [...parentHandle.i18nNamespace],
} as const satisfies RouteHandle;

export async function loader({ context, params, request }: Route.LoaderArgs) {
  const { userinfoTokenClaims } = await requireAuth(request);
  const { t } = await getTranslation(request, handle.i18nNamespace);

  const { MSCA_BASE_URL } = globalThis.__appEnvironment;

  if (!userinfoTokenClaims.sin) {
    throw new AppError('No SIN found in userinfo token', ErrorCodes.MISSING_SIN);
  }

  return { documentTitle: t('decisionReviews:document-title'), MSCA_BASE_URL };
}

export function meta({ data }: Route.MetaArgs) {
  return [{ title: data.documentTitle }];
}

const pStyle = 'mb-10 text-gray-darker';
const stepStyle = 'pb-2 font-display text-[34px] font-bold text-gray-darker md:text-[38px] mb-2';

export default function SecuritySettings({ loaderData, params }: Route.ComponentProps) {
  const { t } = useTranslation(handle.i18nNamespace);
  const { MSCA_BASE_URL } = loaderData;
  const aaPrefix = 'ESDC-EDSC_MSCA-MSDC-SCH:Request a review of a decision:decision-review-appeal-to-sst';

  return (
    <>
      <div className="max-w-3xl">
        <div className="mb-8">
          <PageTitle className="after:w-14">{t('decisionReviews:page-title')}</PageTitle>
        </div>

        <h1 className={stepStyle}>{t('decisionReviews:recon')}</h1>
        <p className={pStyle}>{t('decisionReviews:recon.1')}</p>
        <p className={pStyle}>
          <Trans i18nKey={'decisionReviews:recon.2'} components={{ bold: <strong /> }} />
        </p>
        <p className={pStyle}>{t('decisionReviews:recon.3')}</p>
        <ButtonLink
          variant="primary"
          size="custom"
          className="border-0"
          to={t('decisionReviews:recon.button.href', { baseUri: MSCA_BASE_URL })}
          data-gc-analytics-customclick={aaPrefix + 'decision-review-ask-service-canada'}
        >
          {t('decisionReviews:recon.button')}
        </ButtonLink>

        <h1 className={stepStyle + ' mt-10'}>{t('decisionReviews:sst')}</h1>
        <p className={pStyle}>{t('decisionReviews:sst.1')}</p>
        <p className={pStyle}>
          <Trans i18nKey={'decisionReviews:sst.2'} components={{ bold: <strong /> }} />
        </p>
        <p className={pStyle}>{t('decisionReviews:sst.3')}</p>
        <ButtonLink
          variant="primary"
          size="custom"
          className="border-0"
          to={t('decisionReviews:sst.button.href', { baseUri: MSCA_BASE_URL })}
          data-gc-analytics-customclick={aaPrefix + 'decision-review-appeal-to-sst'}
        >
          {t('decisionReviews:sst.button')}
        </ButtonLink>
      </div>
    </>
  );
}
