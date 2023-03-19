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
    const compiled = Handlebars.compile(template);

    return compiled(content);
  }

  public async renderHome<T>(query?: IPostQuery): Promise<string> {
    const template = await this.templateProvider.getHomeTemplate();
    const posts = await this.postProvider.list(query);

    posts.map(p => this.parseBody(p));

    return this.render(template, { 
      posts, 
      ...this.pageConfig,
    });
  }

  public async renderList<T>(query?: IPostQuery): Promise<string> {
    const template = await this.templateProvider.getListTemplate();
    const posts = await this.postProvider.list(query);

    posts.map(p => this.parseBody(p));

    return this.render(template, { 
      posts, 
      ...this.pageConfig,
    });
  }

  public async renderPost<T>(key: string): Promise<string> {
    const template = await this.templateProvider.getPostTemplate();
    const post = await this.postProvider.get(key);

    this.parseBody(post);

    return this.render(template, {
      ...post,
      ...this.pageConfig,
    });
  }

  public parseBody(post: IPost) {
    if (post.body) {
      const contentRoot = this.pageConfig.contentRoot;
      const renderer = {
        image(href: string, title: string, text: string) {
          return `<img src="${contentRoot}/${href}" alt="${text}" />`;
        },
      }

      marked.use({
        renderer,
      });

      post.body = marked.parse(post.body);
    }
  }

  public formatDate(date: string) {
    const dateValue = new Date(date);
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
    };
    
    try {
      return (new Intl.DateTimeFormat('en-US', options)).format(dateValue);
    } catch {
      return date;
    }
  }
}