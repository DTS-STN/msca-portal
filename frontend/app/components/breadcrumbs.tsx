import type { ReactNode } from 'react';

import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';

import { InlineLink } from './links';

import { useLanguage } from '~/hooks/use-language';
import type { I18nRouteId } from '~/i18n-routes';
import { getPathById } from '~/utils/route-utils';

export interface BreadcrumbProps {
  text: string;
  routeId?: I18nRouteId;
  to?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbProps[];
  refPageAA?: string;
}

export function Breadcrumbs({ items = [], refPageAA = 'mscaPlaceholder' }: BreadcrumbsProps) {
  const { t } = useTranslation(['gcweb']);

  return (
    <nav id="wb-bc" property="breadcrumb" className="my-4" aria-label={t('gcweb:breadcrumbs.arialabel')}>
      <h2 id="breadcrumbs" className="sr-only">
        {t('gcweb:breadcrumbs.you-are-here')}
      </h2>
      <div className="container">
        <ol className="text-deep-blue-dark flex flex-wrap items-center gap-x-3 gap-y-1">
          {items.map(({ text, routeId, to }, idx) => {
            return (
              <li key={text} property="itemListElement" typeof="ListItem" className="flex items-center">
                {idx !== 0 && <FontAwesomeIcon icon={faChevronRight} className="mr-2 size-3 text-slate-700" />}
                <Breadcrumb routeId={routeId} to={to}>
                  {text}
                </Breadcrumb>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}

function Breadcrumb({ children, routeId, to }: { children: ReactNode; routeId?: I18nRouteId; to?: string }) {
  const { currentLanguage } = useLanguage();
  const href = routeId === undefined ? '' : getPathById(routeId, { lang: currentLanguage });

  // prettier-ignorecurrentlanguage
  return routeId === undefined && to === undefined ? (
    <span property="name">{children}</span>
  ) : (
    <InlineLink to={href} property="item" typeof="WebPage">
      <span property="name">{children}</span>
    </InlineLink>
  );
}
