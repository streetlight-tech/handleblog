export interface IPost {
  key: string;
  title: string;
  author?: string;
  date?: string;
  body?: string;
  excerpt?: string;
  imageUrl?: string;
  category?: string;
  tags?: string[];
}