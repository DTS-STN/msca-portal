import { createContext } from 'react';
import { Session, SessionData } from 'react-router'
import type { RouteHandle, Params } from 'react-router';
import { getSession, commitSession } from '~/.server/session';
import { useTranslation, Trans } from 'react-i18next';

import PaginatedMessages from '../components/PaginatedMessages';
import type { Route } from './+types/inbox';

import type { MessageEntity } from '~/.server/domain/entities/message.entity';
import { getMessageService } from '~/.server/domain/services/message.service';
import { LogFactory } from '~/.server/logging';
import { requireAuth } from '~/.server/utils/auth-utils';
import { InlineLink } from '~/components/links';
import { PageTitle } from '~/components/page-title';
import { AppError } from '~/errors/app-error';
import { ErrorCodes } from '~/errors/error-codes';
import { getTranslation } from '~/i18n-config.server';
import { handle as parentHandle } from '~/routes/layout';
// import { securityHeadersMiddleware } from '~/middleware';

type InboxContext = {
  params: Params;
  messages: MessageEntity[];
  engVerboseMessages: Map<string, string>;
  frVerboseMessages: Map<string, string>;
  messagesPerPage: number;
  pageRangeDisplayed: number;
};

const log = LogFactory.getLogger(import.meta.url);

export const handle = {
  breadcrumbs: [{ labelI18nKey: 'gcweb:breadcrumbs.dashboard', routeId: 'my-dashboard' }],
  i18nNamespace: [...parentHandle.i18nNamespace],
} as const satisfies RouteHandle;

// export const middleware: Route.MiddlewareFunction[] = [
//   securityHeadersMiddleware,
// ];

export async function loader({ context, params, request }: Route.LoaderArgs) {
  const session: Session<SessionData, SessionData> = await getSession(request.headers.get('Cookie'))
  const { userinfoTokenClaims } = await requireAuth(request);
  const { t } = await getTranslation(request, handle.i18nNamespace);

  if (!userinfoTokenClaims.sin) {
    log.warn('Error: User Info Token sin not defined');
    throw new AppError('No SIN found in userinfo token', ErrorCodes.MISSING_SIN);
  }

  const { sin, sub } = userinfoTokenClaims;

  const {
    MSCA_BASE_URL,
    CDCP_BASE_URL,
    CDB_BASE_URL,
    OAS_BASE_URL,
    PAGINATION_MESSAGES_PER_PAGE,
    PAGINATION_PAGE_RANGE_DISPLAYED,
  } = globalThis.__appEnvironment;

  let messages: MessageEntity[] | undefined = session.get('messages');
  if (messages === undefined) {
    messages = await getMessageService().findMessagesBySin({
      sin: sin ? sin : '',
      userId: sub ? sub : '',
    });
    session.set('messages', messages);
  }

  await commitSession(session)
  
  return {
    params,
    documentTitle: t('inbox:document-title'),
    messages,
    MSCA_BASE_URL,
    CDB_BASE_URL,
    CDCP_BASE_URL,
    OAS_BASE_URL,
    PAGINATION_MESSAGES_PER_PAGE,
    PAGINATION_PAGE_RANGE_DISPLAYED,
  };
}

export function meta({ data }: Route.MetaArgs) {
  return [{ title: data.documentTitle }];
}

const EMPTY_MAP = new Map<string, string>();
const EMPTY_ARRAY: MessageEntity[] = [];
const EMPTY_LIST: Params = {};
const defaultInboxContext = {
  params: EMPTY_LIST,
  messages: EMPTY_ARRAY,
  locale: 'en',
  engVerboseMessages: EMPTY_MAP,
  frVerboseMessages: EMPTY_MAP,
  messagesPerPage: 5,
  pageRangeDisplayed: 5,
};

export const inboxContext = createContext<InboxContext>(defaultInboxContext);

