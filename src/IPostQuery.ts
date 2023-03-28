export interface IPostQuery {
  key?: string;
  title?: string;
  author?: string;
  minDate?: Date;
  maxDate?: Date;
  body?: string;
  category?: string;
  tags?: string[];
  isPage?: boolean;
}