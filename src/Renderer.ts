import Handlebars from 'handlebars';
import { marked, Renderer as MDRenderer } from 'marked';
import { IPageConfig } from './IPageConfig';
import { IPostProvider } from './IPostProvider';
import { IPost } from './IPost';
import { IRendererOptions } from './IRendererOptions';
import { ITemplateProvider } from './ITemplateProvider';
import { IPostQuery } from './IPostQuery';

const excerptRenderer = Object.assign(new MDRenderer(), {
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
});

export class Renderer {
  public pageConfig: IPageConfig;
  
  private postProvider: IPostProvider;
  private templateProvider: ITemplateProvider;
  private bodyRenderer: MDRenderer;

  constructor(options: IRendererOptions) {
    this.postProvider = options.postProvider;
    this.templateProvider = options.templateProvider;
    this.pageConfig = options.pageConfig;
    this.bodyRenderer = Object.assign(new MDRenderer(), {
      image(href: string, title: string, text: string) {
        return `<img src="${options.pageConfig.contentRoot}/${href}" alt="${text}" />`;
      },
    });

    Handlebars.registerHelper('formatDate', this.formatDate);
  }

  public async render<T>(template: string, content: T): Promise<string> {
    const compiled = Handlebars.compile(template);

    return compiled(content);
  }

  public async renderHome(query?: IPostQuery): Promise<string> {
    const template = await this.templateProvider.getHomeTemplate();
    const posts = await this.postProvider.list(query);

    return this.render(template, { 
      posts, 
      ...this.pageConfig,
    });
  }

  public async renderList(query?: IPostQuery): Promise<string> {
    const template = await this.templateProvider.getListTemplate();
    const posts = await this.postProvider.list(query);

    return this.render(template, { 
      posts, 
      ...this.pageConfig,
    });
  }

  public async renderPost(key: string): Promise<string> {
    const template = await this.templateProvider.getPostTemplate();
    if (!template) {
      return;
    }
    
    const post = await this.postProvider.get(key);

    if (!post) {
      return;
    }

    this.parseBody(post);

    return this.render(template, {
      ...post,
      ...this.pageConfig,
    });
  }

  public parseBody(post: IPost) {
    if (post.body) {
      marked.defaults.renderer = this.bodyRenderer;
      post.body = marked.parse(post.body);
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
    marked.defaults.renderer = excerptRenderer;
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