import type { Params } from 'react-router';

import { useTranslation } from 'react-i18next';

import { InlineLink } from './links';

import type { MessageEntity } from '~/.server/domain/entities/message.entity';
import { useLanguage } from '~/hooks/use-language';

interface MessageListProps {
  messageEntities: MessageEntity[];
  params: Params;
  engVerboseMessages: Map<string, string>;
  frVerboseMessages: Map<string, string>;
}

export default function MessageList({ messageEntities, params, engVerboseMessages, frVerboseMessages }: MessageListProps) {
  const { t } = useTranslation(['inbox']);

  const { currentLanguage } = useLanguage();

  return (
    <>
      {messageEntities.length === 0 ? (
        <>
          <div className="space-y-4">
            <div className={`flex justify-center bg-[rgba(248,248,249,1)] px-6 py-3 text-2xl`}>
              {t('inbox:no-messages-text')}
            </div>
          </div>
        </>
      ) : (
        <>
          <table className="mt-8 mb-8 w-full border-collapse">
            <tbody>
              {messageEntities.map((message: MessageEntity) => {
                const trimmedMessageName = message.messageName.trim();
                let frenchLetterName = engVerboseMessages.get(trimmedMessageName);
                frenchLetterName = frenchLetterName ?? trimmedMessageName;
                let englishLetterName = frVerboseMessages.get(trimmedMessageName);
                englishLetterName = englishLetterName ?? trimmedMessageName;
                const letterName: string = currentLanguage === 'en' ? englishLetterName : frenchLetterName;

                const gcAnalyticsCustomClickValue = `ESDC-EDSC_MSCA-MDSC-SCH:DARS-SMCD Letters Click:${englishLetterName}`;
                const date = new Date(message.messageDate);
                const dateLanguage = currentLanguage + '-CA';
                const formattedDate = date.toLocaleString(dateLanguage, {
                  dateStyle: 'long',
                });

                return (
                  <tr
                    key={message.messageId}
                    className="flex flex-col border-b-2 border-gray-300 px-4 py-4 first:border-t-2 sm:py-6 md:flex-row"
                  >
                    <td className="w-full md:w-[500px]">
                      <InlineLink
                        reloadDocument
                        file="routes/$id.download.ts"
                        params={{ ...params, id: message.messageId }}
                        className="text-blue-default hover:text-blue-hover focus:outline-blue-hover flex items-center rounded-sm py-1 text-2xl underline focus:outline-1"
                        target="_blank"
                        data-gc-analytics-customclick={gcAnalyticsCustomClickValue}
                      >
                        {letterName} (PDF)
                      </InlineLink>

                      <p className="py-1">{message.messageType}</p>
                    </td>
                    <td className="align-top text-[#43474e] md:pl-[100px]">{formattedDate}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}
    </>
  );
}
