import Handlebars from 'handlebars';
import { marked } from 'marked';
import { IPageConfig } from './IPageConfig';
import { IPostProvider } from './IPostProvider';
import { IPost } from './IPost';
import { IRendererOptions } from './IRendererOptions';
import { ITemplateProvider } from './ITemplateProvider';
import { IPostQuery } from './IPostQuery';

export class Renderer {
  private postProvider: IPostProvider;
  private templateProvider: ITemplateProvider;
  private pageConfig: IPageConfig;

  constructor(options: IRendererOptions) {
    this.postProvider = options.postProvider;
    this.templateProvider = options.templateProvider;
    this.pageConfig = options.pageConfig;
    Handlebars.registerHelper('formatDate', this.formatDate)
  }

  public async render<T>(template: string, content: T): Promise<string> {
    console.log(content);
    
    const compiled = Handlebars.compile(template);

    return compiled(content);
  }

  public async renderHime<T>(query: IPostQuery): Promise<string> {
    const template = await this.templateProvider.getHomeTemplate();
    const posts = await this.postProvider.list(query);

    posts.map(p => Renderer.parseBody(p));

    return this.render(template, { 
      posts, 
      ...this.pageConfig,
    });
  }

  public async renderList<T>(query: IPostQuery): Promise<string> {
    const template = await this.templateProvider.getListTemplate();
    const posts = await this.postProvider.list(query);

    posts.map(p => Renderer.parseBody(p));

    return this.render(template, { 
      posts, 
      ...this.pageConfig,
    });
  }

  public async renderPost<T>(key: string): Promise<string> {
    const template = await this.templateProvider.getLPostTemplate();
    const post = await this.postProvider.get(key);

    Renderer.parseBody(post);

    return this.render(template, {
      ...post,
      ...this.pageConfig,
    });
  }

  public static parseBody(post: IPost) {
    post.body = marked.parse(post.body);
  }

  public formatDate(dateValue: string) {
    const date = new Date(dateValue);
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
    };
    
    return (new Intl.DateTimeFormat('en-US', options)).format(date);
  }
}
