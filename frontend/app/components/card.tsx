import { useEffect, useState } from 'react';

import { z } from 'zod';

type AlertProps = {
  id: string;
  type: string;
  alertHeading: string;
  alertBody: string;
};
type CardProps = {
  cardTitle: string;
  viewMoreLessCaption: string;
  programUniqueId?: string;
  acronym: string;
  refPageAA: string;
  children: React.ReactNode;
  locale: string;
  cardAlert?: AlertProps[];
  hasAlert?: boolean;
};

export function Card({
  cardAlert = [
    {
      id: '',
      type: '',
      alertHeading: '',
      alertBody: '',
    },
  ],
  locale,
  cardTitle,
  viewMoreLessCaption,
  programUniqueId,
  acronym,
  refPageAA,
  children,
}: CardProps) {
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
    <div className="my-6 rounded border border-gray-300 shadow" data-cy="cards">
      <h2
        className="font-lato text-gray-750 px-3 py-4 text-4xl font-semibold sm:px-8 md:mt-2 md:px-15 md:py-8"
        data-cy="cardtitle"
      >
        {cardTitle}
      </h2>
    </div>
  );
}
