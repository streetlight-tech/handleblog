export interface ITemplateProvider {
  getTemplate(key: string): Promise<string>;
  getHomeTemplate(): Promise<string>;
  getListTemplate(): Promise<string>;
  getPostTemplate(): Promise<string>;
  getPageTemplate(): Promise<string>;
}