import { IPageConfig } from "./IPageConfig";
import { IPageProvider } from "./IPageProvider";
import { IPostProvider } from "./IPostProvider";
import { ITemplateProvider } from "./ITemplateProvider";

export interface IRendererOptions {
  postProvider: IPostProvider;
  pageProvider: IPageProvider;
  templateProvider: ITemplateProvider;
  pageConfig: IPageConfig;
}