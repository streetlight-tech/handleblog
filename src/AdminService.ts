import { IContentProvider, IPost, IPostProvider, IPostQuery, ITemplateProvider } from './index';

export class AdminService {
  private postProvider: IPostProvider;
  private contentProvider: IContentProvider;
  private templateProvider: ITemplateProvider;

  constructor(postProvider: IPostProvider, contentProvider: IContentProvider, templateProvider: ITemplateProvider) {
    this.postProvider = postProvider;
    this.contentProvider = contentProvider;
    this.templateProvider = templateProvider;
  }

  public async listPosts(query?: IPostQuery): Promise<IPost[]> {
    return this.postProvider.list(query);
  }

  public async getPost(key: string): Promise<IPost> {
    return this.postProvider.get(key);
  }

  public async save(post: IPost): Promise<void> {
    await this.postProvider.save(post);
  }

  public async listContent(): Promise<string[]> {
    return this.contentProvider.list();
  }

  public async getUploadUrl(key: string, contentType?: string): Promise<string> {
    return this.contentProvider.getUploadUrl(key, contentType);
  }

  public async getTemplate(type: string): Promise<string> {
    return this.templateProvider.getTemplate(type);
  }

  public async getTemplateUploadUrl(type: string): Promise<string> {
    return this.templateProvider.getUploadUrl(type);
  }
}