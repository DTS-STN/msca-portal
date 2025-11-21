import type { RouteHandle } from 'react-router';

import { faClock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Trans, useTranslation } from 'react-i18next';

import type { Route } from '.react-router/types/app/routes/contact-us/+types/old-age-security';

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
    { labelI18nKey: 'gcweb:breadcrumbs.dashboard', routeId: 'my-dashboard' },
    { labelI18nKey: 'gcweb:breadcrumbs.contact-us', routeId: 'contact-us' },
  ],
  i18nNamespace: [...parentHandle.i18nNamespace],
} as const satisfies RouteHandle;

export async function loader({ context, params, request }: Route.LoaderArgs) {
  const { userinfoTokenClaims } = await requireAuth(request);
  const { t } = await getTranslation(request, handle.i18nNamespace);

  if (!userinfoTokenClaims.sin) {
    throw new AppError('No SIN found in userinfo token', ErrorCodes.MISSING_SIN);
  }

  return { documentTitle: t('contactUsOas:document-title') };
}

export function meta({ data }: Route.MetaArgs) {
  return [{ title: data.documentTitle }];
}

const onThisPageListStyle =
  'underline underline-offset-4 text-20px text-gray-darker underline-offset-3.1 decoration-1 pr-1 list-outside list-disc';
const headingStyle = 'py-2 font-display text-32px font-bold text-gray-darker md:pt-6 md:text-4xl';
const paraStyle = 'font-body mb-2 mt-6 text-xl';
const liStyle = 'ps-[0.325em] font-body text-xl marker:text-black my-2';
const aaPrefix = 'ESDC-EDSC_MSCA-MSDC-SCH:Old Age Security:';

const clockIcon = (
  <div>
    <FontAwesomeIcon className="pt-1 pr-2" style={{ color: '#2572B4' }} icon={faClock} />
  </div>
);

