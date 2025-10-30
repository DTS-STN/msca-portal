import type { CardAlertEntity, ExitBetaEntity, PageAlertEntity, ScFragmentEntity } from "../entities/dashboard.entity";

const { AEM_GRAPHQL_ENDPOINT, AEM_GRAPHQL_FOLDER } = globalThis.__appEnvironment;

export interface DashboardRepository {
  getDashboardPageAlertContent(): Promise<PageAlertEntity[]>;
  getDashboardCardAlertContent(): Promise<CardAlertEntity[]>;
  getDashboardExitBetaContent(): Promise<ExitBetaEntity>;
}

export function getDashboardRepository(): DashboardRepository{
  return new DefaultDashboardRespository();
}

export class DefaultDashboardRespository implements DashboardRepository {
  async getDashboardContent() {
    const url = new URL(`${AEM_GRAPHQL_ENDPOINT}getSchMyDashboardV3%3BfolderName=${encodeURIComponent(AEM_GRAPHQL_FOLDER)}`);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch data. Status: ${response.status}, Status Text: ${response.statusText}`);
    }

    return response.json();
  }

  async getDashboardPageAlertContent(): Promise<PageAlertEntity[]> {
    const dashBoardData = await this.getDashboardContent();

    return dashBoardData.data.schPageV1List.items[0].schAlerts;
  }

  async getDashboardCardAlertContent(): Promise<CardAlertEntity[]> {
    const dashBoardData = await this.getDashboardContent();

    const scFragmentEntities: ScFragmentEntity[] = dashBoardData.data.schPageV1List.items[0].scFragments.filter(
     (item: ScFragmentEntity) => item.scId === 'dashboard-cards',
    );

    return scFragmentEntities[0]? scFragmentEntities[0].scItems : [];
  }

  async getDashboardExitBetaContent(): Promise<ExitBetaEntity> {
    const dashBoardData = await this.getDashboardContent();
    
    const exitBetaEntities: ExitBetaEntity[] = dashBoardData.data.schPageV1List.items[0].scFragments.filter(
      (item: ScFragmentEntity) => item.scId === 'exit-beta-version',
    );

    return exitBetaEntities[0];
  }    
}
