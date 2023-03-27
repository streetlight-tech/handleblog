export interface IPost {
  key: string;
  title: string;
  author?: string;
  date?: Date;
  body?: string;
  excerpt?: string;
  image?: string;
  category?: string;
  tags?: string[];
}