import { ISocialLink } from './ISocialLink';

export interface IPageConfig {
  pageTitle: string;
  root: string;
  contentRoot: string;
  social: ISocialLink[];
}