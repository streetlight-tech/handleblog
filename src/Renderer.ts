import Handlebars from 'handlebars';
import { IPostProvider } from 'IPostProvider';
import { IRendererOptions } from 'IRendererOptions';
import { ITemplateProvider } from 'ITemplateProvider';

export class Renderer {
  private postProvider: IPostProvider;
  private templateProvider: ITemplateProvider;

  constructor(options: IRendererOptions) {
    this.postProvider = options.postProvider;
    this.templateProvider = options.templateProvider;

    Handlebars.registerHelper('formatDate', this.formatDate)
  }

  public async render<T>(template: string, content: T): Promise<string> {
    const compiled = Handlebars.compile(template);
    return compiled(content);
  }

  public async renderHome<T>(): Promise<string> {
    const template = await this.templateProvider.getHomeTemplate();
    const posts = await this.postProvider.list();
    const compiled = Handlebars.compile(template);

    return compiled({ posts });
  }

  public async renderList<T>(): Promise<string> {
    const template = await this.templateProvider.getListTemplate();
    const posts = await this.postProvider.list();
    const compiled = Handlebars.compile(template);

    return compiled({ posts });
  }

  public async renderPost<T>(key: string): Promise<string> {
    const template = await this.templateProvider.getLPostTemplate();
    const post = await this.postProvider.get(key);
    const compiled = Handlebars.compile(template);

    return compiled(post);
  }

  public formatDate(date: Date) {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
    };
    return (new Intl.DateTimeFormat('en-US', options)).format(date);
  }
}