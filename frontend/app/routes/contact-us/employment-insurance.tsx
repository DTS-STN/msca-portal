import type { RouteHandle } from 'react-router';

import { faClock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Trans, useTranslation } from 'react-i18next';

import type { Route } from '.react-router/types/app/routes/contact-us/+types/employment-insurance';

import { requireAuth } from '~/.server/utils/auth-utils';
import ContactTableRow from '~/components/contact-table-row';
import { InlineLink } from '~/components/links';
import { PageTitle } from '~/components/page-title';
import { AllProvinceContactCards } from '~/components/province-mail-contact-card';
import { AppError } from '~/errors/app-error';
import { ErrorCodes } from '~/errors/error-codes';
import { getTranslation } from '~/i18n-config.server';
import { handle as parentHandle } from '~/routes/layout';

export const handle = {
  breadcrumbs: [
    { labelI18nKey: 'gcweb:breadcrumbs.dashboard', to: '/my-dashboard' },
    { labelI18nKey: 'gcweb:breadcrumbs.contact-us', to: '/contact-us' },
  ],
  i18nNamespace: [...parentHandle.i18nNamespace],
} as const satisfies RouteHandle;

export async function loader({ context, params, request }: Route.LoaderArgs) {
  const { userinfoTokenClaims } = await requireAuth(context.session, request);
  const { t } = await getTranslation(request, handle.i18nNamespace);

  if (!userinfoTokenClaims.sin) {
    throw new AppError('No SIN found in userinfo token', ErrorCodes.MISSING_SIN);
  }

  return { documentTitle: t('contactUsEi:document-title') };
}

export function meta({ data }: Route.MetaArgs) {
  return [{ title: data.documentTitle }];
}

const onThisPageListStyle =
  'underline underline-offset-4 text-20px text-gray-darker underline-offset-3.1 decoration-1 pr-1 list-outside list-disc';
const headingStyle = 'py-2 font-display text-32px font-bold text-gray-darker md:pt-6 md:text-4xl';
const paraStyle = 'font-body mb-2 mt-6 text-xl';
const liStyle = 'ps-[0.325em] font-body text-xl marker:text-black my-2';
const aaPrefix = 'ESDC-EDSC_MSCA-MSDC-SCH:Employment Insurance:';

const clockIcon = (
  <div>
    <FontAwesomeIcon className="pt-1 pr-2" style={{ color: '#2572B4' }} icon={faClock} />
  </div>
);

