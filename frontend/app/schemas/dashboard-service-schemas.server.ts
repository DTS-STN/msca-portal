import { z } from 'zod';

export const getPageAlertResponseSchema = z.array(
  z.object({
    scId: z.string(),
    scHeadingEn: z.string(),
    scHeadingFr: z.string(),
    scContentEn: z.object({
      markdown: z.string()
    }).optional(),
    scContentFr: z.object({
      markdown: z.string()
    }).optional(),
    scAlertType: z.string(),
  }),
);

export type GetPageAlertResponse = z.infer<typeof getPageAlertResponseSchema>;

export const getDashboardCardResponseSchema = z.array(
  z.object({
    scId: z.string(),
    scTitleEn: z.string(),
    scTitleFr: z.string(),
    schAlerts: z.array(
      z.object({
        scId: z.string(),
        scHeadingEn: z.string(),
        scHeadingFr: z.string(),
        scContentEn: z.object({
          markdown: z.string(),
        }),
        scContentFr: z.object({
          markdown: z.string(),
        }),
        scAlertType: z.array(
          z.string(),
        )
      }).optional(),
    ),
    schTasks: z.array(
      z.object({
        scLinkTextEn: z.string(),
        scLinkTextFr: z.string(),
      }),
    ),   
    schLists: z.array(
      z.object({
        scTitleEn: z.string(),
        scTitleFr: z.string(),
        scItems: z.array(
          z.object({
            scId: z.string(),
            scLinkTextEn: z.string(),
            scLinkTextFr: z.string(),
            scLinkTextAssistiveEn: z.string(),
            scLinkTextAssistiveFr: z.string(),
            schURLType: z.string().nullable().optional(),
            scDestinationURLEn: z.string(),
            scDestinationURLFr: z.string(),
            scIconCSS: z.string().nullable().optional(),
            schBetaPopUp: z.boolean(),
          }),
        )
      }),
    ),
  }),
);

export type GetDashboardCardResponse = z.infer<typeof getDashboardCardResponseSchema>;

export const getExitBetaResponseSchema = z.object({
  scTitleEn: z.string().nullable(),
  scTitleFr: z.string().nullable(),
  scDestinationURLEn: z.string(),
  scDestinationURLFr: z.string(),
});

export type GetExitBetaResponse = z.infer<typeof getExitBetaResponseSchema>;

export const pageAlertsSchema = z.array(
  z.object({
    id: z.string(),
    alertHeading: z.string(),
    alertBody: z.string().optional(),
    type: z.string(),
  })
)

export type PageAlerts = z.infer<typeof pageAlertsSchema>;

export const dashboardCardsSchema = z.array(
  z.object({
    id: z.string(),
    title: z.string(),
    dropdownTex: z.string().optional(),
    cardAlerts: z.array(
      z.object({
        id: z.string().optional(),
        alertHeading: z.string().optional(),
        alertBody: z.string().optional(),
      }),
    ),
    lists: z.array(
      z.object({
        title: z.string(),
        tasks: z.array(
          z.object({
            id: z.string(),
            title: z.string(),
            areaLabel: z.string(),
            type: z.string().nullable().optional(),
            scDestinationURL: z.string(),
            scIconCSS: z.string().nullable().optional(),
            schBetaPopUp: z.boolean(),
          }),
        )
      }),
    ),
  }),
)

export type DashboardCards = z.infer<typeof dashboardCardsSchema>;

export const exitBetaSchema = z.object({
  title: z.string().nullable(),
  link: z.string(),
})

export type ExitBeta = z.infer<typeof exitBetaSchema>;