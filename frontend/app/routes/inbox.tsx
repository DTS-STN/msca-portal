import type { RouteHandle } from 'react-router';

import { useTranslation, Trans } from 'react-i18next';

import type { Route } from './+types/inbox';

import { requireAuth } from '~/.server/utils/auth-utils';
import { PageTitle } from '~/components/page-title';
import { AppError } from '~/errors/app-error';
import { ErrorCodes } from '~/errors/error-codes';
import { getTranslation } from '~/i18n-config.server';
import { handle as parentHandle } from '~/routes/layout';
import { InlineLink } from '~/components/links';

export const handle = {
  i18nNamespace: [...parentHandle.i18nNamespace],
} as const satisfies RouteHandle;

export async function loader({ context, params, request }: Route.LoaderArgs) {
  const { userinfoTokenClaims } = await requireAuth(context.session, request);
  const { t } = await getTranslation(request, handle.i18nNamespace);

  const { MSCA_BASE_URL, CDCP_BASE_URL, CDB_BASE_URL, OAS_BASE_URL } = globalThis.__appEnvironment;

  if (!userinfoTokenClaims.sin) {
    throw new AppError('No SIN found in userinfo token', ErrorCodes.MISSING_SIN);
  }

  return { documentTitle: t('inbox:document-title'),  MSCA_BASE_URL, CDB_BASE_URL, CDCP_BASE_URL, OAS_BASE_URL };
}

export function meta({ data }: Route.MetaArgs) {
  return [{ title: data?.documentTitle }];
}

export default function Inbox({ loaderData, params }: Route.ComponentProps) {
 
  const { t } = useTranslation(handle.i18nNamespace);

  const { MSCA_BASE_URL, CDB_BASE_URL, CDCP_BASE_URL, OAS_BASE_URL } = loaderData
  
  const EI_LETTERS_URL = MSCA_BASE_URL + t('inbox:par4-list-item-ei-letters.href')
  const EI_STATUS_URL = MSCA_BASE_URL + t('inbox:par4-list-item-ei-status.href')
  const CDB_LETTERS_URL = CDB_BASE_URL  + t('inbox:par4-list-item-cdb-letters.href')
  const CDCP_LETTERS_URL = CDCP_BASE_URL + t('inbox:par4-list-item-cdcp-letters.href')
  const OAS_DASHBOARD_URL = OAS_BASE_URL  + t('inbox:par4-list-item-oas-dashboard.href')

  return (
    <>
      <div className="mb-8">
        <PageTitle className="after:w-14">{t('inbox:page-title')}</PageTitle>
      </div>
      <div className="text-xl text-gray-darker">
        <p className="pb-4">
          <Trans
            i18nKey="inbox:par1"
            components={[ <strong />]}
          />
        </p>
        <p className="pb-4">
            {t('inbox:par2')}
        </p>
      </div>
      
      <div className="text-xl text-gray-darker">
        <p className="pb-4">
            {t('inbox:par3')}
        </p>
        <ul className="pb-4">
          <li><InlineLink to={EI_LETTERS_URL} className="items-center rounded-sm py-1 text-blue-default underline hover:text-blue-hover focus:outline-1 focus:outline-blue-hover">
            {t('inbox:par4-list-item-ei-letters.text')}
            </InlineLink></li>
          <li><InlineLink to={EI_STATUS_URL} className='items-center rounded-sm py-1 text-blue-default underline hover:text-blue-hover focus:outline-1 focus:outline-blue-hover'>
            {t('inbox:par4-list-item-ei-status.text')}
            </InlineLink></li>
          <li><InlineLink to={CDCP_LETTERS_URL} className="items-center rounded-sm py-1 text-blue-default underline hover:text-blue-hover focus:outline-1 focus:outline-blue-hover">
            {t('inbox:par4-list-item-cdb-letters.text')}
            </InlineLink></li>
          <li><InlineLink to={CDB_LETTERS_URL} className='items-center rounded-sm py-1 text-blue-default underline hover:text-blue-hover focus:outline-1 focus:outline-blue-hover'>
            {t('inbox:par4-list-item-cdcp-letters.text')}
            </InlineLink></li>
          <li><InlineLink to={OAS_DASHBOARD_URL} className='items-center rounded-sm py-1 text-blue-default underline hover:text-blue-hover focus:outline-1 focus:outline-blue-hover'>
            {t('inbox:par4-list-item-cdb-letters.text')}
            </InlineLink></li>
        </ul>
        <p className="pb-4">
          <span>
            <Trans
              i18nKey="inbox:par5-part1"
              components={[ <strong />]}
            />
          </span>  
          <span><InlineLink file={t('inbox:par5-part2.href')}>{t('inbox:par5-part2.text')}</InlineLink></span>
          <span>{t('inbox:par5-part3')}</span>
        </p>
      </div>
    </>
  );
}
