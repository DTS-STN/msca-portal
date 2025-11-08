import moize from 'moize';

import type { CardAlertEntity, ExitBetaEntity, PageAlertEntity, ScFragmentEntity } from '../entities/dashboard.entity';

const { AEM_GRAPHQL_ENDPOINT, AEM_GRAPHQL_FOLDER, LOOKUP_SVC_DASHBOARD_CACHE_TTL_SECONDS } = globalThis.__appEnvironment;

export const getDashboardRepository = moize(createDashboardReposity, {
  onCacheAdd: () => console.log('Creating new dashboard repository '),
});

function createDashboardReposity() {
  async function getDashboardContent() {
    const url = new URL(`${AEM_GRAPHQL_ENDPOINT}getSchMyDashboardV3%3BfolderName=${encodeURIComponent(AEM_GRAPHQL_FOLDER)}`);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch data. Status: ${response.status}, Status Text: ${response.statusText}`);
    }

    return response.json();
  }

  async function getDashboardPageAlertContent(): Promise<PageAlertEntity[]> {
    const dashBoardData = await getDashboardContent();

    return dashBoardData.data.schPageV1List.items[0].schAlerts;
  }

  async function getDashboardCardAlertContent(): Promise<CardAlertEntity[]> {
    const dashBoardData = await getDashboardContent();

    const scFragmentEntities: ScFragmentEntity[] = dashBoardData.data.schPageV1List.items[0].scFragments.filter(
      (item: ScFragmentEntity) => item.scId === 'dashboard-cards',
    );

    return scFragmentEntities[0]?.scItems ?? [];
  }

  async function getDashboardExitBetaContent(): Promise<ExitBetaEntity> {
    const dashBoardData = await getDashboardContent();

    const exitBetaEntities: ExitBetaEntity[] = dashBoardData.data.schPageV1List.items[0].scFragments.filter(
      (item: ScFragmentEntity) => item.scId === 'exit-beta-version',
    );

    return exitBetaEntities[0];
  }

  return {
    getDashboardPageAlertContent: moize(getDashboardPageAlertContent, {
      maxAge: 1000 * LOOKUP_SVC_DASHBOARD_CACHE_TTL_SECONDS,
      onCacheAdd: () => console.log('Creating new getDashboardPageAlertContent memo'),
    }),
    getDashboardCardAlertContent: moize(getDashboardCardAlertContent, {
      maxAge: 1000 * LOOKUP_SVC_DASHBOARD_CACHE_TTL_SECONDS,
      onCacheAdd: () => console.log('Creating new getDashboardCardAlertContent memo'),
    }),
    getDashboardExitBetaContent: moize(getDashboardExitBetaContent, {
      maxAge: 1000 * LOOKUP_SVC_DASHBOARD_CACHE_TTL_SECONDS,
      onCacheAdd: () => console.log('Creating new getDashboardExitBetaContent memo'),
    }),
  };
}
