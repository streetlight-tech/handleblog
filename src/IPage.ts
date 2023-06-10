import { PostStatus } from './index';

export interface IPage {
  key: string;
  title: string;
  status: PostStatus;
  body?: string;
  imageUrl?: string;
}