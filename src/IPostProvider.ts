import { IPost } from './IPost';

export interface IPostProvider {
  list(): Promise<IPost[]>;
  get(key: string): Promise<IPost>;
}