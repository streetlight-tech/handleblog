import { IPostProvider } from "./IPostProvider";
import { ITemplateProvider } from "./ITemplateProvider";

export interface IRendererOptions {
  postProvider: IPostProvider;
  templateProvider: ITemplateProvider;
}