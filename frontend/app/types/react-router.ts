import 'react-router';
import { Session } from 'react-router';

import type { Namespace } from 'i18next';

import type { Breadcrumbs } from '~/utils/route-utils';

import type { RaoidcAccessToken, RaoidcIdTokenClaims, RaoidcUserinfoTokenClaims } from '~/.server/auth/response-validators';

import type { MessageEntity } from '~/.server/domain/entities/message.entity';

declare module 'react-router' {
  interface AppLoadContext {
    nonce: string;
    session: Session;
  }

  interface SessionData {
    authState: {
      accessToken: RaoidcAccessToken;
      idTokenClaims: RaoidcIdTokenClaims;
      userinfoTokenClaims: RaoidcUserinfoTokenClaims;
    };
    messages: MessageEntity[];
    loginState: {
      codeVerifier: string;
      nonce: string;
      returnUrl?: URL;
      state: string;
    };
    stubloginState: {
      birthdate?: string;
      locale?: string;
      sin?: string;
    };
  }

  /**
   * Route handles should export an i18n namespace, if necessary.
   */
  interface RouteHandle {
    breadcrumbs?: Breadcrumbs;
    i18nNamespace?: Namespace;
  }

  /**
   * A route module exports an optional RouteHandle.
   */
  interface RouteModule {
    handle?: RouteHandle;
  }

  /**
   * Override the default React Router RouteModules
   * to include the new RouteModule type.
   */
  interface RouteModules extends Record<string, RouteModule | undefined> {}
}

export {};
