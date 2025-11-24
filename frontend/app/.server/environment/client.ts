import * as v from 'valibot';

import { Redacted } from '../utils/security-utils';

import { stringToBooleanSchema } from '~/.server/validation/string-to-boolean-schema';
import { stringToIntegerSchema } from '~/.server/validation/string-to-integer-schema';
import { isValidTimeZone } from '~/utils/date-utils';
import { validUrlSchema } from '~/validation/valid-url-schema';

export type Client = Readonly<v.InferOutput<typeof client>>;

//TODO Susan - can some of these defaults be removed?
export const defaults = {
  ADOBE_ANALYTICS_JQUERY_SRC: 'https://code.jquery.com/jquery-3.7.1.min.js',
  BASE_TIMEZONE: 'Canada/Eastern',
  BUILD_DATE: '1970-01-01T00:00:00.000Z',
  BUILD_ID: '000000',
  BUILD_REVISION: '00000000',
  BUILD_VERSION: '0.0.0-000000-00000000',
  I18NEXT_DEBUG: 'false',
  SESSION_TIMEOUT_PROMPT_SECONDS: (5 * 60).toString(),
  SESSION_TIMEOUT_SECONDS: (19 * 60).toString(),
  MSCA_BASE_URL: 'http://localhost:3001',
  MSCA_EQ_BASE_URL: 'http://localhost:3006',
  MSCA_ECAS_RASC_BASE_URL: 'http://localhost:3007',
  ECAS_BASE_URL: 'http://localhost:3002',
  CDCP_BASE_URL: 'http://localhost:3003',
  CDB_BASE_URL: 'http://localhost:3004',
  OAS_BASE_URL: 'http://localhost:3005',
  AEM_GRAPHQL_ENDPOINT: 'https://www.canada.ca/graphql/execute.json/decd-endc/',
  AEM_GRAPHQL_FOLDER: '/content/dam/decd-endc/content-fragments/preview-sch',
  LOOKUP_SVC_DASHBOARD_CACHE_TTL_SECONDS: '600',
  PAGINATION_MESSAGES_PER_PAGE: '5',
  PAGINATION_PAGE_RANGE_DISPLAYED: '5',
  HOSTALIAS_HOSTNAME: 'brz-ofm12c-oz-s4.brz.dev',
  MSCA_NG_INBOX_GET_ENDPOINT: '',
  MSCA_NG_USER_ENDPOINT: '/stream3/mscaws-mdscws/api/v1/users',
  CURAM_REDIRECT: '/curamUrlPlaceholder',
  MSCA_NG_CREDS: '',
} as const;

/**
 * Environment variables that are safe to expose publicly to the client.
 * ⚠️ IMPORTANT: DO NOT PUT SENSITIVE CONFIGURATIONS HERE ⚠️
 */
export const client = v.object({
  ADOBE_ANALYTICS_SRC: v.optional(validUrlSchema()),
  ADOBE_ANALYTICS_JQUERY_SRC: v.optional(validUrlSchema(), defaults.ADOBE_ANALYTICS_JQUERY_SRC),
  BASE_TIMEZONE: v.optional(v.pipe(v.string(), v.check(isValidTimeZone)), defaults.BASE_TIMEZONE),
  BUILD_DATE: v.optional(v.string(), defaults.BUILD_DATE),
  BUILD_ID: v.optional(v.string(), defaults.BUILD_ID),
  BUILD_REVISION: v.optional(v.string(), defaults.BUILD_REVISION),
  BUILD_VERSION: v.optional(v.string(), defaults.BUILD_VERSION),
  I18NEXT_DEBUG: v.optional(stringToBooleanSchema(), defaults.I18NEXT_DEBUG),
  SESSION_TIMEOUT_PROMPT_SECONDS: v.optional(stringToIntegerSchema(), defaults.SESSION_TIMEOUT_PROMPT_SECONDS),
  SESSION_TIMEOUT_SECONDS: v.optional(stringToIntegerSchema(), defaults.SESSION_TIMEOUT_SECONDS),
  isProduction: v.boolean(),
  MSCA_BASE_URL: v.optional(v.string(), defaults.MSCA_BASE_URL),
  MSCA_EQ_BASE_URL: v.optional(v.string(), defaults.MSCA_EQ_BASE_URL),
  MSCA_ECAS_RASC_BASE_URL: v.optional(v.string(), defaults.MSCA_ECAS_RASC_BASE_URL),
  ECAS_BASE_URL: v.optional(v.string(), defaults.ECAS_BASE_URL),
  CDCP_BASE_URL: v.optional(v.string(), defaults.CDCP_BASE_URL),
  CDB_BASE_URL: v.optional(v.string(), defaults.CDB_BASE_URL),
  OAS_BASE_URL: v.optional(v.string(), defaults.OAS_BASE_URL),
  AEM_GRAPHQL_FOLDER: v.optional(v.string(), defaults.AEM_GRAPHQL_FOLDER),
  AEM_GRAPHQL_ENDPOINT: v.optional(v.string(), defaults.AEM_GRAPHQL_ENDPOINT),
  LOOKUP_SVC_DASHBOARD_CACHE_TTL_SECONDS: v.optional(stringToIntegerSchema(), defaults.LOOKUP_SVC_DASHBOARD_CACHE_TTL_SECONDS),
  PAGINATION_MESSAGES_PER_PAGE: v.optional(stringToIntegerSchema(), defaults.PAGINATION_MESSAGES_PER_PAGE),
  PAGINATION_PAGE_RANGE_DISPLAYED: v.optional(stringToIntegerSchema(), defaults.PAGINATION_PAGE_RANGE_DISPLAYED),
  HOSTALIAS_HOSTNAME: v.optional(v.string(), defaults.HOSTALIAS_HOSTNAME),
  MSCA_NG_INBOX_GET_ENDPOINT: v.optional(v.string(), defaults.MSCA_NG_INBOX_GET_ENDPOINT),
  MSCA_NG_USER_ENDPOINT: v.optional(v.pipe(v.string(), v.transform(Redacted.make)), defaults.MSCA_NG_USER_ENDPOINT),
  MSCA_NG_CREDS: v.optional(v.pipe(v.string(), v.transform(Redacted.make)), defaults.MSCA_NG_CREDS),
  CURAM_REDIRECT: v.optional(v.string(), defaults.CURAM_REDIRECT),
});
