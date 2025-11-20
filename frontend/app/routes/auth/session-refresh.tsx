import type { Route } from '.react-router/types/app/routes/auth/+types/session-refresh';

import { requireAuth } from '~/.server/utils/auth-utils';

export async function action({ context, params, request }: Route.ActionArgs) {
  await requireAuth(request);
  return Response.json(true);
}
