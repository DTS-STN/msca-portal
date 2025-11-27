import axios from 'axios';

import { serverEnvironment } from '~/.server/environment';
import { getHttpClient } from '~/.server/http/http-client';
import { LogFactory } from '~/.server/logging';

const log = LogFactory.getLogger(import.meta.url);

type InboxPrefResponseEntity = Readonly<{
  id: string;
  programCode?: string;
  dateCreated?: string;
  dateEmailConfirmed?: string;
  dateTermsAccepted?: string;
  dateUpdated?: string;
  emailAddress?: string;
  recipientCode?: string;
  userCreated?: string;
  versionTermsAccepted?: string;
  profileStatusCode?: string;
  languageCode?: string;
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
      const httpClient = getHttpClient();
      const url = new URL(`https://${serverEnvironment.HOSTALIAS_HOSTNAME}${serverEnvironment.MSCA_NG_INBOX_GET_ENDPOINT}`);
      url.searchParams.set('program-code', 'CFOB');
      url.searchParams.set('Spid', spid);
      const mscaNgCreds = serverEnvironment.MSCA_NG_CREDS.value();
      log.debug('raw msca creds' + mscaNgCreds);
      // const mscaNgCreds = atob(rawMscaNgCreds.toString() as string);
      const response = await httpClient.instrumentedFetch('http.client.interop-api.get-doc-info-by-client-id.gets', url, {
        headers: {
          'Content-Type': 'application/json',
          'authorization': 'Basic bXNjYS1uZy5hZG1pbjpwQHNzd29yZDE=',
        },
        retryOptions: {
          retries: parseInt(`${serverEnvironment.CCT_API_MAX_RETRIES}`),
          backoffMs: parseInt(`${serverEnvironment.CCT_API_RETRY_DELAY}`),
          retryConditions: {
            [502]: [],
          },
        },
      });

      if (!response.ok) {
        log.error('%j', {
          message: 'Failed to get inbox prefs',
          status: response.status,
          statusText: response.statusText + response.text,
          url: `https://${serverEnvironment.HOSTALIAS_HOSTNAME}${serverEnvironment.MSCA_NG_INBOX_GET_ENDPOINT}`,
          responseBody: await response.text(),
        });

        throw new Error(`Failed to get inbox prefs. Status: ${response.status}, Status Text: ${response.statusText}`);
      }

      log.info('response:', JSON.stringify(response));
      const respData = await response.json();
      log.info('response data: ', JSON.stringify(respData));
      const inboxPref: InboxPrefResponseEntity = respData[0];
      log.info('getInboxPref response:', inboxPref);
      log.info('id', inboxPref.id);
      log.info('subscribedEvents', inboxPref.subscribedEvents);

      return inboxPref;
    } catch (err) {
      log.error(err);
    }

    return {
      id: '',
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
