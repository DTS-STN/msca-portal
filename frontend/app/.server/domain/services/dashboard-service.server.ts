import type { CardAlertDto, ExitBetaDto, PageAlertDto } from '../dtos/dashboard.dto.server';
import type { DashboardDtoMapper } from '../mappers/dashboard.dto.mapper';
import type { DashboardRepository } from '../repositories/dashboard.repository';
import { getDashboardDtoMapper } from '../mappers/dashboard.dto.mapper';
import { getDashboardRepository } from '../repositories/dashboard.repository';

export interface DashboardService {
  getPageAlertsByLang(lang: string): Promise<readonly PageAlertDto[]>;
  getCardAlertsByLang(lang: string): Promise<readonly CardAlertDto[]>;
  getExitBetaByLang(lang:string) : Promise<ExitBetaDto>;
}

export function getDashboardService(): DashboardService {
  const mapper = getDashboardDtoMapper();
  const repo = getDashboardRepository();
  return new DefaultDashboardService(mapper, repo);

}

export class DefaultDashboardService implements DashboardService {
  private readonly dashboardDtoMapper: DashboardDtoMapper;
  private readonly dashboardRepository: DashboardRepository;

  constructor(dashboardDtoMapper: DashboardDtoMapper, dashboardRepository: DashboardRepository) {
    this.dashboardDtoMapper = dashboardDtoMapper;
    this.dashboardRepository = dashboardRepository;
  }

  async getPageAlertsByLang(lang: string): Promise<readonly PageAlertDto[]> {
    const response = await this.dashboardRepository.getDashboardPageAlertContent();

    const pageAlertDtos: PageAlertDto[] = this.dashboardDtoMapper.mapPageAlertEntitiesToPageAlertDtos(response, lang);

    return pageAlertDtos;
  }

  async getCardAlertsByLang(lang: string): Promise<readonly CardAlertDto[]> {
    const response = await this.dashboardRepository.getDashboardCardAlertContent();

    const cardAlertDtos = this.dashboardDtoMapper.mapCardAlertEntityToCardAlertDto(response, lang);

    return cardAlertDtos;
  }
  
  async getExitBetaByLang(lang: string): Promise<ExitBetaDto> {
    const response = await this.dashboardRepository.getDashboardExitBetaContent();

    const exitBetaDtos = this.dashboardDtoMapper.mapExitBetaEntityToExitBetaDto(response, lang);

    return exitBetaDtos;
  }  
}