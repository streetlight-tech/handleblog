export interface ITemplateProvider {
  getHomeTemplate(): Promise<string>; 
  getListTemplate(): Promise<string>;
  getPostTemplate(): Promise<string>;
}