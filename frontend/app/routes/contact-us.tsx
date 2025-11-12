import type { RouteHandle } from 'react-router';

import { useTranslation } from 'react-i18next';

import type { Route } from './+types/contact-us';

import { requireAuth } from '~/.server/utils/auth-utils';
import { InlineLink } from '~/components/links';
import { PageTitle } from '~/components/page-title';
import { AppError } from '~/errors/app-error';
import { ErrorCodes } from '~/errors/error-codes';
import { getTranslation } from '~/i18n-config.server';
import { handle as parentHandle } from '~/routes/layout';

export const handle = {
  breadcrumbs: [{ labelI18nKey: 'gcweb:breadcrumbs.dashboard', to: '/my-dashboard' }],
  i18nNamespace: [...parentHandle.i18nNamespace],
} as const satisfies RouteHandle;

export async function loader({ context, params, request }: Route.LoaderArgs) {
  const { userinfoTokenClaims } = await requireAuth(context.session, request);
  const { t } = await getTranslation(request, handle.i18nNamespace);

  if (!userinfoTokenClaims.sin) {
    throw new AppError('No SIN found in userinfo token', ErrorCodes.MISSING_SIN);
  }

  return { documentTitle: t('contactUs:document-title') };
}

export function meta({ data }: Route.MetaArgs) {
  return [{ title: data.documentTitle }];
}

export default function ContactUs({ loaderData, params }: Route.ComponentProps) {
  const { t } = useTranslation(handle.i18nNamespace);

  return (
    <>
      <div className="max-w-3xl">
        <div className="mb-8">
          <PageTitle className="after:w-14">{t('contactUs:page-title')}</PageTitle>
        </div>

        <p className="text-gray-darker mt-3 mb-8 text-xl">{t('contactUs:select-service')}</p>

        <ul className="list-disc" data-cy="contact-task-list">
          <li className="mb-6 ml-5">
            <InlineLink
              to={t('contactUs:cdcp.href')}
              newTabIndicator={true}
              data-gc-analytics-customclick="ESDC-EDSC_MSCA-MSDC-SCH:Contact Us:Canadian Dental Care Plan"
            >
              {t('contactUs:cdcp')}
            </InlineLink>
          </li>
          <li className="mb-6 ml-5">
            <InlineLink
              file="routes/contact-us/employment-insurance.tsx"
              data-gc-analytics-customclick="ESDC-EDSC_MSCA-MSDC-SCH:Contact Us:Employment Insurance"
            >
              {t('contactUs:ei')}
            </InlineLink>
          </li>
          <li className="mb-6 ml-5">
            <InlineLink
              file="routes/contact-us/canada-pension-plan.tsx"
              data-gc-analytics-customclick="ESDC-EDSC_MSCA-MSDC-SCH:Contact Us:Canada Pension Plan"
            >
              {t('contactUs:cpp')}
            </InlineLink>
          </li>
          <li className="mb-6 ml-5">
            <InlineLink
              file="routes/contact-us/old-age-security.tsx"
              data-gc-analytics-customclick="ESDC-EDSC_MSCA-MSDC-SCH:Contact Us:Old Age Security"
            >
              {t('contactUs:oas')}
            </InlineLink>
            <p className="text-gray-darker text-xl">{t('contactUs:oas.more-info')}</p>
          </li>
          <li className="mb-6 ml-5">
            <InlineLink
              to={t('contactUs:cdb.href')}
              newTabIndicator={true}
              data-gc-analytics-customclick="ESDC-EDSC_MSCA-MSDC-SCH:Contact Us:Canada Disability Benefit"
            >
              {t('contactUs:cdb')}
            </InlineLink>
          </li>
          <li className="mb-6 ml-5">
            <InlineLink
              to={t('contactUs:sin.href')}
              newTabIndicator={true}
              data-gc-analytics-customclick="ESDC-EDSC_MSCA-MSDC-SCH:Contact Us:Social Insurance Number"
            >
              {t('contactUs:sin')}
            </InlineLink>
          </li>
        </ul>
      </div>
    </>
  );
}
