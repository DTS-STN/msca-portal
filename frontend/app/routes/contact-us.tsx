import { requireAuth } from "~/.server/utils/auth-utils";
import { Route } from "./+types/inbox-now-available";
import { getTranslation } from "~/i18n-config.server";
import { handle as parentHandle } from '~/routes/layout';
import { Link, RouteHandle } from "react-router";
import { AppError } from "~/errors/app-error";
import { ErrorCodes } from "~/errors/error-codes";
import { useTranslation } from "react-i18next";
import { PageTitle } from "~/components/page-title";
import { ButtonLink } from "~/components/button-link";
import { serverEnvironment } from "~/.server/environment";
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
                    <li className="mb-6 ml-5"><InlineLink to={t('contactUs:cdcp.href')}>{t('contactUs:cdcp')}</InlineLink></li>
                    <li className="mb-6 ml-5"><InlineLink to={t('contactUs:ei.href')}>{t('contactUs:ei')}</InlineLink></li>
                    <li className="mb-6 ml-5"><InlineLink to={t('contactUs:cpp.href')}>{t('contactUs:cpp')}</InlineLink></li>
                    <li className="mb-6 ml-5">
                        <InlineLink to={t('contactUs:oas.href')}>{t('contactUs:oas')}</InlineLink>
                        <p className="text-xl text-gray-darker">{t('contactUs:oas.more-info')}</p>
                    </li>
                    <li className="mb-6 ml-5"><InlineLink to={t('contactUs:cdb.href')}>{t('contactUs:cdb')}</InlineLink></li>
                    <li className="mb-6 ml-5"><InlineLink to={t('contactUs:sin.href')}>{t('contactUs:sin')}</InlineLink></li>
                </ul>
            </div>

        </>
    );
}