import { createRequestHandler } from '@react-router/express';

import type { ViteDevServer } from 'vite';

import { getSession } from '../session';

import { serverEnvironment } from '~/.server/environment';

export function rrRequestHandler(viteDevServer?: ViteDevServer) {
  // dynamically declare the path to avoid static analysis errors 💩
  const rrServerBuild = './app.js';

  return createRequestHandler({
    mode: serverEnvironment.NODE_ENV,
    getLoadContext: async (request, response) => ({
      nonce: response.locals.nonce,
      session: await getSession(request.headers.cookie),
    }),
    build: viteDevServer //
      ? () => viteDevServer.ssrLoadModule('virtual:react-router/server-build')
      : () => import(rrServerBuild),
  });
}
