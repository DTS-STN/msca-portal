import type { Session } from 'react-router';
import { redirect } from 'react-router';

import type { Route } from './+types/callback';

import { getRaoidcClient } from '~/.server/auth/raoidc-client';
import { serverEnvironment } from '~/.server/environment';
import { getSession, commitSession } from '~/.server/session';
import { updateMscaNg } from '~/.server/utils/auth-utils';
import { withSpan } from '~/.server/utils/telemetry-utils';
import { HttpStatusCodes } from '~/utils/http-status-codes';

/**
 * Allows errors to be handled by root.tsx
 */
export default function Callback() {
  return <></>;
}

/**
 * Handles the authentication callback for a given provider.
 */
export async function loader({ context, unstable_pattern, params, request }: Route.LoaderArgs) {
  return handleCallback({ context, unstable_pattern, params, request });
}

function handleCallback({ context, unstable_pattern, params, request }: Route.LoaderArgs): Promise<Response> {
  return withSpan('routes.auth.callback.handle_callback', async (span) => {
    const session: Session = await getSession(request.headers.get('Cookie'));
    const currentUrl = new URL(request.url);

    span.setAttribute('request_url', currentUrl.toString());

    const loginState = session.get('loginState');
    if (loginState === undefined) {
      span.addEvent('login_state.invalid');
      return Response.json({ message: 'Invalid login state' }, { status: HttpStatusCodes.BAD_REQUEST });
    }

    const returnUrl = loginState.returnUrl ?? new URL('/en', currentUrl.origin);

    span.setAttribute('return_url', returnUrl.toString());

    span.addEvent('token_exchange.start');

    const raoidcClient = await getRaoidcClient();

    const opts = serverEnvironment.AUTH_ENABLE_STUB_LOGIN
      ? {
          birthdate: session.get('stubloginState')?.birthdate,
          locale: session.get('stubloginState')?.locale,
          sin: session.get('stubloginState')?.sin,
        }
      : {};

    const tokenSet = await raoidcClient.handleCallbackRequest(
      request,
      loginState.codeVerifier,
      loginState.nonce,
      loginState.state,
      new URL('/auth/callback', currentUrl.origin),
      opts,
    );

    span.addEvent('token_exchange.end');

    session.set('authState', {
      accessToken: tokenSet.accessToken,
      idTokenClaims: tokenSet.idToken,
      userinfoTokenClaims: tokenSet.userinfoToken,
    });

    session.unset('loginState');
    session.unset('stubloginState');

    updateMscaNg(tokenSet.userinfoToken.sin ?? '', tokenSet.userinfoToken.sub);

    await commitSession(session);

    return redirect(returnUrl.toString());
  });
}
