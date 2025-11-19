import { useState, useContext } from 'react';

import type { RouteHandle } from 'react-router';

import { useTranslation } from 'react-i18next';
import ReactPaginate from 'react-paginate';

import { inboxContext } from '../routes/inbox';
import MessageList from './MessageList';

import type { MessageEntity } from '~/.server/domain/entities/message.entity';
import { handle as parentHandle } from '~/routes/layout';

export const handle = {
  i18nNamespace: [...parentHandle.i18nNamespace],
} as const satisfies RouteHandle;

interface PaginatedMessagesProps {
  messages: MessageEntity[];
}

export default function PaginatedMessages({ messages }: PaginatedMessagesProps) {
  const { t } = useTranslation(['inbox']);
  const { messagesPerPage, pageRangeDisplayed } = useContext(inboxContext);
  const [itemOffset, setItemOffset] = useState(0);
  const endOffset = itemOffset + messagesPerPage;
  const currentItems = messages.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(messages.length / messagesPerPage);

  const handlePageClick = (selectedItem: { selected: number }) => {
    const pageSelected = selectedItem.selected;
    const newOffset = pageSelected * messagesPerPage;
    setItemOffset(newOffset);
  };

  return (
    <>
      <MessageList messageEntities={currentItems} />
      {pageCount > 1 ? (
        <ReactPaginate
          breakLabel="..."
          nextLabel={t('inbox:pagination-text.next-link')}
          previousLabel={t('inbox:pagination-text.previous-link')}
          onPageChange={handlePageClick}
          pageRangeDisplayed={pageRangeDisplayed}
          pageCount={pageCount}
          renderOnZeroPageCount={null}
          containerClassName="flex space-x-1"
          ariaLabelBuilder={(page: number, selected: number) =>
            selected
              ? `${t('inbox:pagination-text.page')}${page}${t('inbox:pagination-text.current-page-aria-label')}`
              : `${t('inbox:pagination-text.page')}${page}`
          }
          pageLinkClassName="px-3 rounded-md py-1 cursor-pointer transition-all duration-200
                    underline underline-offset-4 decoration-gray-dark
                    hover:bg-brighter-blue-light hover:text-blue-hover
                    focus:outline-none focus:no-underline focus:bg-blue-hover focus:text-white focus:border 
                    focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-hover"
          previousAriaLabel={t('inbox:pagination-text.previous-aria-label')}
          previousLinkClassName="px-3 underline underline-offset-4 decoration-gray-dark"
          nextAriaLabel={t('inbox:pagination-text.next-aria-label')}
          nextLinkClassName="px-3 underline underline-offset-4 decoration-gray-dark"
          activeLinkClassName="bg-deep-blue-dark no-underline no-hover text-white"
          disabledLinkClassName="text-gray-dark cursor-not-allowed"
        />
      ) : null}
    </>
  );
}
