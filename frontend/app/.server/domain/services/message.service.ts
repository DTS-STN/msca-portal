import type { MessagesRequestDto, PdfRequestDto } from '../dtos/message.dto';
import type { MessageEntity } from '../entities/message.entity';
import type { MessageDtoMapper } from '../mappers/messages.dto.mapper';
import { getMessageDtoMapper } from '../mappers/messages.dto.mapper';
import type { MessageRepository } from '../repositories/message.repository';
import { getMessageRepository } from '../repositories/message.repository';

import { LogFactory } from '~/.server/logging';
import moize from 'moize'

const log = LogFactory.getLogger(import.meta.url);

export const getMessageService = moize(createMessageService, {
  onCacheAdd: () => console.log('Creating new open id client service'),
})
export interface MessageService {
  /**
   * Find all letters for a given client id.
   *
   * @param lettersRequestDto The letters request dto that includes the client id and user id for auditing
   * @returns A Promise that resolves to all letters found for the client id.
   */
  findMessagesBySin(messagesRequestDto: MessagesRequestDto): Promise<MessageEntity[]>;

  /**
   * Retrieve the PDF for a given message id.
   *
   * @param pdfRequestDto  The PDF request dto that includes the message id
   * @returns A Promise that resolves to the PDF data as a base64-encoded string representing the bytes.
   */
  getPdfByMessageId(pdfRequestDto: PdfRequestDto): Promise<string>;
}

export function createMessageService(): MessageService {
  const mapper = getMessageDtoMapper();
  const repo = getMessageRepository();
  return new DefaultMessageService(mapper, repo);
}

export class DefaultMessageService implements MessageService {
  private readonly messageDtoMapper: MessageDtoMapper;
  private readonly messageRepository: MessageRepository;

  constructor(messageDtoMapper: MessageDtoMapper, messageRepository: MessageRepository) {
    this.messageDtoMapper = messageDtoMapper;
    this.messageRepository = messageRepository;
    this.init();
  }

  private init(): void {
    log.debug('DefaultLetterService initiated.');
  }

  async findMessagesBySin({ sin, userId }: MessagesRequestDto): Promise<MessageEntity[]> {
    log.trace('Finding letters with clientId [%s]', sin);

    const messageDtos = await this.messageRepository.findMessagesBySin(sin, userId);
    log.trace('Returning letters [%j] for clientId [%s]', messageDtos, sin);

    return this.messageDtoMapper.mapMessageDtosToMessageEntities(messageDtos);
  }

  async getPdfByMessageId({ letterId, userId }: PdfRequestDto): Promise<string> {
    log.trace('Finding PDF with messageId [%s]', letterId);

    const pdfDto = await this.messageRepository.getPdfByMessageId(letterId, userId);
    const pdf = this.messageDtoMapper.mapPdfDtoToString(pdfDto);

    log.trace('Returning pdf [%s] for letterId [%s]', pdf, letterId);
    return pdf;
  }
}
