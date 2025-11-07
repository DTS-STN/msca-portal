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

export default function SecuritySettings({ loaderData, params }: Route.ComponentProps) {
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
              <InlineLink to={t('personalInformationByBenefit:address-telephone.href', { baseUri: MSCA_BASE_URL })}>
                {t('personalInformationByBenefit:address-telephone')}
              </InlineLink>
            </li>
            <li className="mb-6 ml-5">
              <InlineLink to={t('personalInformationByBenefit:province.href', { baseUri: MSCA_BASE_URL })}>
                {t('personalInformationByBenefit:province')}
              </InlineLink>
            </li>
            <li className="mb-6 ml-5">
              <InlineLink to={t('personalInformationByBenefit:direct-deposit-ie.href', { baseUri: MSCA_BASE_URL })}>
                {t('personalInformationByBenefit:direct-deposit-ie')}
              </InlineLink>
            </li>
            <li className="mb-6 ml-5">
              <InlineLink to={t('personalInformationByBenefit:language-correspondence.href', { baseUri: MSCA_BASE_URL })}>
                {t('personalInformationByBenefit:language-correspondence')}
              </InlineLink>
            </li>
            <li className="mb-6 ml-5">
              <InlineLink to={t('personalInformationByBenefit:email-notification.href', { baseUri: MSCA_BASE_URL })}>
                {t('personalInformationByBenefit:email-notification')}
              </InlineLink>
            </li>
          </ul>
        </div>

        <div className="mt-10 mb-12">
          <h2 className="font-display text-gray-darker font-bold">{t('personalInformationByBenefit:cpp-heading')}</h2>
          <ul className="list-disc pt-3" aria-label={t('personalInformationByBenefit:cpp-heading')}>
            <li className="mb-6 ml-5">
              <InlineLink to={t('personalInformationByBenefit:address.href', { baseUri: MSCA_BASE_URL })}>
                {t('personalInformationByBenefit:address')}
              </InlineLink>
            </li>
            <li className="mb-6 ml-5">
              <InlineLink to={t('personalInformationByBenefit:telephone-number.href', { baseUri: MSCA_BASE_URL })}>
                {t('personalInformationByBenefit:telephone-number')}
              </InlineLink>
            </li>
            <li className="mb-6 ml-5">
              <InlineLink to={t('personalInformationByBenefit:direct-deposit-cpp.href', { baseUri: MSCA_BASE_URL })}>
                {t('personalInformationByBenefit:direct-deposit-cpp')}
              </InlineLink>
            </li>
            <li className="mb-6 ml-5">
              <InlineLink to={t('personalInformationByBenefit:consent-to-communicate.href', { baseUri: MSCA_BASE_URL })}>
                {t('personalInformationByBenefit:consent-to-communicate')}
              </InlineLink>
            </li>
          </ul>
        </div>

        <div className="mt-10 mb-12">
          <h2 className="font-display text-gray-darker font-bold">{t('personalInformationByBenefit:sin-heading')}</h2>
          <ul className="list-disc pt-3" aria-label={t('personalInformationByBenefit:sin-heading')}>
            <li className="mb-6 ml-5">
              <InlineLink to={t('personalInformationByBenefit:sin-details.href', { baseUri: MSCA_BASE_URL })}>
                {t('personalInformationByBenefit:sin-details')}
              </InlineLink>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
