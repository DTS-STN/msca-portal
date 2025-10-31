import { requireAuth } from "~/.server/utils/auth-utils";
import { Route } from ".react-router/types/app/routes/contact-us/+types/employment-insurance";
import { getTranslation } from "~/i18n-config.server";
import { handle as parentHandle } from '~/routes/layout';
import { Link, RouteHandle } from "react-router";
import { AppError } from "~/errors/app-error";
import { ErrorCodes } from "~/errors/error-codes";
import { Trans, useTranslation } from "react-i18next";
import { PageTitle } from "~/components/page-title";
import { ButtonLink } from "~/components/button-link";
import { serverEnvironment } from "~/.server/environment";
import { AppLink, InlineLink } from "~/components/links";
import { list } from "isbot";
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const handle = {
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
    return [{ title: data?.documentTitle }];
}

const onThisPageListStyle = "underline underline-offset-4 text-20px text-gray-darker underline-offset-3.1 decoration-1 pr-1 list-outside list-disc"
const headingStyle = "py-2 font-display text-32px font-bold text-gray-darker md:pt-6 md:text-4xl"
const paraStyle = "font-body mb-2 mt-6 text-xl"
const liStyle = "ps-[0.325em] font-body text-xl marker:text-black my-2"
const tableRowStyle = "grid grid-cols-1 py-2 md:grid-cols-12"
const dtStyle = "text-2xl font-bold text-gray-darker md:col-span-4 md:pl-3"
const ddStyle = "md:col-span-8 font-body text-xl px-2"

