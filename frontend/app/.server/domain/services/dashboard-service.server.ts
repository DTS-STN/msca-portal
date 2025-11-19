import moize from 'moize';

import type { CardAlertDto, ExitBetaDto, PageAlertDto } from '../dtos/dashboard.dto.server';
import { getDashboardDtoMapper } from '../mappers/dashboard.dto.mapper';
import { getDashboardRepository } from '../repositories/dashboard.repository';

import { LogFactory } from '~/.server/logging';

const log = LogFactory.getLogger(import.meta.url);

const { LOOKUP_SVC_DASHBOARD_CACHE_TTL_SECONDS } = globalThis.__appEnvironment;

export const getDashboardService = moize(createDashboardService, {
  onCacheAdd: () => log.info('Creating new dashboard service'),
});

export function createDashboardService() {
  const mapper = getDashboardDtoMapper();
  const repo = getDashboardRepository();

  async function getPageAlertsByLang(lang: string): Promise<readonly PageAlertDto[]> {
    const response = await repo.getDashboardPageAlertContent();

    const pageAlertDtos: PageAlertDto[] = mapper.mapPageAlertEntitiesToPageAlertDtos(response, lang);

    return pageAlertDtos;
  }

  async function getCardAlertsByLang(lang: string): Promise<readonly CardAlertDto[]> {
    const response = await repo.getDashboardCardAlertContent();

    const cardAlertDtos = mapper.mapCardAlertEntityToCardAlertDto(response, lang);

    return cardAlertDtos;
  }

  async function getExitBetaByLang(lang: string): Promise<ExitBetaDto> {
    const response = await repo.getDashboardExitBetaContent();

    const exitBetaDtos = mapper.mapExitBetaEntityToExitBetaDto(response, lang);

    return exitBetaDtos;
  }

  return {
    getPageAlertsByLang: moize(getPageAlertsByLang, {
      maxAge: 1000 * LOOKUP_SVC_DASHBOARD_CACHE_TTL_SECONDS,
      onCacheAdd: () => log.info('Creating new getPageAlertsByLang memo'),
    }),
    getCardAlertsByLang: moize(getCardAlertsByLang, {
      maxAge: 1000 * LOOKUP_SVC_DASHBOARD_CACHE_TTL_SECONDS,
      onCacheAdd: () => log.info('Creating new getCardAlertsByLang memo'),
    }),
    getExitBetaByLang: moize(getExitBetaByLang, {
      maxAge: 1000 * LOOKUP_SVC_DASHBOARD_CACHE_TTL_SECONDS,
      onCacheAdd: () => log.info('Creating new getExitBetaByLang memo'),
    }),
  };
}