export default function EmploymentInsurance({ loaderData, params }: Route.ComponentProps) {
  const { t } = useTranslation(handle.i18nNamespace);
  return (
    <>
      <div className="max-w-3xl text-xl">
        <div className="mb-8">
          <PageTitle className="after:w-14">{t('contactUsEi:page-title')}</PageTitle>
        </div>
        <div className="py-5" />

        <h2 className="font-display text-gray-darker text-2xl leading-[26px] font-bold">{t('contactUsEi:on-this-page')}</h2>

        <ul className="ml-3.5 pl-[22px]">
          <li className={onThisPageListStyle}>
            <InlineLink to="#ei-contact-telephone">{t('contactUsEi:phone')}</InlineLink>
          </li>
          <li className={onThisPageListStyle}>
            <InlineLink to="#ei-contact-callback">{t('contactUsEi:callback')}</InlineLink>
          </li>
          <li className={onThisPageListStyle}>
            <InlineLink to="#ei-contact-in-person">{t('contactUsEi:in-person')}</InlineLink>
          </li>
          <li className={onThisPageListStyle}>
            <InlineLink to="#ei-contact-mail">{t('contactUsEi:mail')}</InlineLink>
          </li>
        </ul>

        <h2 id="ei-contact-telephone" className={headingStyle}>
          {t('contactUsEi:phone')}
        </h2>

        <div className="pb-4">
          <p className={paraStyle}>{<Trans i18nKey={'contactUsEi:call-us'} components={{ bold: <strong /> }}></Trans>}</p>
          <p className={paraStyle}>{<Trans i18nKey={'contactUsEi:self-service'} components={{ bold: <strong /> }}></Trans>}</p>
          <ul className="my-0 ml-2 list-disc ps-[1.625em]">
            <li className={liStyle}>{t('contactUsEi:submit-electronic-reports')}</li>
            <li className={liStyle}>{t('contactUsEi:get-info-on-benefits')}</li>
          </ul>
        </div>

        <dl className="divide-y-2 border-y-2">
          <ContactTableRow
            dtElement={t('contactUsEi:before-call.dt')}
            ddElement={<Trans i18nKey={'contactUsEi:before-call.dd'} components={{ bold: <strong /> }}></Trans>}
          />
          <ContactTableRow
            dtElement={t('contactUsEi:phone-numbers.dt')}
            ddElement={
              <>
                <p>{<Trans i18nKey={'contactUsEi:phone-numbers.dd.1'} components={{ bold: <strong /> }}></Trans>}</p>
                <p>{t('contactUsEi:phone-numbers.dd.2')}</p>
              </>
            }
            bgStyle="bg-blue-100"
          />
          <ContactTableRow
            dtElement={t('contactUsEi:hours-of-operation.dt')}
            ddElement={
              <div className="flex">
                {clockIcon}
                <div>
                  <strong>{t('contactUsEi:hours-of-operation.dd')}</strong>
                </div>
              </div>
            }
          />
          <ContactTableRow
            dtElement={t('contactUsEi:wait-times.dt')}
            ddElement={
              <div className="flex">
                {clockIcon}
                <div>{t('contactUsEi:wait-times.dd')}</div>
              </div>
            }
          />

          <ContactTableRow
            dtElement={t('contactUsEi:automated-hours.dt')}
            ddElement={
              <div className="flex">
                {clockIcon}
                <div>{t('contactUsEi:automated-hours.dd')}</div>
              </div>
            }
          />
        </dl>

        <div className="mt-4 pb-6"></div>

        <h2 id="ei-contact-callback" className={headingStyle}>
          {t('contactUsEi:callback')}
        </h2>

        <div className="pb-4">
          <p className={paraStyle}>{t('contactUsEi:ask-us-to-call-you')}</p>
          <p className={paraStyle}>{t('contactUsEi:assistance')}</p>
          <ul className="my-0 ml-2 list-disc ps-[1.625em]">
            <li className={liStyle}>{t('contactUsEi:assistance.li.1')}</li>
            <li className={liStyle}>{t('contactUsEi:assistance.li.2')}</li>
            <li className={liStyle}>{t('contactUsEi:assistance.li.3')}</li>
            <li className={liStyle}>{t('contactUsEi:assistance.li.4')}</li>
            <li className={liStyle}>{t('contactUsEi:assistance.li.5')}</li>
            <li className={liStyle}>{t('contactUsEi:assistance.li.6')}</li>
          </ul>
        </div>

        <dl className="divide-y-2 border-y-2">
          <ContactTableRow dtElement={t('contactUsEi:before-contact.dt')} ddElement={t('contactUsEi:before-contact.dd')} />

          <ContactTableRow
            dtElement={t('contactUsEi:callback-form.dt')}
            ddElement={
              <InlineLink
                to={t('contactUsEi:callback-form.dd.href')}
                newTabIndicator={true}
                data-gc-analytics-customclick={aaPrefix + 'oas-callback-form'}
                aria-label={t('contactUsEi:callback-form.dd.aria')}
              >
                {t('contactUsEi:callback-form.dd')}
              </InlineLink>
            }
          />

          <ContactTableRow
            dtElement={t('contactUsEi:wait-callback.dt')}
            ddElement={
              <div className="flex">
                {clockIcon}
                <div>{t('contactUsEi:wait-callback.dd')}</div>
              </div>
            }
          />
        </dl>

        <div className="mt-4 pb-6"></div>

        <h2 id="ei-contact-in-person" className={headingStyle}>
          {t('contactUsEi:in-person')}
        </h2>

        <div className="pb-4">
          <p className={paraStyle}>{t('contactUsEi:ask-not-visit')}</p>
        </div>

        <dl className="divide-y-2 border-y-2">
          <ContactTableRow
            dtElement={t('contactUsEi:before-come.dt')}
            ddElement={
              <>
                <p>{t('contactUsEi:before-come.dd.1')}</p>
                <p>
                  <strong>{t('contactUsEi:before-come.dd.2')}</strong>
                </p>
                <p>{t('contactUsEi:before-come.dd.3')}</p>
                <ul className="list-disc ps-[1.625em]">
                  <li>{t('contactUsEi:before-come.dd.3.li.1')}</li>
                  <li>{t('contactUsEi:before-come.dd.3.li.2')}</li>
                  <li>{t('contactUsEi:before-come.dd.3.li.3')}</li>
                </ul>
                <p>{t('contactUsEi:before-come.dd.4')}</p>
                <ul className="list-disc ps-[1.625em]">
                  <li>{t('contactUsEi:before-come.dd.4.li.1')}</li>
                  <li>{t('contactUsEi:before-come.dd.4.li.2')}</li>
                  <li>{t('contactUsEi:before-come.dd.4.li.3')}</li>
                </ul>
              </>
            }
          />

          <ContactTableRow
            dtElement={t('contactUsEi:find-location.dt')}
            ddElement={
              <InlineLink
                to={t('contactUsEi:find-location.dd.href')}
                newTabIndicator={true}
                data-gc-analytics-customclick={aaPrefix + 'oas-in-person-find-a-location'}
                aria-label={t('contactUsEi:find-location.dd.aria')}
              >
                {t('contactUsEi:find-location.dd')}
              </InlineLink>
            }
          />

          <ContactTableRow
            dtElement={t('contactUsEi:person.hours.dt')}
            ddElement={
              <div className="flex">
                {clockIcon}
                <div>
                  <p>{t('contactUsEi:person.hours.dd.1')}</p>
                  <p>
                    <strong>{t('contactUsEi:person.hours.dd.2')}</strong>
                  </p>
                </div>
              </div>
            }
          />
        </dl>

        <div className="mt-4 pb-6"></div>

        <h2 id="ei-contact-mail" className={headingStyle}>
          {t('contactUsEi:mail')}
        </h2>

        <p className={paraStyle}>{t('contactUsEi:submit-mail')}</p>
        <p className={paraStyle}>{t('contactUsEi:select-province')}</p>

        <AllProvinceContactCards
          props={{
            cards: t('contactUsEi:mail-contacts', { returnObjects: true }),
            aaPrefix: aaPrefix,
          }}
        />
      </div>
    </>
  );
}
