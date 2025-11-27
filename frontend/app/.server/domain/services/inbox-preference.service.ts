import moize from 'moize';

import { getInboxPrefRepository } from '../repositories/inbox-preference.repository';

import { LogFactory } from '~/.server/logging';

const log = LogFactory.getLogger(import.meta.url);

export const getInboxPrefService = moize(createInboxPrefService, {
  onCacheAdd: () => log.info('Creating new inbox pref service'),
});

export function createInboxPrefService() {
  const repo = getInboxPrefRepository();

  async function getInboxPre(spid: string) {
    const response = await repo.getInboxPref(spid);

    return response;
  }

  async function setInboxPref(spid: string, pref: string) {
    const response = await repo.setInboxPref(spid, pref);

    return response;
  }

  return {
    getInboxPre: moize(getInboxPre, {
      maxAge: 1000 * 10,
      onCacheAdd: () => log.info('Creating new getInboxPre memo'),
    }),
    setInboxPref: moize(setInboxPref, {
      maxAge: 1000 * 10,
      onCacheAdd: () => log.info('Creating new setInboxPref memo'),
    }),
  };
}
