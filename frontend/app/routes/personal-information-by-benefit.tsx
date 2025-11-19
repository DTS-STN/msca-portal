import type { RouteHandle } from 'react-router';

import { useTranslation } from 'react-i18next';

import type { Route } from './+types/personal-information-by-benefit';

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
  const { userinfoTokenClaims } = await requireAuth(context.session, request);
  const { t } = await getTranslation(request, handle.i18nNamespace);

  const { MSCA_BASE_URL } = globalThis.__appEnvironment;

  if (!userinfoTokenClaims.sin) {
    throw new AppError('No SIN found in userinfo token', ErrorCodes.MISSING_SIN);
  }

  return { documentTitle: t('personalInformationByBenefit:document-title'), MSCA_BASE_URL };
}

export function meta({ data }: Route.MetaArgs) {
  return [{ title: data.documentTitle }];
}

const aaPrefix = 'ESDC-EDSC_MSCA-MSDC-SCH:Personal information by benefit ';

export default function PersonalInformationByBenefit({ loaderData, params }: Route.ComponentProps) {
  const { t } = useTranslation(handle.i18nNamespace);
  const { MSCA_BASE_URL } = loaderData;

  return (
    <>
      <div className="max-w-3xl">
        <div className="mb-8">
          <PageTitle className="after:w-14">{t('personalInformationByBenefit:page-title')}</PageTitle>
        </div>

        <p className="text-gray-darker mt-3 mb-8 text-xl">{t('personalInformationByBenefit:part-1')}</p>

        <div className="mt-10 mb-12">
          <h2 className="font-display text-gray-darker font-bold">{t('personalInformationByBenefit:ei-heading')}</h2>
          <ul className="list-disc pt-3" aria-label={t('personalInformationByBenefit:ei-heading')}>
            <li className="mb-6 ml-5">
              <InlineLink
                to={t('personalInformationByBenefit:address-telephone.href', { baseUri: MSCA_BASE_URL })}
                data-gc-analytics-customclick={aaPrefix + 'EI:ei-address-and-telephone-number'}
                aria-label={t('personalInformationByBenefit:address-telephone.aria')}
              >
                {t('personalInformationByBenefit:address-telephone')}
              </InlineLink>
            </li>
            <li className="mb-6 ml-5">
              <InlineLink
                to={t('personalInformationByBenefit:province.href', { baseUri: MSCA_BASE_URL })}
                data-gc-analytics-customclick={aaPrefix + 'EI:ei-province-of-residence'}
                aria-label={t('personalInformationByBenefit:province.aria')}
              >
                {t('personalInformationByBenefit:province')}
              </InlineLink>
            </li>
            <li className="mb-6 ml-5">
              <InlineLink
                to={t('personalInformationByBenefit:direct-deposit-ei.href', { baseUri: MSCA_BASE_URL })}
                data-gc-analytics-customclick={aaPrefix + 'EI:ei-direct-deposit-details'}
                aria-label={t('personalInformationByBenefit:direct-deposit-ei.aria')}
              >
                {t('personalInformationByBenefit:direct-deposit-ei')}
              </InlineLink>
            </li>
            <li className="mb-6 ml-5">
              <InlineLink
                to={t('personalInformationByBenefit:language-correspondence.href', { baseUri: MSCA_BASE_URL })}
                data-gc-analytics-customclick={aaPrefix + 'EI:ei-language-of-correspondence'}
                aria-label={t('personalInformationByBenefit:language-correspondence.aria')}
              >
                {t('personalInformationByBenefit:language-correspondence')}
              </InlineLink>
            </li>
            <li className="mb-6 ml-5">
              <InlineLink
                to={t('personalInformationByBenefit:email-notification.href', { baseUri: MSCA_BASE_URL })}
                data-gc-analytics-customclick={aaPrefix + 'EI:email-notifications-alert-me'}
                aria-label={t('personalInformationByBenefit:email-notification.aria')}
              >
                {t('personalInformationByBenefit:email-notification')}
              </InlineLink>
            </li>
          </ul>
        </div>

        <div className="mt-10 mb-12">
          <h2 className="font-display text-gray-darker font-bold">{t('personalInformationByBenefit:cpp-heading')}</h2>
          <ul className="list-disc pt-3" aria-label={t('personalInformationByBenefit:cpp-heading')}>
            <li className="mb-6 ml-5">
              <InlineLink
                to={t('personalInformationByBenefit:address.href', { baseUri: MSCA_BASE_URL })}
                data-gc-analytics-customclick={aaPrefix + 'CPP:cpp-oas-address'}
                aria-label={t('personalInformationByBenefit:address.aria')}
              >
                {t('personalInformationByBenefit:address')}
              </InlineLink>
            </li>
            <li className="mb-6 ml-5">
              <InlineLink
                to={t('personalInformationByBenefit:telephone-number.href', { baseUri: MSCA_BASE_URL })}
                data-gc-analytics-customclick={aaPrefix + 'CPP:cpp-oas-telephone-number'}
                aria-label={t('personalInformationByBenefit:telephone-number.aria')}
              >
                {t('personalInformationByBenefit:telephone-number')}
              </InlineLink>
            </li>
            <li className="mb-6 ml-5">
              <InlineLink
                to={t('personalInformationByBenefit:direct-deposit-cpp.href', { baseUri: MSCA_BASE_URL })}
                data-gc-analytics-customclick={aaPrefix + 'CPP:cpp-oas-direct-deposit-details'}
                aria-label={t('personalInformationByBenefit:direct-deposit-cpp.aria')}
              >
                {t('personalInformationByBenefit:direct-deposit-cpp')}
              </InlineLink>
            </li>
            <li className="mb-6 ml-5">
              <InlineLink
                to={t('personalInformationByBenefit:consent-to-communicate.href', { baseUri: MSCA_BASE_URL })}
                data-gc-analytics-customclick={aaPrefix + 'CPP:cpp-oas-consent-to-communicate-on-my-behalf'}
                aria-label={t('personalInformationByBenefit:consent-to-communicate.aria')}
              >
                {t('personalInformationByBenefit:consent-to-communicate')}
              </InlineLink>
            </li>
          </ul>
        </div>

        <div className="mt-10 mb-12">
          <h2 className="font-display text-gray-darker font-bold">{t('personalInformationByBenefit:sin-heading')}</h2>
          <ul className="list-disc pt-3" aria-label={t('personalInformationByBenefit:sin-heading')}>
            <li className="mb-6 ml-5">
              <InlineLink
                to={t('personalInformationByBenefit:sin-details.href', { baseUri: MSCA_BASE_URL })}
                data-gc-analytics-customclick={aaPrefix + 'SINOM:sin-social-insurance-number-details'}
                aria-label={t('personalInformationByBenefit:sin-details.aria')}
              >
                {t('personalInformationByBenefit:sin-details')}
              </InlineLink>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
