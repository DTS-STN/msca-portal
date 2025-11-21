import axios from 'axios';
import fs from 'fs';
import https from 'https';

import { serverEnvironment } from '~/.server/environment';
import { LogFactory } from '~/.server/logging';

const { HOSTALIAS_HOSTNAME, MSCA_NG_INBOX_GET_ENDPOINT, MSCA_NG_CREDS } = globalThis.__appEnvironment;

const log = LogFactory.getLogger(import.meta.url);

//Create httpsAgent to read in cert to make BRZ call
const httpsAgent =
  serverEnvironment.AUTH_ENABLE_STUB_LOGIN === true
    ? new https.Agent()
    : new https.Agent({
        ca: fs.readFileSync(serverEnvironment.NODE_EXTRA_CA_CERTS as fs.PathOrFileDescriptor),
      });

type InboxPrefResponseEntity = Readonly<{
  id: string;
  subscribedEvents: {
    eventTypeCode: string;
  }[];
}>;

/**
 * A repository that provides access to msca-ng api.
 */
export interface InboxPrefRepository {
  /**
   * Retrieves inbox notification preferences.
   *
   */
  getInboxPref(spid: string): Promise<InboxPrefResponseEntity>;

  /**
   * Set inbox notification preferences.
   *
   */
  setInboxPref(spid: string, pref: string): Promise<void>;

  /**
   * Performs a health check to ensure that the letter repository is operational.
   *
   * @throws An error if the health check fails or the repository is unavailable.
   * @returns A promise that resolves when the health check completes successfully.
   */
  checkHealth(): Promise<void>;
}
export function getInboxPrefRepository(): InboxPrefRepository {
  return serverEnvironment.isProduction === false ? new MockInboxPrefRepository() : new DefaultInboxPrefRepository();
}

export class DefaultInboxPrefRepository implements InboxPrefRepository {
  async getInboxPref(spid: string): Promise<InboxPrefResponseEntity> {
    try {
      const resp = await axios.get(`https://${HOSTALIAS_HOSTNAME}${MSCA_NG_INBOX_GET_ENDPOINT}`, {
        params: {
          'program-code': 'CFOB',
          'Spid': spid,
        },
        headers: {
          'authorization': `Basic ${MSCA_NG_CREDS}`,
          'Content-Type': 'application/json',
        },
        httpsAgent: httpsAgent,
      });
      const respData = resp.data[0];
      log.info('getInboxPref response ' + respData.toString());

      return respData;
    } catch (err) {
      log.error(err);
    }

    return {
      id: spid,
      subscribedEvents: [],
    };
  }

  async setInboxPref(spid: string, pref: string): Promise<void> {
    log.info('start setInboxPref');
    const eventCode = pref === 'yes' ? 'PAPERLESS' : 'MAIL';
    const inboxPref = await this.getInboxPref(spid);
    const id = inboxPref.id;
    if (id) {
      log.trace('before setInboxPref req');
      await axios
        .post(
          `https://${process.env.HOSTALIAS_HOSTNAME}${process.env.MSCA_NG_INBOX_SET_ENDPOINT}${id}/subscribe`,
          {
            eventCodes: [eventCode],
          },
          {
            headers: {
              'authorization': `Basic ${process.env.MSCA_NG_CREDS}`,
              'Content-Type': 'application/json',
            },
            // httpsAgent: httpsAgent,
          },
        )
        .then(() => {
          // nothing needs to be done
        })
        .catch((err) => {
          log.error(err);
          throw err;
        });
      log.trace('setInboxPref complete');
    } else {
      log.error('unable to find ID for spid ' + spid);
      throw new Error('unable to find id');
    }
  }

  async checkHealth(): Promise<void> {
    await this.getInboxPref(`${process.env.HEALTH_PLACEHOLDER_REQUEST_VALUE}`);
  }
}

export class MockInboxPrefRepository implements InboxPrefRepository {
  async getInboxPref(spid: string): Promise<InboxPrefResponseEntity> {
    return await Promise.resolve({
      id: spid,
      subscribedEvents: [{ eventTypeCode: 'PAPERLESS' }],
    });
  }

  async setInboxPref(spid: string, pref: string): Promise<void> {
    return await Promise.resolve();
  }

  async checkHealth(): Promise<void> {
    return await Promise.resolve();
  }
}
