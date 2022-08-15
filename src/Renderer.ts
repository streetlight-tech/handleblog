import Handlebars from 'handlebars';
import { IPostProvider } from 'IPostProvider';

export class Renderer {
  private postProvider: IPostProvider;

  constructor(postProvider: IPostProvider) {
    this.postProvider = postProvider;
    Handlebars.registerHelper('formatDate', this.formatDate)
  }

  public async render<T>(template: string, content: T): Promise<string> {
    const compiled = Handlebars.compile(template);
    return compiled(content);
  }

  public async renderList<T>(template: string): Promise<string> {
    const posts = await this.postProvider.list();
    const compiled = Handlebars.compile(template);

    return compiled({ posts });
  }

  public async renderPost<T>(key: string, template: string): Promise<string> {
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