import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import type { TaskListProps } from './benefit-tasks';
import { AppLink } from './links';

import { buildLink } from '~/utils/link-utils';

interface MostReqTasksProps {
  locale: string;
  dataCy?: string;
  taskList: TaskListProps | undefined;
  refPageAA: string;
  acronym: string;
}

export function MostReqTasks({
  locale = 'en',
  dataCy,
  taskList = {
    tasks: [
      {
        title: 'mscaPlaceholder',
        link: 'mscaPlaceholderHref',
        id: Math.random().toString(),
      },
    ],
    title: 'mscaPlaceholder',
    aaTitle: 'mscaPlaceholder',
  },
  refPageAA = 'mscaPlaceholder',
  acronym,
}: MostReqTasksProps) {
  const newTabTaskExceptions: string[] = [];
  const ulClass =
    taskList.tasks.length > 3
      ? 'xs:gap-x-5 grid list-outside list-disc grid-cols-1 px-9 pt-2 pb-5 text-white sm:auto-cols-fr sm:grid-flow-col sm:grid-cols-2 sm:grid-rows-3 sm:px-14 md:px-[100px] md:pt-4'
      : 'grid list-outside list-disc grid-cols-1 px-9 pt-2 pb-5 text-white sm:px-14 md:px-[100px] md:pt-4';
  return (
    <div className="h-full">
      <h3 className="pt-6 pl-3 text-xl font-bold text-white sm:pl-8 md:pl-15" data-cy={dataCy}>
        {taskList.title}
      </h3>

      <ul className={ulClass} data-cy="most-req-links">
        {taskList.tasks.map((task, index) => {
          return (
            <li key={index} className="justify-center py-2 font-bold" data-cy="most-req-tasklink">
              <AppLink
                aria-label={`${taskList.title} - ${task.title} -
                            ${
                              newTabTaskExceptions.includes(task.link)
                                ? locale === 'fr'
                                  ? "S'ouvre dans un nouvel onglet"
                                  : 'Opens in a new tab'
                                : ''
                            }`}
                to={buildLink(task.linkType, task.link)}
                target={newTabTaskExceptions.includes(task.link) ? '_blank' : '_self'}
                rel={newTabTaskExceptions.includes(task.link) ? 'noopener noreferrer' : undefined}
                data-gc-analytics-customclick={`${refPageAA} ${acronym} ${taskList.aaTitle}:${task.id}`}
                className="hover:text-gray-50a rounded-sm text-white underline focus:outline-1 focus:outline-white"
              >
                <span className="static text-xl font-normal">
                  {task.title}
                  <span>
                    {newTabTaskExceptions.includes(task.link) ? (
                      <FontAwesomeIcon
                        className="absolute ml-1.5 pt-0.5"
                        width="14"
                        icon={faArrowUpRightFromSquare}
                      ></FontAwesomeIcon>
                    ) : null}
                  </span>
                </span>
              </AppLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
