import { PostStatus } from './index';

export interface IPostQuery {
  key?: string;
  title?: string;
  author?: string;
  status?: PostStatus;
  minDate?: Date;
  maxDate?: Date;
  body?: string;
  category?: string;
  tags?: string[];
  isPage?: boolean;
}