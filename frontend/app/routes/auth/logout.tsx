import type { Session } from 'react-router';
import { redirect } from 'react-router';

import type { Route } from './+types/logout';

import { getRaoidcClient } from '~/.server/auth/raoidc-client';
import { serverEnvironment } from '~/.server/environment';
import { LogFactory } from '~/.server/logging';
import { getSession } from '~/.server/session';
import { withSpan } from '~/.server/utils/telemetry-utils';

const log = LogFactory.getLogger(import.meta.url);

/**
 * Allows errors to be handled by root.tsx
 */
export default function Logout() {
  return <></>;
}

export function loader({ context, unstable_pattern, params, request }: Route.LoaderArgs) {
  return handleLogout({ context, unstable_pattern, params, request });
}

function handleLogout({ context, params, request }: Route.LoaderArgs): Promise<Response> {
  return withSpan('routes.auth.logout.handle_logout', async (span) => {
    const session: Session = await getSession(request.headers.get('Cookie'));
    const currentUrl = new URL(request.url);

    span.setAttribute('request_url', currentUrl.toString());

    if (!session.get('authState')?.idTokenClaims) {
      log.debug(`User has not authenticated; bypassing RAOIDC logout and redirecting to RASCL logout`);
      span.addEvent('invalid_auth_state');
      return redirect(serverEnvironment.AUTH_RAOIDC_RASCL_LOGOUT_URL);
    }

    const raoidcClient = await getRaoidcClient();

    const authState = session.get('authState');
    const signoutRequest = raoidcClient.generateSignoutRequest(
      authState?.idTokenClaims.sub ?? '',
      currentUrl.searchParams.get('lang') ?? 'en',
    );

    session.unset('authState');
    session.unset('loginState');
    session.unset('stubloginState');

    return redirect(signoutRequest.toString());
  });
}
