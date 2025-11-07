import type { RouteHandle } from 'react-router';

import { useTranslation } from 'react-i18next';

import type { Route } from './+types/profile-and-preferences';

import { requireAuth } from '~/.server/utils/auth-utils';
import { PageTitle } from '~/components/page-title';
import type { ProfileCardProps } from '~/components/profile-card';
import { ProfileList } from '~/components/profile-list';
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
  return { documentTitle: t('profileAndPreferences:page-title'), MSCA_BASE_URL };
}

export function meta({ data }: Route.MetaArgs) {
  return [{ title: data.documentTitle }];
}

export default function ProfileAndPreferences({ loaderData, params }: Route.ComponentProps) {
  const { t } = useTranslation(handle.i18nNamespace);
  const { MSCA_BASE_URL } = loaderData;

  const emailAddressCard: ProfileCardProps = {
    cardId: 'email-address-card',
    cardName: t('profileAndPreferences:email-address-card'),
    prefixIcon: 'mail',
    description: t('profileAndPreferences:email-address-description'),
    cardHref: t('profileAndPreferences:email-address-href', { baseUri: MSCA_BASE_URL }),
  };

  const inboxNotificationPreferencesCard: ProfileCardProps = {
    cardId: 'inbox-notification-preferences-card',
    cardName: t('profileAndPreferences:inbox-notification-preferences-card', { baseUri: MSCA_BASE_URL }),
    prefixIcon: 'notifications-active',
    description: t('profileAndPreferences:inbox-notification-preferences-description'),
    cardHref: t('profileAndPreferences:inbox-notification-preferences-href', { baseUri: MSCA_BASE_URL }),
  };

  const securityCard: ProfileCardProps = {
    cardId: 'security-settings-card',
    cardName: t('profileAndPreferences:security-settings-card', { baseUri: MSCA_BASE_URL }),
    prefixIcon: 'lock',
    description: t('profileAndPreferences:security-settings-description'),
    cardHref: t('profileAndPreferences:security-settings-href', { baseUri: MSCA_BASE_URL }),
  };

  const personalInformationByBenefitCard: ProfileCardProps = {
    cardId: 'personal-information-by-benefit-card-card',
    cardName: t('profileAndPreferences:personal-information-by-benefit-card'),
    prefixIcon: 'demography',
    description: t('profileAndPreferences:personal-information-by-benefit-description'),
    cardHref: t('profileAndPreferences:personal-information-by-benefit-href', { baseUri: MSCA_BASE_URL }),
  };

  return (
    <>
      <div className="mb-8">
        <PageTitle className="after:w-14">{t('profileAndPreferences:page-title')}</PageTitle>
      </div>
      <p className="mt-8 w-full max-w-3xl text-xl">{t('profileAndPreferences:page-description')}</p>
      <h2 className="font-lato text-gray-750 py-2 text-4xl font-semibold md:mt-2 md:py-4">
        {t('profileAndPreferences:account-information-title')}
      </h2>

      <ProfileList sectionName={t('profileAndPreferences:email-address-card')} profileCard={emailAddressCard} />

      <ProfileList
        sectionName={t('profileAndPreferences:inbox-notification-preferences-card')}
        profileCard={inboxNotificationPreferencesCard}
      />

      <ProfileList sectionName={t('profileAndPreferences:security-settings-card')} profileCard={securityCard} />
      <h2 className="font-lato text-gray-750 py-2 text-4xl font-semibold md:mt-2 md:py-4">
        {t('profileAndPreferences:personal-information-title')}
      </h2>

      <ProfileList
        sectionName={t('profileAndPreferences:personal-information-by-benefit-card')}
        profileCard={personalInformationByBenefitCard}
      />
    </>
  );
}
