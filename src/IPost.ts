export interface IPost {
  key: string;
  title: string;
  author?: string;
  date?: Date;
  body?: string;
  imageUrl?: string;
  category?: string;
  tags?: string[];
}