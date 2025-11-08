import type { CardAlertDto, ExitBetaDto, PageAlertDto } from '../dtos/dashboard.dto.server';
import { getDashboardDtoMapper } from '../mappers/dashboard.dto.mapper';
import { getDashboardRepository } from '../repositories/dashboard.repository';

export function getDashboardService() {
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
    getPageAlertsByLang,
    getCardAlertsByLang,
    getExitBetaByLang,
  };
}
