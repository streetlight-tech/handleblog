export interface IPost {
  key: string;
  title: string;
  author?: string;
  date?: string;
  body?: string;
  excerpt?: string;
  image?: string;
  category?: string;
  tags?: string[];
  isPage?: boolean;
}