import { toDashboardCards, toExitBeta, toPageAlerts } from '~/mappers/dashboard-service-mappers.server';
import {
  getDashboardCardResponseSchema,
  getPageAlertResponseSchema,
  getExitBetaResponseSchema,
} from '~/schemas/dashboard-service-schemas.server';

const { AEM_GRAPHQL_ENDPOINT, AEM_GRAPHQL_FOLDER } = globalThis.__appEnvironment;

export function getDashboardService() {
  async function getDashboardContent(lang: string) {
    const url = new URL(`${AEM_GRAPHQL_ENDPOINT}getSchMyDashboardV3%3BfolderName=${encodeURIComponent(AEM_GRAPHQL_FOLDER)}`);
    const response = await fetch(url);

    if (response.ok) {
      const responseData = await response.json();
      const responseAlertData = responseData.data.schPageV1List.items[0].schAlerts;
      const pageAlertsResponse = getPageAlertResponseSchema.parse(responseAlertData);

      const responseDashboardData = responseData.data.schPageV1List.items[0].scFragments.filter(
        (item: any) => item.scId === 'dashboard-cards',
      );
      const cardsResponse = getDashboardCardResponseSchema.parse(responseDashboardData[0].scItems);

      const responseExitBetaData = responseData.data.schPageV1List.items[0].scFragments.filter(
        (item: any) => item.scId === 'exit-beta-version',
      );
      const exitBetaResponse = getExitBetaResponseSchema.parse(responseExitBetaData[0]);

      const pageAlerts = toPageAlerts(pageAlertsResponse, lang);
      const cards = toDashboardCards(cardsResponse, lang);
      const exitBeta = toExitBeta(exitBetaResponse, lang);

      return Response.json({
        pageAlerts,
        cards,
        exitBeta,
      });
    }

    throw new Error(`Failed to fetch data. Status: ${response.status}, Status Text: ${response.statusText}`);
  }

  return {
    getDashboardContent,
  };
}

export type GetDashboardService = typeof getDashboardService;
