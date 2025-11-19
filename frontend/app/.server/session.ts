import { createMemorySessionStorage, createSession, createSessionStorage, Session } from 'react-router';

import { randomUUID } from 'node:crypto';

import { serverEnvironment } from '~/.server/environment';
import { getRedisClient } from '~/.server/redis';

const {
  SESSION_TYPE,
  SESSION_COOKIE_DOMAIN,
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_PATH,
  SESSION_COOKIE_SAMESITE,
  SESSION_COOKIE_SECRET,
  SESSION_COOKIE_SECURE,
  SESSION_KEY_PREFIX,
  SESSION_EXPIRES_SECONDS,
} = serverEnvironment;

const cookie = {
  name: SESSION_COOKIE_NAME,
  domain: SESSION_COOKIE_DOMAIN,
  path: SESSION_COOKIE_PATH,
  sameSite: SESSION_COOKIE_SAMESITE,
  secure: SESSION_COOKIE_SECURE,
  secrets: [SESSION_COOKIE_SECRET.value()],
  maxAge: SESSION_EXPIRES_SECONDS,
};

let { getSession, commitSession, destroySession } =
  SESSION_TYPE === 'redis' //
    ? createRedisStore()
    : createMemoryStore();

const wrappedGetSession = async (cookie: string | null | undefined) => {
  return Promise.resolve(getSession(cookie));
};

export { wrappedGetSession, commitSession, destroySession };

function createRedisStore() {
  const redisClient = getRedisClient();

  return createSessionStorage<SessionData, SessionData>({
    cookie,
    async createData(data, expires) {
      const id = randomUUID();
      const key = `${SESSION_KEY_PREFIX}{id}`;
      const value = JSON.stringify(data);
      await redisClient.set(key, value, 'EX', SESSION_EXPIRES_SECONDS);
      return id;
    },
    async readData(id: string) {
      const key = `${SESSION_KEY_PREFIX}{id}`;
      const value = await redisClient.get(key);
      return value ? JSON.parse(value) : null;
    },
    async updateData(id, data, expires) {
      const key = `${SESSION_KEY_PREFIX}{id}`;
      const value = JSON.stringify(data);
      await redisClient.set(key, value, 'EX', SESSION_EXPIRES_SECONDS);
    },
    async deleteData(id: string) {
      const key = `${SESSION_KEY_PREFIX}{id}`;
    },
  });
}

function createMemoryStore() {
  type SessionData = {};

  type SessionFlashData = {};

  const { getSession, commitSession, destroySession } = createMemorySessionStorage<SessionData, SessionFlashData>({
    cookie: cookie,
  });

  return { getSession, commitSession, destroySession };
}
