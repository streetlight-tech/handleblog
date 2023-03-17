import Readable from 'stream';

export interface IContentProvider {
  list(): Promise<string[]>;
  save(key: string, content: Readable): Promise<void>;
}