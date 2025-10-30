import { z } from 'zod';

export const pageAlertEntitySchema = z.object({
  scId: z.string(),
  scHeadingEn: z.string(),
  scHeadingFr: z.string(),
  scContentEn: z
    .object({
      markdown: z.string(),
    })
    .optional(),
  scContentFr: z
    .object({
      markdown: z.string(),
    }).optional().nullable(),
  scAlertType: z.string(),
});

export type PageAlertEntity = z.infer<typeof pageAlertEntitySchema>;

export const cardAlertEntitySchema = z.object({
  scId: z.string(),
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
        scAlertType: z.array(z.string()),
      }).optional().nullable(),
  ),
});

export type CardAlertEntity = z.infer<typeof cardAlertEntitySchema>;

export const exitBetaEntitySchema = z.object({
  scId: z.string(),
  scTitleEn: z.string().nullable(),
  scTitleFr: z.string().nullable(),
  scDestinationURLEn: z.string(),
  scDestinationURLFr: z.string(),
}).optional();

export type ExitBetaEntity = z.infer<typeof exitBetaEntitySchema>;

export const scFragmentEntitySchema = z.object({
  scId: z.string(),
  scItems: z.array(
    cardAlertEntitySchema
  ),
});

export type ScFragmentEntity = z.infer<typeof scFragmentEntitySchema>;