export interface IPost {
  key: string;
  title: string;
  author?: string;
  date?: Date;
  body?: string;
  category?: string;
  tags?: string[];
}