export default function EmploymentInsurance({ loaderData, params }: Route.ComponentProps) {
    const { t } = useTranslation(handle.i18nNamespace);
    return (
        <>
            <div className="max-w-3xl text-xl">

                <div className="mb-8">
                    <PageTitle className="after:w-14">{t('contactUsEi:page-title')}</PageTitle>
                </div>
                <div className="py-5" />

                <h2 className="font-display text-2xl leading-[26px] font-bold text-gray-darker">
                    {t('contactUsEi:on-this-page')}
                </h2>

                <ul className="pl-[22px] ml-3.5">
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
                    <p className={paraStyle}>{<Trans i18nKey={"contactUsEi:call-us"} components={{ bold: <strong /> }}></Trans>}</p>
                    <p className={paraStyle}>{<Trans i18nKey={"contactUsEi:self-service"} components={{ bold: <strong /> }}></Trans>}</p>
                    <ul className="my-0 ml-2 ps-[1.625em] list-disc">
                        <li className={liStyle}>{t("contactUsEi:submit-electronic-reports")}</li>
                        <li className={liStyle}>{t("contactUsEi:get-info-on-benefits")}</li>
                    </ul>
                </div>

                <dl className="divide-y-2 border-y-2">
                    <div className={tableRowStyle}>
                        <dt className={dtStyle}>{t("contactUsEi:before-call.dt")}</dt>
                        <dd className={ddStyle}>{<Trans i18nKey={"contactUsEi:before-call.dd"} components={{ bold: <strong /> }}></Trans>}</dd>
                    </div>
                    <div className={tableRowStyle}>
                        <dt className={dtStyle + " bg-blue-100"}>{t("contactUsEi:phone-numbers.dt")}</dt>
                        <dd className={ddStyle + " bg-blue-100"}>
                            <p>{<Trans i18nKey={"contactUsEi:phone-numbers.dd.1"} components={{ bold: <strong /> }}></Trans>}</p>
                            <p>{t("contactUsEi:phone-numbers.dd.2")}</p>
                        </dd>
                    </div>
                    <div className={tableRowStyle}>
                        <dt className={dtStyle}>{t("contactUsEi:hours-of-operation.dt")}</dt>
                        <dd className={ddStyle}>
                            <div className="flex">
                                <div>
                                    <FontAwesomeIcon
                                        className="pr-2 pt-1"
                                        style={{ color: '#2572B4' }}
                                        icon={faClock}
                                    /></div>
                                <div>
                                    <strong>{t("contactUsEi:hours-of-operation.dd")}</strong></div></div></dd>
                    </div>
                    <div className={tableRowStyle}>
                        <dt className={dtStyle}>{t("contactUsEi:wait-times.dt")}</dt>
                        <dd className={ddStyle}>
                            <div className="flex">
                                <div>
                                    <FontAwesomeIcon
                                        className="pr-2 pt-1"
                                        style={{ color: '#2572B4' }}
                                        icon={faClock}
                                    /></div>
                                <div>
                                    {t("contactUsEi:wait-times.dd")}</div></div></dd>
                    </div>
                    <div className={tableRowStyle}>
                        <dt className={dtStyle}>{t("contactUsEi:automated-hours.dt")}</dt>
                        <dd className={ddStyle}>
                            <div className="flex">
                                <div>
                                    <FontAwesomeIcon
                                        className="pr-2 pt-1"
                                        style={{ color: '#2572B4' }}
                                        icon={faClock}
                                    /></div>
                                <div>
                                    {t("contactUsEi:automated-hours.dd")}</div></div></dd>
                    </div>
                </dl>

                <div className="mt-4 pb-6"></div>

                <h2 id="ei-contact-callback" className={headingStyle}>
                    {t('contactUsEi:callback')}
                </h2>

                <div className="pb-4">
                    <p className={paraStyle}>{t("contactUsEi:ask-us-to-call-you")}</p>
                    <p className={paraStyle}>{t("contactUsEi:assistance")}</p>
                    <ul className="my-0 ml-2 list-disc ps-[1.625em]">
                        <li className={liStyle}>{t("contactUsEi:assistance.li.1")}</li>
                        <li className={liStyle}>{t("contactUsEi:assistance.li.2")}</li>
                        <li className={liStyle}>{t("contactUsEi:assistance.li.3")}</li>
                        <li className={liStyle}>{t("contactUsEi:assistance.li.4")}</li>
                        <li className={liStyle}>{t("contactUsEi:assistance.li.5")}</li>
                        <li className={liStyle}>{t("contactUsEi:assistance.li.6")}</li>
                    </ul>
                </div>

                <dl className="divide-y-2 border-y-2">
                    <div className={tableRowStyle}>
                        <dt className={dtStyle}>{t("contactUsEi:before-contact.dt")}</dt>
                        <dd className={ddStyle}>{t("contactUsEi:before-contact.dd")}</dd>
                    </div>
                    <div className={tableRowStyle}>
                        <dt className={dtStyle}>{t("contactUsEi:callback-form.dt")}</dt>
                        <dd className={ddStyle}>
                            <InlineLink to={t("contactUsEi:callback-form.dd.href")} newTabIndicator={true}>
                                {t("contactUsEi:callback-form.dd")}
                            </InlineLink>
                        </dd>
                    </div>
                    <div className={tableRowStyle}>
                        <dt className={dtStyle}>{t("contactUsEi:wait-callback.dt")}</dt>
                        <dd className={ddStyle}>
                            <div className="flex">
                                <div>
                                    <FontAwesomeIcon
                                        className="pr-2 pt-1"
                                        style={{ color: '#2572B4' }}
                                        icon={faClock}
                                    /></div>
                                <div>
                                    {t("contactUsEi:wait-callback.dd")}
                                </div>
                            </div></dd>
                    </div>
                </dl>

                <div className="mt-4 pb-6"></div>

                <h2 id="ei-contact-in-person" className={headingStyle}>
                    {t('contactUsEi:in-person')}
                </h2>

                <div className="pb-4">
                    <p className={paraStyle}>{t("contactUsEi:ask-not-visit")}</p>
                </div>

                <dl className="divide-y-2 border-y-2">
                    <div className={tableRowStyle}>
                        <dt className={dtStyle}>{t("contactUsEi:before-come.dt")}</dt>
                        <dd className={ddStyle}>
                            <p>{t("contactUsEi:before-come.dd.1")}</p>
                            <p><strong>{t("contactUsEi:before-come.dd.2")}</strong></p>
                            <p>{t("contactUsEi:before-come.dd.3")}</p>
                            <ul className="list-disc ps-[1.625em]">
                                <li>{t("contactUsEi:before-come.dd.3.li.1")}</li>
                                <li>{t("contactUsEi:before-come.dd.3.li.2")}</li>
                                <li>{t("contactUsEi:before-come.dd.3.li.3")}</li>
                            </ul>
                            <p>{t("contactUsEi:before-come.dd.4")}</p>
                            <ul className="list-disc ps-[1.625em]">
                                <li>{t("contactUsEi:before-come.dd.4.li.1")}</li>
                                <li>{t("contactUsEi:before-come.dd.4.li.2")}</li>
                                <li>{t("contactUsEi:before-come.dd.4.li.3")}</li>
                            </ul>
                        </dd>
                    </div>
                    <div className={tableRowStyle}>
                        <dt className={dtStyle}>{t("contactUsEi:find-location.dt")}</dt>
                        <dd className={ddStyle}>
                            <InlineLink to={t("contactUsEi:find-location.dd.href")} newTabIndicator={true}>
                                {t("contactUsEi:find-location.dd")}
                            </InlineLink>
                        </dd>
                    </div>
                    <div className={tableRowStyle}>
                        <dt className={dtStyle}>{t("contactUsEi:person.hours.dt")}</dt>
                        <dd className={ddStyle}>
                            <div className="flex">
                                <div>
                                    <FontAwesomeIcon
                                        className="pr-2 pt-1"
                                        style={{ color: '#2572B4' }}
                                        icon={faClock}
                                    /></div>
                                <div>
                                    <p>{t("contactUsEi:person.hours.dd.1")}</p>
                                    <p><strong>{t("contactUsEi:person.hours.dd.2")}</strong></p>
                                </div>
                            </div>
                        </dd>
                    </div>
                </dl>

                <div className="mt-4 pb-6"></div>

                <h2 id="ei-contact-mail" className={headingStyle}>
                    {t('contactUsEi:mail')}
                </h2>

                <ProvinceMailContactCard addrs={t("contactUsEi:mail-ab", { returnObjects: true })} />
                <ProvinceMailContactCard addrs={t("contactUsEi:mail-bc", { returnObjects: true })} />
                <ProvinceMailContactCard addrs={t("contactUsEi:mail-mb", { returnObjects: true })} />
                <ProvinceMailContactCard addrs={t("contactUsEi:mail-nb", { returnObjects: true })} />
                <ProvinceMailContactCard addrs={t("contactUsEi:mail-nt", { returnObjects: true })} />
                <ProvinceMailContactCard addrs={t("contactUsEi:mail-ns", { returnObjects: true })} />
                <ProvinceMailContactCard addrs={t("contactUsEi:mail-nu", { returnObjects: true })} />
                <ProvinceMailContactCard addrs={t("contactUsEi:mail-on", { returnObjects: true })} />
                <ProvinceMailContactCard addrs={t("contactUsEi:mail-pe", { returnObjects: true })} />
                <ProvinceMailContactCard addrs={t("contactUsEi:mail-qc", { returnObjects: true })} />
                <ProvinceMailContactCard addrs={t("contactUsEi:mail-sk", { returnObjects: true })} />
                <ProvinceMailContactCard addrs={t("contactUsEi:mail-yt", { returnObjects: true })} />

            </div>
        </>
    )
}