export default function OldAgeSecurity({ loaderData, params }: Route.ComponentProps) {
  const { t } = useTranslation(handle.i18nNamespace);
  return (
    <>
      <div className="max-w-3xl text-xl">
        <div className="mb-8">
          <PageTitle className="after:w-14">{t('contactUsOas:page-title')}</PageTitle>
        </div>
        <div className="py-5" />

        <h2 className="font-display text-gray-darker text-2xl leading-[26px] font-bold">{t('contactUsOas:on-this-page')}</h2>

        <ul className="ml-3.5 pl-[22px]">
          <li className={onThisPageListStyle}>
            <InlineLink to="#cpp-contact-telephone">{t('contactUsOas:phone')}</InlineLink>
          </li>
          <li className={onThisPageListStyle}>
            <InlineLink to="#cpp-contact-callback">{t('contactUsOas:callback')}</InlineLink>
          </li>
          <li className={onThisPageListStyle}>
            <InlineLink to="#cpp-contact-in-person">{t('contactUsOas:in-person')}</InlineLink>
          </li>
          <li className={onThisPageListStyle}>
            <InlineLink to="#cpp-contact-mail">{t('contactUsOas:mail')}</InlineLink>
          </li>
        </ul>

        <h2 id="cpp-contact-telephone" className={headingStyle}>
          {t('contactUsOas:phone')}
        </h2>

        <div className="pb-4">
          <p className={paraStyle}>{<Trans i18nKey={'contactUsOas:call-us'} components={{ bold: <strong /> }}></Trans>}</p>
          <p className={paraStyle}>{<Trans i18nKey={'contactUsOas:self-service'} components={{ bold: <strong /> }}></Trans>}</p>
          <ul className="my-0 ml-2 list-disc ps-[1.625em]">
            <li className={liStyle}>{t('contactUsOas:self-service.li.1')}</li>
            <li className={liStyle}>{t('contactUsOas:self-service.li.2')}</li>
          </ul>
        </div>

        <dl className="divide-y-2 border-y-2">
          <ContactTableRow
            dtElement={t('contactUsOas:before-call.dt')}
            ddElement={<Trans i18nKey={'contactUsOas:before-call.dd'} components={{ bold: <strong /> }}></Trans>}
          />
          <ContactTableRow
            dtElement={t('contactUsOas:phone-numbers.canada.dt')}
            ddElement={
              <>
                <p>{<Trans i18nKey={'contactUsOas:phone-numbers.canada.dd.1'} components={{ bold: <strong /> }}></Trans>}</p>
                <p>{t('contactUsOas:phone-numbers.canada.dd.2')}</p>
              </>
            }
            bgStyle="bg-blue-100"
          />
          <ContactTableRow
            dtElement={t('contactUsOas:phone-numbers.itl.dt')}
            ddElement={
              <>
                <p>{<Trans i18nKey={'contactUsOas:phone-numbers.itl.dd.1'} components={{ bold: <strong /> }}></Trans>}</p>
              </>
            }
            bgStyle="bg-blue-100"
          />
          <ContactTableRow
            dtElement={t('contactUsOas:hours-of-operation.dt')}
            ddElement={
              <>
                <div className="flex">
                  {clockIcon}
                  <div>
                    {<Trans i18nKey={'contactUsOas:hours-of-operation.dd.1'} components={{ bold: <strong /> }}></Trans>}
                  </div>
                </div>
                <div className="flex">
                  {clockIcon}
                  <div>
                    {<Trans i18nKey={'contactUsOas:hours-of-operation.dd.2'} components={{ bold: <strong /> }}></Trans>}
                  </div>
                </div>
              </>
            }
          />
          <ContactTableRow
            dtElement={t('contactUsOas:wait-times.dt')}
            ddElement={
              <div className="flex">
                {clockIcon}
                <div>{t('contactUsOas:wait-times.dd')}</div>
              </div>
            }
          />

          <ContactTableRow
            dtElement={t('contactUsOas:automated-hours.dt')}
            ddElement={
              <div className="flex">
                {clockIcon}
                <div>{t('contactUsOas:automated-hours.dd')}</div>
              </div>
            }
          />
        </dl>

        <div className="mt-4 pb-6"></div>

        <h2 id="cpp-contact-callback" className={headingStyle}>
          {t('contactUsOas:callback')}
        </h2>

        <div className="pb-4">
          <p className={paraStyle}>{t('contactUsOas:ask-us-to-call-you')}</p>
          <p className={paraStyle}>{t('contactUsOas:assistance')}</p>
          <ul className="my-0 ml-2 list-disc ps-[1.625em]">
            <li className={liStyle}>{t('contactUsOas:assistance.li.1')}</li>
            <li className={liStyle}>{t('contactUsOas:assistance.li.2')}</li>
            <li className={liStyle}>{t('contactUsOas:assistance.li.3')}</li>
            <li className={liStyle}>{t('contactUsOas:assistance.li.4')}</li>
          </ul>
        </div>

        <dl className="divide-y-2 border-y-2">
          <ContactTableRow dtElement={t('contactUsOas:before-contact.dt')} ddElement={t('contactUsOas:before-contact.dd')} />

          <ContactTableRow
            dtElement={t('contactUsOas:callback-form.dt')}
            ddElement={
              <InlineLink
                to={t('contactUsOas:callback-form.dd.href')}
                newTabIndicator={true}
                data-gc-analytics-customclick={aaPrefix + 'oas-callback-form'}
                aria-label={t('contactUsOas:callback-form.dd.aria')}
              >
                {t('contactUsOas:callback-form.dd')}
              </InlineLink>
            }
          />

          <ContactTableRow
            dtElement={t('contactUsOas:wait-callback.dt')}
            ddElement={
              <div className="flex">
                {clockIcon}
                <div>{t('contactUsOas:wait-callback.dd')}</div>
              </div>
            }
          />
        </dl>

        <div className="mt-4 pb-6"></div>

        <h2 id="cpp-contact-in-person" className={headingStyle}>
          {t('contactUsOas:in-person')}
        </h2>

        <div className="pb-4">
          <p className={paraStyle}>{t('contactUsOas:ask-not-visit')}</p>
        </div>

        <dl className="divide-y-2 border-y-2">
          <ContactTableRow
            dtElement={t('contactUsOas:before-come.dt')}
            ddElement={
              <>
                <p>{t('contactUsOas:before-come.dd.1')}</p>
                <p>
                  <strong>{t('contactUsOas:before-come.dd.2')}</strong>
                </p>
                <p>{t('contactUsOas:before-come.dd.3')}</p>
                <ul className="list-disc ps-[1.625em]">
                  <li>{t('contactUsOas:before-come.dd.3.li.1')}</li>
                  <li>{t('contactUsOas:before-come.dd.3.li.2')}</li>
                  <li>{t('contactUsOas:before-come.dd.3.li.3')}</li>
                </ul>
                <p>{t('contactUsOas:before-come.dd.4')}</p>
                <ul className="list-disc ps-[1.625em]">
                  <li>{t('contactUsOas:before-come.dd.4.li.1')}</li>
                  <li>{t('contactUsOas:before-come.dd.4.li.2')}</li>
                  <li>{t('contactUsOas:before-come.dd.4.li.3')}</li>
                </ul>
              </>
            }
          />

          <ContactTableRow
            dtElement={t('contactUsOas:find-location.dt')}
            ddElement={
              <InlineLink
                to={t('contactUsOas:find-location.dd.href')}
                newTabIndicator={true}
                data-gc-analytics-customclick={aaPrefix + 'oas-in-person-find-a-location'}
                aria-label={t('contactUsOas:find-location.dd.aria')}
              >
                {t('contactUsOas:find-location.dd')}
              </InlineLink>
            }
          />

          <ContactTableRow
            dtElement={t('contactUsOas:person.hours.dt')}
            ddElement={
              <div className="flex">
                {clockIcon}
                <div>
                  <p>{t('contactUsOas:person.hours.dd.1')}</p>
                  <p>
                    <strong>{t('contactUsOas:person.hours.dd.2')}</strong>
                  </p>
                </div>
              </div>
            }
          />
        </dl>

        <div className="mt-4 pb-6"></div>

        <h2 id="cpp-contact-mail" className={headingStyle}>
          {t('contactUsOas:mail')}
        </h2>

        <p className={paraStyle}>{t('contactUsOas:select-province')}</p>

        <AllProvinceContactCards
          props={{
            cards: t('contactUsOas:mail-contacts', { returnObjects: true }),
            aaPrefix: aaPrefix,
          }}
        />
      </div>
    </>
  );
}
