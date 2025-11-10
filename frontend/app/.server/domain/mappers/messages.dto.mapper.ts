import type { MessageDto, PdfDto } from '../dtos/message.dto';
import type { MessageEntity } from '../entities/message.entity';

import { LogFactory } from '~/.server/logging';

const log = LogFactory.getLogger(import.meta.url);

export interface MessageDtoMapper {
  mapMessageDtosToMessageEntities(messageDtos: readonly MessageDto[]): MessageEntity[];

  mapPdfDtoToString(pdfDto: PdfDto): string;
}

export function getMessageDtoMapper(): MessageDtoMapper {
  return new DefaultMessageDtoMapper();
}

export class DefaultMessageDtoMapper implements MessageDtoMapper {
  mapMessageDtosToMessageEntities(messageDtos: readonly MessageDto[]): MessageEntity[] {
    return messageDtos.map((messageDto) => this.mapMessageDtoToMessageEntity(messageDto));
  }

  private mapMessageDtoToMessageEntity(messageDto: MessageDto): MessageEntity {
    log.trace('message id' + messageDto.LetterId);
    return {
      messageId: messageDto.LetterId,
      messageDate: messageDto.LetterDate,
      messageName: messageDto.LetterName,
      messageType: messageDto.LetterType,
    };
  }

  mapPdfDtoToString(pdfDto: PdfDto): string {
    return pdfDto.documentBytes;
  }
}
