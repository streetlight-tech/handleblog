import { DateHelper, IPost } from './index';

export class PostJson {
  public key: string;
  public title: string;
  public author: string;
  public date: string;
  public body: string;
  public excerpt: string;
  public image: string;
  public category: string;
  public tags: string[];

  constructor(post?: IPost) {
    if (post) {
      Object.assign(this, {
        ...post,
        date: DateHelper.timestampStringFromDate(post.date),
      });
    }
  }

  public toIPost(): IPost {
    return{
      ...this,
      date: DateHelper.dateFromTimestampString(this.date),
    }
  }
}