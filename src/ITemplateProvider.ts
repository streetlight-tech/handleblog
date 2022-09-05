export interface ITemplateProvider {
  getTemplate(key: string): Promise<string>;
}