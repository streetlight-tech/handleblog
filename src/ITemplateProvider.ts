export interface ITemplateProvider {
  getTemplate(type: string,): Promise<string>;
  getHomeTemplate(): Promise<string>; 
  getListTemplate(): Promise<string>;
  getPostTemplate(): Promise<string>;
  getUploadUrl(type: string): Promise<string>;
}