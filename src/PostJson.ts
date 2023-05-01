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
  public isPage: boolean;

  public toIPost(): IPost {
    return{
      ...this,
      date: DateHelper.dateFromTimestampString(this.date),
    }
  }

  public static fromPost(source: IPost) {
    const postJson = new PostJson();

    if (source) {
      Object.assign(postJson, {
        ...source,
        date: DateHelper.timestampStringFromDate(source.date),
      });
    }

    return postJson;
  }

  public static fromObject(source: any): PostJson {
    const postJson = new PostJson();

    Object.assign(postJson, source);

    return postJson;
  }
}