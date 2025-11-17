import 'express-session';

import type { RaoidcAccessToken, RaoidcIdTokenClaims, RaoidcUserinfoTokenClaims } from '~/.server/auth/response-validators';
import type { MessageEntity } from '~/.server/domain/entities/message.entity';

declare module 'express-session' {
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
}

export {};
