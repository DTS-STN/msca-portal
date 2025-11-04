import type { ReadonlyDeep } from 'type-fest';

export type PageAlertEntity = ReadonlyDeep<{
  scId: string;
  scHeadingEn: string;
  scHeadingFr: string;
  scContentEn?: {
    markdown?: string;
  };
  scContentFr?: {
    markdown?: string;
  };
  scAlertType: string;
}>;

export type CardAlertEntity = ReadonlyDeep<{
  scId: string;
  schAlerts: {
    scId: string;
    scHeadingEn: string;
    scHeadingFr: string;
    scContentEn: {
      markdown: string;
    };
    scContentFr: {
      markdown: string;
    };
    scAlertType: string[];
  }[];
}>;

export type ExitBetaEntity = ReadonlyDeep<
  | {
      scId: string;
      scTitleEn?: string;
      scTitleFr?: string;
      scDestinationURLEn: string;
      scDestinationURLFr: string;
    }
  | undefined
>;

export type ScFragmentEntity = {
  scId: string;
  scItems: CardAlertEntity[] | undefined;
};
