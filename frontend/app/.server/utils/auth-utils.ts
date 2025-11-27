/**
 * This module provides utility functions for handling user authentication and authorization. It includes functions for
 * enforcing required authentication and redirecting unauthenticated users to the login page. It also defines types for
 * authenticated sessions and utilizes the logging module for logging authentication-related events.
 */
import { redirect } from 'react-router';
import type { Session } from 'react-router';

import axios from 'axios';
import fs from 'fs';
import https from 'https';

import { serverEnvironment } from '../environment';
import { getSession } from '../session';

import { getRaoidcClient } from '~/.server/auth/raoidc-client';
import { LogFactory } from '~/.server/logging';

const log = LogFactory.getLogger(import.meta.url);

/**
 * Requires that the user be authenticated.
 * Will redirect to the login page if the user is not authenticated.
 */
export async function requireAuth(request: Request) {
  const { pathname, search } = new URL(request.url);
  const session: Session = await getSession(request.headers.get('Cookie'));
  const authState = session.get('authState');

  if (!authState) {
    log.debug('User is not authenticated; redirecting to login page');
    throw redirect(`/auth/login?returnto=${pathname}${search}`);
  }

  const idTokenClaims = authState.idTokenClaims;

  const raoidcClient = await getRaoidcClient();
  const isValid = await raoidcClient.handleValidationRequest(idTokenClaims.sid);

  if (!isValid) {
    log.debug('RAOIDC session has expired; redirecting to login page');
    throw redirect(`/auth/login?returnto=${pathname}${search}`);
  }

  return authState;
}

export function updateMscaNg(sin: string, uid: string) {
  log.debug('my url' + `https://${serverEnvironment.HOSTALIAS_HOSTNAME}${serverEnvironment.MSCA_NG_USER_ENDPOINT}` + 'my url');
  log.debug('my uid and sin' + uid + ' ' + sin);
  // Create httpsAgent to read in cert to make BRZ call
  const httpsAgent =
    serverEnvironment.NODE_ENV === 'development'
      ? new https.Agent()
      : new https.Agent({
          ca: fs.readFileSync(process.env.NODE_EXTRA_CA_CERTS as fs.PathOrFileDescriptor),
        });

  //Make call to msca-ng API to create user if it doesn't exist
  axios
    .post(
      `https://${serverEnvironment.HOSTALIAS_HOSTNAME}${serverEnvironment.MSCA_NG_USER_ENDPOINT}`,
      {
        pid: sin,
        spid: uid,
      },
      {
        headers: {
          'authorization': `Basic ${serverEnvironment.MSCA_NG_CREDS.value()}`,
          'Content-Type': 'application/json',
        },
        httpsAgent: httpsAgent,
      },
    )
    .then((response) => {
      log.debug('create user if none exists ' + response.statusText + response.data);
      updateLastLoginDate(uid);
    })
    .catch((error) => {
      log.error('error creating user ' + error);
    });

  function updateLastLoginDate(uid: string) {
    axios({
      method: 'post',
      url: `https://${serverEnvironment.HOSTALIAS_HOSTNAME}${serverEnvironment.MSCA_NG_USER_ENDPOINT}/${uid}/logins`,
      headers: {
        'Authorization': `Basic ${serverEnvironment.MSCA_NG_CREDS.value()}`,
        'Content-Type': 'application/json',
      },
      httpsAgent: httpsAgent,
    })
      .then((response) => log.debug('update last login ' + response.statusText + response.data))
      .catch((error) => {
        log.error('update last login error ' + error);
      });
  }
}
