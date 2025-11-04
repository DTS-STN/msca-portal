import type { CardAlertDto, ExitBetaDto, PageAlertDto } from '../dtos/dashboard.dto.server';
import type { CardAlertEntity, ExitBetaEntity, PageAlertEntity } from '../entities/dashboard.entity';

export interface DashboardDtoMapper {
  mapPageAlertEntitiesToPageAlertDtos(pageAlertEntities: PageAlertEntity[], lang: string): PageAlertDto[];
  mapExitBetaEntityToExitBetaDto(exitBetaEntity: ExitBetaEntity, lang: string): ExitBetaDto;
  mapCardAlertEntityToCardAlertDto(cardAlertEntities: CardAlertEntity[], lang: string): CardAlertDto[];
}

export function getDashboardDtoMapper(): DashboardDtoMapper {
  return new DefaultDashboardDtoMapper();
}

export class DefaultDashboardDtoMapper implements DashboardDtoMapper {
  mapCardAlertEntityToCardAlertDto(cardAlertEntities: CardAlertEntity[], lang: string): CardAlertDto[] {
    return cardAlertEntities.map((cardAlert: CardAlertEntity) => ({
      id: cardAlert.scId,
      alerts: cardAlert.schAlerts.map((alert) => ({
        id: alert.scId,
        alertHeading: lang === 'en' ? alert.scHeadingEn : alert.scHeadingFr,
        alertBody: lang === 'en' ? alert.scContentEn.markdown : alert.scContentFr.markdown,
        type: alert.scAlertType[0] ?? '',
      })),
    }));
  }

  mapPageAlertEntitiesToPageAlertDtos(pageAlertEntities: PageAlertEntity[], lang: string): PageAlertDto[] {
    return pageAlertEntities.map((alert: PageAlertEntity) => ({
      id: alert.scId,
      alertHeading: lang === 'en' ? alert.scHeadingEn : alert.scHeadingFr,
      alertBody: lang === 'en' ? alert.scContentEn?.markdown : alert.scContentFr?.markdown,
      type: alert.scAlertType,
    }));
  }

  mapExitBetaEntityToExitBetaDto(exitBetaEntity: ExitBetaEntity, lang: string): ExitBetaDto {
    return {
      title: lang === 'en' ? (exitBetaEntity?.scTitleEn ?? '') : (exitBetaEntity?.scTitleFr ?? ''),
      link: lang === 'en' ? (exitBetaEntity?.scDestinationURLEn ?? '') : (exitBetaEntity?.scDestinationURLFr ?? ''),
    };
  }
}
