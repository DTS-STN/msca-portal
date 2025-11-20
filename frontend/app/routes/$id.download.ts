import type { RouteHandle } from 'react-router';
import { data, Session, SessionData } from 'react-router';
import { getSession } from '~/.server/session';
import { requireAuth } from '~/.server/utils/auth-utils';
import { AppError } from '~/errors/app-error';
import { ErrorCodes } from '~/errors/error-codes';
import { handle as parentHandle } from '~/routes/layout';
import { MessageEntity } from '~/.server/domain/entities/message.entity';
import { getMessageService } from '~/.server/domain/services/message.service';
import { Route } from './+types/$id.download';

export const handle = {
  i18nNamespace: [...parentHandle.i18nNamespace],
} as const satisfies RouteHandle;

export async function loader({ context, params, request }: Route.LoaderArgs) {
  const session: Session<SessionData, SessionData> = await getSession(request.headers.get('Cookie'))
  const { userinfoTokenClaims } = await requireAuth(request);

  if (!params.id) {
    throw data(null, { status: 400 });
  }

  // Check if the letters are in the session
  const messages: readonly MessageEntity[] | undefined = session.get('messages');
  // Optional TODO: add a check to see if the letter belongs to the user. (Done with LetterService call)
  if (!messages) {
    throw data(null, { status: 404 });
  }

  const message = messages.find((message) => message.messageId === params.id);

  if (!message) {
    throw data(null, { status: 404 });
  }

  if (!userinfoTokenClaims.sin) {
    throw new AppError('No SIN found in userinfo token', ErrorCodes.AUTH_USERINFO_FETCH_ERROR);
  }
  const user = userinfoTokenClaims.sub;

  const pdfBytes = await getMessageService().getPdfByMessageId({ letterId: params.id, userId: user });

  const decodedPdfBytes = Buffer.from(pdfBytes, 'base64');
  return new Response(decodedPdfBytes, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Length': decodedPdfBytes.length.toString(),
      'Content-Disposition': `inline; filename="${params.id}.pdf"`,
    },
  });
}
