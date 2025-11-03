import { z } from 'zod';

export const pageAlertDtoSchema = z.object({
  id: z.string(),
  alertHeading: z.string(),
  alertBody: z.string().optional(),
  type: z.string(),
});

export type PageAlertDto = z.infer<typeof pageAlertDtoSchema>;

export const cardAlertDtoSchema = z.object({
  id: z.string(),
  cardAlerts: z.array(
    z.object({
      id: z.string().optional(),
      alertHeading: z.string().optional(),
      alertBody: z.string().optional(),
    }),
  ),
});

export type CardAlertDto = z.infer<typeof cardAlertDtoSchema>;

export const exitBetaDtoSchema = z.object({
  title: z.string().nullable(),
  link: z.string(),
});

export type ExitBetaDto = z.infer<typeof exitBetaDtoSchema>;
