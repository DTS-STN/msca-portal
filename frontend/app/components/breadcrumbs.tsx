import type { ReactNode } from 'react';

import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';

import { InlineLink } from './links';

export interface BreadcrumbProps {
  text: string;
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
          {items.map(({ text, to }, idx) => {
            return (
              <li key={text} property="itemListElement" typeof="ListItem" className="flex items-center">
                {idx !== 0 && <FontAwesomeIcon icon={faChevronRight} className="mr-2 size-3 text-slate-700" />}
                <Breadcrumb to={to}>{text}</Breadcrumb>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}

function Breadcrumb({ children, to }: { children: ReactNode; routeId?: string; to?: string }) {
  // prettier-ignore
  return to === undefined
    ? <span property="name">{children}</span>
    : <InlineLink to={to} property="item" typeof="WebPage"><span property="name">{children}</span></InlineLink>;
}