export default function Inbox({ loaderData, params }: Route.ComponentProps) {
  const { t } = useTranslation(['inbox']);
  const engMessageVerboseTitles = new Map<string, string>();
  engMessageVerboseTitles.set('PSCDMSA', t('inbox:message-verbose-titles.accounts'));
  engMessageVerboseTitles.set('PSCDNOD', t('inbox:message-verbose-titles.debts'));

  const frMessageVerboseTitles = new Map<string, string>();
  frMessageVerboseTitles.set('PSCDMSA', t('inbox:message-verbose-titles.accounts'));
  frMessageVerboseTitles.set('PSCDNOD', t('inbox:message-verbose-titles.debts'));

  const {
    messages,
    MSCA_BASE_URL,
    CDB_BASE_URL,
    CDCP_BASE_URL,
    OAS_BASE_URL,
    PAGINATION_MESSAGES_PER_PAGE,
    PAGINATION_PAGE_RANGE_DISPLAYED,
  } = loaderData;

  const EI_LETTERS_URL = MSCA_BASE_URL + t('inbox:par4-list-item-ei-letters.href');
  const EI_STATUS_URL = MSCA_BASE_URL + t('inbox:par4-list-item-ei-status.href');
  const CDB_LETTERS_URL = CDB_BASE_URL + t('inbox:par4-list-item-cdb-letters.href');
  const CDCP_LETTERS_URL = CDCP_BASE_URL + t('inbox:par4-list-item-cdcp-letters.href');
  const OAS_DASHBOARD_URL = OAS_BASE_URL + t('inbox:par4-list-item-oas-dashboard.href');

  const inboxContextValues = {
    t: t,
    params,
    messages,
    engVerboseMessages: engMessageVerboseTitles,
    frVerboseMessages: frMessageVerboseTitles,
    messagesPerPage: PAGINATION_MESSAGES_PER_PAGE,
    pageRangeDisplayed: PAGINATION_PAGE_RANGE_DISPLAYED,
  };

  return (
    <>
      <div className="mb-8">
        <PageTitle className="after:w-14">{t('inbox:page-title')}</PageTitle>
      </div>
      <div className="text-gray-darker text-xl">
        <p className="pb-4">
          <Trans i18nKey="inbox:par1" components={{ bold: <strong /> }} />
        </p>
        <p className="pb-4">{t('inbox:par2')}</p>
      </div>

      <inboxContext.Provider value={inboxContextValues}>
        <PaginatedMessages />
      </inboxContext.Provider>
      <div className="text-gray-darker py-4 text-xl">
        <p className="pb-4">{t('inbox:par3')}</p>
        <ul className="pb-4">
          <li>
            <InlineLink
              to={EI_LETTERS_URL}
              className="text-blue-default hover:text-blue-hover focus:outline-blue-hover items-center rounded-sm py-1 underline focus:outline-1"
            >
              {t('inbox:par4-list-item-ei-letters.text')}
            </InlineLink>
          </li>
          <li>
            <InlineLink
              to={EI_STATUS_URL}
              className="text-blue-default hover:text-blue-hover focus:outline-blue-hover items-center rounded-sm py-1 underline focus:outline-1"
            >
              {t('inbox:par4-list-item-ei-status.text')}
            </InlineLink>
          </li>
          <li>
            <InlineLink
              to={CDCP_LETTERS_URL}
              className="text-blue-default hover:text-blue-hover focus:outline-blue-hover items-center rounded-sm py-1 underline focus:outline-1"
            >
              {t('inbox:par4-list-item-cdb-letters.text')}
            </InlineLink>
          </li>
          <li>
            <InlineLink
              to={CDB_LETTERS_URL}
              className="text-blue-default hover:text-blue-hover focus:outline-blue-hover items-center rounded-sm py-1 underline focus:outline-1"
            >
              {t('inbox:par4-list-item-cdcp-letters.text')}
            </InlineLink>
          </li>
          <li>
            <InlineLink
              to={OAS_DASHBOARD_URL}
              className="text-blue-default hover:text-blue-hover focus:outline-blue-hover items-center rounded-sm py-1 underline focus:outline-1"
            >
              {t('inbox:par4-list-item-cdb-letters.text')}
            </InlineLink>
          </li>
        </ul>
        <p className="pb-4">
          <span>
            <Trans i18nKey="inbox:par5-part1" components={{ bold: <strong /> }} />
          </span>
          <span>
            <InlineLink file={t('inbox:par5-part2.href')}>{t('inbox:par5-part2.text')}</InlineLink>
          </span>
          <span>{t('inbox:par5-part3')}</span>
        </p>
      </div>
    </>
  );
}
