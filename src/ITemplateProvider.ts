export interface ITemplateProvider {
  getTemplate(key: string): Promise<string>;
  getHomeTemplate(): Promise<string>;
  getListTemplate(): Promise<string>;
  getLPostTemplate(): Promise<string>;
}