// TODO: Move to its own file
type ProvinceMailContactCardProps = {
    addrs: {
        summary: string
        forReports: {
            title: string
            addr: string[]
        }
        forDocs: {
            title: string
            addr: string[]
        }
    }
}

function ProvinceMailContactCard({ addrs }: ProvinceMailContactCardProps) {
    return (
        <>
            <div className="py-2">
                <details className="mb-5px font-body text-20px text-gray-darker">
                    <summary className="cursor-pointer select-none rounded border border-gray-40 px-15px py-5px text-deep-blue-60d outline-none hover:text-blue-hover hover:underline">
                        {addrs.summary}
                    </summary>
                    <div className="cursor-pointer select-none rounded-b border border-gray-40 px-18px py-5px outline-none">
                        <div className="grid grid-cols-2 text-xl">
                            <div className="col-span-2 cursor-default select-text py-3 md:col-span-1 font-display">
                                <p className="font-bold">{addrs.forReports.title}</p>
                                {addrs.forReports.addr.map((addrLine, _index) => (
                                    <p>{addrLine}</p>
                                ))}
                            </div>
                            <div className="col-span-2 cursor-default select-text py-3 md:col-span-1 font-display">
                                <p className="font-bold">{addrs.forDocs.title}</p>
                                {addrs.forDocs.addr.map((addrLine, _index) => (
                                    <p>{addrLine}</p>
                                ))}
                            </div>
                        </div>
                    </div>
                </details>

            </div>
        </>
    )
}