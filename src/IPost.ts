import { PostStatus } from './index';

export interface IPost {
  key: string;
  title: string;
  status: PostStatus;
  author?: string;
  date?: Date;
  body?: string;
  excerpt?: string;
  image?: string;
  category?: string;
  tags?: string[];
  isPage?: boolean;
}