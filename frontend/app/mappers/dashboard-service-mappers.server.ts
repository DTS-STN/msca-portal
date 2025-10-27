import type { DashboardCards, ExitBeta, GetDashboardCardResponse, GetExitBetaResponse, GetPageAlertResponse, PageAlerts } from "~/schemas/dashboard-service-schemas.server";

export function toDashboardCards(getDashboardCardResponse: GetDashboardCardResponse, lang: string): DashboardCards {
	return (
		getDashboardCardResponse.map((fragment) => ({
			id: fragment.scId,
      title: lang === 'en' ? fragment.scTitleEn : fragment.scTitleFr,
      dropdownText: lang === 'en' ? fragment.schTasks[0]?.scLinkTextEn : fragment.schTasks[0]?.scLinkTextFr,
      cardAlerts: fragment.schAlerts.map((alert) => ({
        id: alert?.scId,
        alertHeading: lang === 'en' ? alert?.scHeadingEn : alert?.scHeadingFr,
        alertBody: alert?.scContentEn.markdown,
				type: alert?.scAlertType[0],
      })),
      lists: fragment.schLists.map((list) => ({
            title: lang === 'en' ? list.scTitleEn : list.scTitleFr,
            tasks: list.scItems.map((item) =>({
                id: item.scId,
                title: lang === 'en' ? item.scLinkTextEn : item.scLinkTextFr,
                titleFr: item.scLinkTextFr,
                areaLabel: lang === 'en' ? item.scLinkTextAssistiveEn : item.scLinkTextAssistiveFr,
                type: item.schURLType,
                scDestinationURL: lang === 'en' ? item.scDestinationURLEn : item.scDestinationURLFr,
                scIconCSS: item.scIconCSS,
                schBetaPopUp: item.schBetaPopUp,
            })),
        })),
    }))
	);
}

export function toPageAlerts(getPageAlertResponse: GetPageAlertResponse, lang: string): PageAlerts {
	return (
		getPageAlertResponse.map((alert) => ({
			id: alert.scId,
      alertHeading: lang === 'en' ? alert.scHeadingEn : alert.scHeadingFr,
    	alertBody: lang === 'en' ? alert.scContentEn?.markdown : alert.scContentFr?.markdown,
			type: alert.scAlertType,
    }))
	);
}

export function toExitBeta(getExitBetaResponse: GetExitBetaResponse, lang: string): ExitBeta {
	return {
		title: lang === 'en' ? getExitBetaResponse.scTitleEn : getExitBetaResponse.scTitleFr,
		link: lang === 'en' ? getExitBetaResponse.scDestinationURLEn : getExitBetaResponse.scDestinationURLFr,
	};
}