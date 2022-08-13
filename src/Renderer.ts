import Handlebars from 'handlebars';

export class Renderer {
  public static async render<T>(template: string, content: T): Promise<string> {
    const compiled = Handlebars.compile(template);
    return compiled(content);
  }
}