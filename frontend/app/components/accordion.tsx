import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';

import Markdown from 'markdown-to-jsx';
import { z } from 'zod';

import { ContextualAlert } from './contextual-alert';
import ViewMoreLessButton from './view-more-less-button';

import { getContextualAlertType } from '~/utils/application-code-utils';

type AlertProps = {
  id: string;
  type: string;
  alertHeading: string;
  alertBody: string;
};

interface AccordionProps {
  cardTitle: string;
  viewMoreLessCaption: string;
  programUniqueId?: string;
  acronym: string;
  refPageAA: string;
  children: ReactNode;
  locale: string;
  cardAlert?: AlertProps[];
  accordionAlert?: AlertProps[];
  hasAlert?: boolean;
}

export function Accordion({
  cardAlert = [],
  locale,
  cardTitle,
  viewMoreLessCaption,
  programUniqueId,
  acronym,
  refPageAA,
  children,
}: AccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  const CardState = z
    .string()
    .toLowerCase()
    .transform((x) => x === 'true')
    .pipe(z.boolean());
  let reactDevBufferSet = false;

  /**
   * init Effect
   *
   * In dev mode (npm run dev) React will prerender and render
   * useEffects on page. This renders the page twice in dev mode,
   * which erases the state.
   *
   * The reactDevBufferSet ensures it will only trigger once.
   *
   * This doesn't occur outside of dev.
   *
   * TODO: Moving the state out of the individual Cards and into
   * a unified state/context may fix this this load issue.
   */
  useEffect(() => {
    if (!reactDevBufferSet) {
      reactDevBufferSet = true; // eslint-disable-line
      if (programUniqueId !== undefined) {
        const sessionItem = sessionStorage.getItem(programUniqueId);

        setIsOpen(sessionItem !== null ? CardState.parse(sessionItem) : false);
      }
    }
  }, []);

  // on change Effect
  useEffect(() => {
    if (programUniqueId !== undefined) {
      sessionStorage.setItem(programUniqueId, String(isOpen));
    }
  }, [isOpen, programUniqueId]);

  return (
    <>
      <ViewMoreLessButton
        id={programUniqueId + 'test-card-button-'}
        dataTestid={programUniqueId?.toString() + 'dataTestId'}
        dataCy="viewMoreLessButton"
        onClick={() => {
          const newOpenState = !isOpen;
          setIsOpen(newOpenState);
        }}
        ariaExpanded={isOpen}
        icon={isOpen}
        caption={viewMoreLessCaption}
        className="w-full px-3 pb-6 sm:px-8 md:px-15 md:pt-4 md:pb-8"
        acronym={acronym}
        refPageAA={refPageAA}
        ariaLabel={`${cardTitle} - ${viewMoreLessCaption}`}
      />
      {!isOpen ? null : (
        <div>
          {cardAlert.map((alert, index) => {
            const alertTypeString = alert.type.split('/').pop();
            const alertType = getContextualAlertType(alertTypeString ?? null);
            return (
              <div className="text-gray-darker w-full pb-3 font-sans text-xl sm:px-8 sm:pb-6 md:px-15" key={index}>
                <ContextualAlert type={alertType}>
                  <h2 className="font-lato text-deep-blue-dark text-2xl font-bold">{alert.alertHeading}</h2>
                  <Markdown
                    options={{
                      overrides: {
                        p: {
                          props: {
                            className: 'mb-3',
                          },
                        },
                        a: {
                          props: {
                            className: 'underline text-deep-blue-dark cursor-pointer',
                            rel: 'noopener noreferrer', // Security, avoids external site opened through this site to have control over this site
                            target: '_blank',
                          },
                        },
                      },
                    }}
                  >
                    {alert.alertBody}
                  </Markdown>
                </ContextualAlert>
              </div>
            );
          })}
          <div className="pb-6" data-cy="sectionList">
            {children}
          </div>
        </div>
      )}
    </>
  );
}
