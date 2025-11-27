import moize from 'moize';

import { getInboxPrefRepository } from '../repositories/inbox-preference.repository';

import { LogFactory } from '~/.server/logging';

const log = LogFactory.getLogger(import.meta.url);

const { LOOKUP_SVC_DASHBOARD_CACHE_TTL_SECONDS } = globalThis.__appEnvironment;

export const getInboxPrefService = moize(createInboxPrefService, {
  onCacheAdd: () => log.info('Creating new inbox pref service'),
});

export function createInboxPrefService() {
  const repo = getInboxPrefRepository();

  async function getInboxPre(spid: string) {
    const response = await repo.getInboxPref(spid);

    log.info('service get:' + response);
    log.info('service get: ' + JSON.stringify(response));

    return response;
  }

  async function setInboxPref(spid: string, pref: string) {
    const response = await repo.setInboxPref(spid, pref);

    return response;
  }

  return {
    getInboxPre: moize(getInboxPre, {
      maxAge: 1000 * LOOKUP_SVC_DASHBOARD_CACHE_TTL_SECONDS,
      onCacheAdd: () => log.info('Creating new getInboxPre memo'),
    }),
    setInboxPref: moize(setInboxPref, {
      maxAge: 1000 * LOOKUP_SVC_DASHBOARD_CACHE_TTL_SECONDS,
      onCacheAdd: () => log.info('Creating new setInboxPref memo'),
    }),
  };
}
