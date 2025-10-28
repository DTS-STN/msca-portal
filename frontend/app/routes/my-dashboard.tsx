import type { RouteHandle } from 'react-router';
import { useLoaderData } from 'react-router';

import { useTranslation } from 'react-i18next';

import type { Route } from './+types/my-dashboard';

import { requireAuth } from '~/.server/utils/auth-utils';
import { Card } from '~/components/card';
import { PageTitle } from '~/components/page-title';
import { AppError } from '~/errors/app-error';
import { ErrorCodes } from '~/errors/error-codes';
import { getTranslation } from '~/i18n-config.server';
import { handle as parentHandle } from '~/routes/layout';
import { getLanguage } from '~/utils/i18n-utils';

export const handle = {
  i18nNamespace: [...parentHandle.i18nNamespace],
} as const satisfies RouteHandle;

export async function loader({ context, params, request }: Route.LoaderArgs) {
  const { userinfoTokenClaims } = await requireAuth(context.session, request);
  const { t } = await getTranslation(request, handle.i18nNamespace);
  const language = getLanguage(request);

  const { MSCA_BASE_URL } = globalThis.__appEnvironment;

  if (!userinfoTokenClaims.sin) {
    throw new AppError('No SIN found in userinfo token', ErrorCodes.MISSING_SIN);
  }

  const data = await import(`../.server/locales/${language}/dashboard.json`);
  const cards = data.cards;
  const exitBeta = data.exitBeta;

  return { documentTitle: t('app:template.page-title'), MSCA_BASE_URL, language, cards, exitBeta };
}

export function meta({ data }: Route.MetaArgs) {
  return [{ title: data?.documentTitle }];
}

export default function WelcomeTemplate() {
  const { language, cards } = useLoaderData<typeof loader>();
  const { t } = useTranslation(handle.i18nNamespace);

  return (
    <div className="pb-2" id="myDashboardContent" data-testid="myDashboardContent-test">
      <div className="mb-8">
        <PageTitle className="after:w-14">{t('app:template.page-title')}</PageTitle>
      </div>
      {cards.map((card: any) => {
        return (
          <Card
            key={card.id}
            programUniqueId={card.id}
            locale={language ?? 'en'}
            cardTitle={card.title}
            viewMoreLessCaption={card.dropdownText}
            acronym={card.title}
            refPageAA="ESDC-EDSC_MSCA-MSDC-SCH"
            cardAlert={[]}
          >
            test
          </Card>
        );
      })}
    </div>
  );
}
