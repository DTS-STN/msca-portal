import type { RouteHandle } from 'react-router';
import { Outlet, useNavigate } from 'react-router';

import { useTranslation } from 'react-i18next';

import type { Route } from './+types/layout';

import { requireAuth } from '~/.server/utils/auth-utils';
import { AppBar } from '~/components/app-bar';
import { Breadcrumbs } from '~/components/breadcrumbs';
import { Footer } from '~/components/footer';
import { LanguageSwitcher } from '~/components/language-switcher';
import { AppLink } from '~/components/links';
import { PageDetails } from '~/components/page-details';
import { SessionTimeout } from '~/components/session-timeout';
import { SkipNavigationLinks } from '~/components/skip-navigation-links';
import { useLanguage } from '~/hooks/use-language';
import { useRoute } from '~/hooks/use-route';
import { useBreadcrumbs, useI18nNamespaces } from '~/utils/route-utils';

export const handle = {
  breadcrumbs: [],
  i18nNamespace: [
    'app',
    'gcweb',
    'inbox',
    'inboxNowAvailable',
    'inboxNotificationPreferencesSuccess',
    'inboxNotificationPreferences',
    'contactUs',
    'contactUsEi',
    'contactUsCpp',
    'contactUsOas',
    'securitySettings',
  ],
} as const satisfies RouteHandle;

export async function loader({ context, request }: Route.LoaderArgs) {
  const { userinfoTokenClaims } = await requireAuth(context.session, request);
  return { name: userinfoTokenClaims.sin };
}

export default function Layout({ loaderData }: Route.ComponentProps) {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation(handle.i18nNamespace);
  const { id: pageId } = useRoute();
  const navigate = useNavigate();

  const {
    BUILD_DATE, //
    BUILD_VERSION,
    SESSION_TIMEOUT_PROMPT_SECONDS,
    SESSION_TIMEOUT_SECONDS,
  } = globalThis.__appEnvironment;

  return (
    <>
      <SessionTimeout
        promptBeforeIdle={SESSION_TIMEOUT_PROMPT_SECONDS * 1000}
        timeout={SESSION_TIMEOUT_SECONDS * 1000}
        onSessionEnd={() => navigate(`/auth/logout?lang=${currentLanguage}`)}
        onSessionExtend={() => void fetch('/auth/session-refresh', { method: 'POST' })}
      />
      <header className="print:hidden" data-testid="header">
        <SkipNavigationLinks />
        <div id="wb-bnr">
          <div className="container flex items-center justify-between gap-6 py-2.5 sm:py-3.5">
            <AppLink to="https://canada.ca/">
              <img
                className="h-8 w-auto"
                src={`https://www.canada.ca/etc/designs/canada/wet-boew/assets/sig-blk-${currentLanguage}.svg`}
                alt={t('gcweb:header.govt-of-canada.text')}
                width="300"
                height="28"
                decoding="async"
              />
              <span className="sr-only">
                {' '}
                /<span lang={t('gcweb:header.other-lang')}>{t('gcweb:header.govt-of-canada.other-lang-text')}</span>
              </span>
            </AppLink>
            <LanguageSwitcher>{t('gcweb:language-switcher.alt-lang')}</LanguageSwitcher>
          </div>
        </div>
        <AppBar name={t('gcweb:app.account')} />
      </header>
      <PageBreadcrumbs language={currentLanguage ?? 'en'} />
      <main className="container print:w-full print:max-w-none">
        <Outlet />
        <PageDetails buildDate={BUILD_DATE} buildVersion={BUILD_VERSION} pageId={pageId} />
      </main>
      <Footer bilingual={false} />
    </>
  );
}

function PageBreadcrumbs({ language }: { language: string }) {
  const { t } = useTranslation(useI18nNamespaces());
  const breadcrumbs = useBreadcrumbs();
  const { MSCA_BASE_URL } = globalThis.__appEnvironment;

  if (breadcrumbs.length > 0) {
    return (
      <Breadcrumbs
        items={breadcrumbs.map((item) => ({
          text: t(item.labelI18nKey),
          to: `${MSCA_BASE_URL}/${language}${item.to}`,
        }))}
        refPageAA="mscaPlaceholder"
      />
    );
  }
}
