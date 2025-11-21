import { redirect } from 'react-router';

import type { Route } from '../routes/+types/intake';

import { requireAuth } from '~/.server/utils/auth-utils';
import { BilingualNotFound } from '~/components/error-boundaries';
import { AppError } from '~/errors/app-error';
import { ErrorCodes } from '~/errors/error-codes';
import { getPathById } from '~/utils/route-utils';

export async function loader({ context, params, request }: Route.LoaderArgs) {
  // ECAS and the apps redirect to the index with a search parameter of Lang=fra or Lang=eng
  const { ECAS_BASE_URL, CURAM_REDIRECT } = globalThis.__appEnvironment;
  const searchParams = new URL(request.url).searchParams;
  const lang = searchParams.get('Lang');
  const link = searchParams.get('link');

  // TODO: Investigate why there's a comment saying that if we're already logged in, to skip the redirect.
  const { userinfoTokenClaims } = await requireAuth(context.session, request);

  if (!userinfoTokenClaims.sin) {
    throw new AppError('No SIN found in userinfo token', ErrorCodes.MISSING_SIN);
  }

  if (lang && link) {
    const redirectTarget = `${ECAS_BASE_URL}/${CURAM_REDIRECT}?link=${link}&Lang=${lang}`;
    return redirect(redirectTarget);
  }

  if (lang) {
    const decodedLang = lang === 'eng' ? 'en' : 'fr';
    return redirect(getPathById('my-dashboard', { lang: decodedLang }));
  }

  return {};
}

export default function Intake({ loaderData }: Route.ComponentProps) {
  return <BilingualNotFound params={loaderData} error={'404'} />;
}
