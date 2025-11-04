import type { Key } from 'react';

import { useLoaderData } from 'react-router';

import type { Route } from './+types/my-dashboard';

import { getDashboardService } from '~/.server/domain/services/dashboard-service.server';
import { requireAuth } from '~/.server/utils/auth-utils';
import type { TaskListProps } from '~/components/benefit-tasks';
import { BenefitTasks } from '~/components/benefit-tasks';
import { Card } from '~/components/card';
import { ContextualAlert } from '~/components/contextual-alert';
import { MostReqTasks } from '~/components/most-req-tasks';
import { PageTitle } from '~/components/page-title';
import { AppError } from '~/errors/app-error';
import { ErrorCodes } from '~/errors/error-codes';
import { getAcronym } from '~/utils/acronym-utils';
import { getContextualAlertType } from '~/utils/application-code-utils';
import { getLanguage } from '~/utils/i18n-utils';

interface Card {
  id: string;
  title: string;
  dropdownText: string;
  lists: TaskListProps[];
}

export async function loader({ context, params, request }: Route.LoaderArgs) {
  const { userinfoTokenClaims } = await requireAuth(context.session, request);
  const language = getLanguage(request);

  const { MSCA_BASE_URL } = globalThis.__appEnvironment;

  if (!userinfoTokenClaims.sin) {
    throw new AppError('No SIN found in userinfo token', ErrorCodes.MISSING_SIN);
  }

  const pageAlerts = await getDashboardService().getPageAlertsByLang(language ?? 'en');
  const cardAlerts = await getDashboardService().getCardAlertsByLang(language ?? 'en');
  const exitBeta = await getDashboardService().getExitBetaByLang(language ?? 'en');

  const data = await import(`../.server/locales/${language}/dashboard.json`);
  const cards = data.cards;
  const title = data.page.title;

  return { documentTitle: data.page.documentTitle, MSCA_BASE_URL, language, title, cards, pageAlerts, cardAlerts, exitBeta };
}

export function meta({ data }: Route.MetaArgs) {
  return [{ title: data.documentTitle }];
}

export default function WelcomeTemplate() {
  const { language, title, cards, pageAlerts, cardAlerts } = useLoaderData<typeof loader>();

  return (
    <div className="pb-2" id="myDashboardContent" data-testid="myDashboardContent-test">
      <div className="mb-8">
        <PageTitle className="after:w-14">{title}</PageTitle>
      </div>
      {pageAlerts.map((alert, index) => {
        const alertType = alert.type.split('/').pop();

        <ContextualAlert type={getContextualAlertType(alertType ?? null)}>{alert.alertBody}</ContextualAlert>;
      })}
      {cards.map((card: Card) => {
        const mostReq = card.lists[0];
        const tasks = card.lists.slice(1, card.lists.length);
        const cardAlertList = cardAlerts.filter((cardAlert) => cardAlert.id === card.id);

        return (
          <Card
            key={card.id}
            programUniqueId={card.id}
            locale={language ?? 'en'}
            cardTitle={card.title}
            viewMoreLessCaption={card.dropdownText}
            acronym={card.title}
            refPageAA={`ESDC-EDSC_MSCA-MSDC-SCH:${title}`}
            cardAlert={cardAlertList[0]?.alerts}
          >
            <div className="bg-deep-blue-60d" data-cy="most-requested-section">
              <MostReqTasks
                locale={language ?? 'en'}
                taskList={mostReq}
                dataCy="most-requested"
                acronym={getAcronym(card.title)}
                refPageAA={`ESDC-EDSC_MSCA-MSDC-SCH:${title}`}
              />
            </div>
            <div className="gap-x-[60px] pt-8 pl-3 sm:pl-8 md:columns-2 md:px-15" data-cy="task-list">
              {tasks.map((taskList: TaskListProps, index: Key) => {
                return (
                  <div key={index} data-cy="Task">
                    <BenefitTasks
                      locale={language ?? 'en'}
                      acronym={getAcronym(card.title)}
                      taskList={taskList}
                      dataCy="task-group-list"
                      refPageAA={`ESDC-EDSC_MSCA-MSDC-SCH:${title}`}
                    />
                  </div>
                );
              })}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
