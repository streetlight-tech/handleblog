import { IContentProvider, IPost, IPostProvider, IPostQuery } from './index';

export class AdminService {
  private postProvider: IPostProvider;
  private contentProvider: IContentProvider;

  constructor(postProvider: IPostProvider, contentProvider: IContentProvider) {
    this.postProvider = postProvider;
    this.contentProvider = contentProvider;
  }

  public async listPosts(query?: IPostQuery): Promise<void> {
    await this.postProvider.list(query);
  }

  public async save(post: IPost): Promise<void> {
    await this.postProvider.save(post);
  }

  public async listContent(): Promise<string[]> {
    return this.contentProvider.list();
  }

  public async getUploadUrl(key: string): Promise<string> {
    return this.contentProvider.getUploadUrl(key);
  }
}