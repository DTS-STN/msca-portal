import type { Key } from 'react';

import { Accordion } from './accordion';
import { BenefitTasks } from './benefit-tasks';
import type { TaskListProps } from './benefit-tasks';
import { MostReqTasks } from './most-req-tasks';

type AlertProps = {
  id: string;
  type: string;
  alertHeading: string;
  alertBody: string;
};

interface AccordionProps {
  id: string;
  title: string;
  lists: TaskListProps[];
}

interface CardProps {
  cardTitle: string;
  accordions: AccordionProps[];
  programUniqueId?: string;
  acronym: string;
  refPageAA: string;
  locale: string;
  cardAlert?: AlertProps[];
  hasAlert?: boolean;
}

export function Card({ cardAlert = [], locale, cardTitle, accordions = [], programUniqueId, acronym, refPageAA }: CardProps) {
  return (
    <div className="my-6 rounded border border-gray-300 shadow" data-cy="cards">
      <h2
        className="font-lato text-gray-darker px-3 py-4 text-4xl font-semibold sm:px-8 md:mt-2 md:px-15 md:py-8"
        data-cy="cardtitle"
      >
        {cardTitle}
      </h2>
      {accordions.map((accordion: AccordionProps, index: Key) => {
        const mostReq = accordion.lists[0];
        const tasks = accordion.lists.slice(1, accordion.lists.length);

        return (
          <Accordion
            key={accordion.id + index}
            programUniqueId={accordion.id}
            locale={locale}
            cardTitle={cardTitle}
            viewMoreLessCaption={accordion.title}
            acronym={acronym}
            refPageAA={refPageAA}
            cardAlert={cardAlert}
          >
            <div className="bg-deep-blue-60d" data-cy="most-requested-section">
              <MostReqTasks
                locale={locale}
                taskList={mostReq}
                dataCy="most-requested"
                acronym={acronym}
                refPageAA={refPageAA}
              />
            </div>
            <div className="gap-x-[60px] pt-8 pl-3 sm:pl-8 md:columns-2 md:px-15" data-cy="task-list">
              {tasks.map((taskList: TaskListProps, index: Key) => {
                return (
                  <div key={index} data-cy="Task">
                    <BenefitTasks
                      locale={locale}
                      acronym={acronym}
                      taskList={taskList}
                      dataCy="task-group-list"
                      refPageAA={refPageAA}
                    />
                  </div>
                );
              })}
            </div>
          </Accordion>
        );
      })}
    </div>
  );
}
