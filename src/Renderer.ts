import Handlebars from 'handlebars';
import { marked, Renderer as MDRenderer } from 'marked';
import { IPageConfig } from './IPageConfig';
import { IPostProvider } from './IPostProvider';
import { IPost } from './IPost';
import { IRendererOptions } from './IRendererOptions';
import { ITemplateProvider } from './ITemplateProvider';
import { IPostQuery } from './IPostQuery';

const defaultRenderer = new MDRenderer();

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

    return this.render(template, { 
      posts, 
      ...this.pageConfig,
    });
  }

  public async renderList<T>(query?: IPostQuery): Promise<string> {
    const template = await this.templateProvider.getListTemplate();
    const posts = await this.postProvider.list(query);

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
        ...defaultRenderer,
        image(href: string, title: string, text: string) {
          return `<img src="${contentRoot}/${href}" alt="${text}" />`;
        },
      }

      marked.use({
        renderer,
      });

      post.body = marked.parse(post.body);

      marked.use({
        renderer: new MDRenderer(),
      });
    }
  }

  public formatDate(date: string): string {
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

  public static stripMarkdown(text: string) {

    const renderer = {
      ...defaultRenderer,
      code() {
        return ' (code sample) ';
      },
      blockquote(quote: string) {
        return quote;
      },
      heading(text: string) {
        return text;
      },
      list() {
        return ' (list) ';
      },
      paragraph(text: string) {
        return text;
      },
      image(href: string, title: string, text: string) {
        return ` (image: ${text}) `;
      },
      strong(text: string) {
        return text;
      },
      em(text: string) {
        return text;
      },
      codespan(code: string) {
        return code;
      },
      link(href: string, title: string, text: string) {
        return text;
      },
    }

    marked.use({
      renderer,
    });

    const plainText = marked.parse(text);

    const spaces = new RegExp(/\s+/g);

    return plainText.replace(spaces, ' ');
  }

  public static getExcerpt(body: string): string {
    const maxLength = 500;

    const plainText = Renderer.stripMarkdown(body);

    if (plainText.length <= maxLength) {
      return plainText;
    }

    const trimmed = plainText.substring(0, maxLength);

    let index = trimmed.lastIndexOf('.');

    if (index < maxLength - 400) {
      index = trimmed.lastIndexOf(' ');
    }
    
    return trimmed.substring(0, index + 1);
  }
}