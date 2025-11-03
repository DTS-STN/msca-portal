import type { ReadonlyDeep } from 'type-fest';

export type PageAlertDto = ReadonlyDeep<{
  id: string,
  alertHeading: string,
  alertBody?: string,
  type: string,
}>;

export type CardAlertDto = {
  id: string,
  alerts: {
    id: string,
    alertHeading: string,
    alertBody: string,
    type: string,
  }[],
};

export type ExitBetaDto = ReadonlyDeep<{
  title?: string,
  link: string,
}>;
