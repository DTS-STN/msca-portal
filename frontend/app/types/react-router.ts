import 'react-router';

import type { Namespace } from 'i18next';

import type { Breadcrumbs } from '~/utils/route-utils';

declare module 'react-router' {
  interface AppLoadContext {
    nonce: string;
    session: AppSession;
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
