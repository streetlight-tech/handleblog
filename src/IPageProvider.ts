import { IPage } from './IPage';
import { IPostQuery } from './IPostQuery';

export interface IPageProvider {
  list(query?: IPostQuery): Promise<IPage[]>;
  get(key: string): Promise<IPage>;
  save(post: IPage): Promise<void>;
}