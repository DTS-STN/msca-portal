import { requireAuth } from "~/.server/utils/auth-utils";
import { Route } from "./+types/contact-us";
import { getTranslation } from "~/i18n-config.server";
import { handle as parentHandle } from '~/routes/layout';
import { RouteHandle } from "react-router";
import { AppError } from "~/errors/app-error";
import { ErrorCodes } from "~/errors/error-codes";
import { useTranslation } from "react-i18next";
import { PageTitle } from "~/components/page-title";
import { InlineLink } from "~/components/links";

export const handle = {
    i18nNamespace: [...parentHandle.i18nNamespace],
} as const satisfies RouteHandle;

export async function loader({ context, params, request }: Route.LoaderArgs) {
    const { userinfoTokenClaims } = await requireAuth(context.session, request);
    const { t } = await getTranslation(request, handle.i18nNamespace);

    if (!userinfoTokenClaims.sin) {
        throw new AppError('No SIN found in userinfo token', ErrorCodes.MISSING_SIN);
    }

    return { documentTitle: t('contactUs:document-title') };
}

export function meta({ data }: Route.MetaArgs) {
    return [{ title: data?.documentTitle }];
}

export default function ContactUs({ loaderData, params }: Route.ComponentProps) {

    const { t } = useTranslation(handle.i18nNamespace);

    return (
        <>
            <div className="max-w-3xl">
                <div className="mb-8">
                    <PageTitle className="after:w-14">{t('contactUs:page-title')}</PageTitle>
                </div>

                <p className="mb-8 mt-3 text-xl text-gray-darker">{t('contactUs:select-service')}</p>

                <ul className="list-disc" data-cy="contact-task-list">
                    <li className="mb-6 ml-5"><InlineLink to={t('contactUs:cdcp.href')} newTabIndicator={true}>{t('contactUs:cdcp')}</InlineLink></li>
                    <li className="mb-6 ml-5"><InlineLink file="routes/contact-us/employment-insurance.tsx">{t('contactUs:ei')}</InlineLink></li>
                    <li className="mb-6 ml-5"><InlineLink file="routes/contact-us/canada-pension-plan.tsx">{t('contactUs:cpp')}</InlineLink></li>
                    <li className="mb-6 ml-5">
                        <InlineLink file="routes/contact-us/old-age-security.tsx">{t('contactUs:oas')}</InlineLink>
                        <p className="text-xl text-gray-darker">{t('contactUs:oas.more-info')}</p>
                    </li>
                    <li className="mb-6 ml-5"><InlineLink to={t('contactUs:cdb.href')} newTabIndicator={true}>{t('contactUs:cdb')}</InlineLink></li>
                    <li className="mb-6 ml-5"><InlineLink to={t('contactUs:sin.href')} newTabIndicator={true}>{t('contactUs:sin')}</InlineLink></li>
                </ul>
            </div>

        </>
    );
}