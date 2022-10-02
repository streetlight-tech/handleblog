import { IPost } from './IPost';
import { IPostQuery } from './IPostQuery';

export interface IPostProvider {
  list(query?: IPostQuery): Promise<IPost[]>;
  get(key: string): Promise<IPost>;
  save(post: IPost): Promise<void>;
}