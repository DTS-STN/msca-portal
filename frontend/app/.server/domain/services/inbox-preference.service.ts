import { getInboxPrefRepository } from '../repositories/inbox-preference.repository';

export function getInboxPrefService() {
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
    getInboxPre,
    setInboxPref,
  };
}
