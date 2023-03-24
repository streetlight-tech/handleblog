import { PostJson } from '../../src';

describe('PostJson', () => {
  describe('constructor', () => {
    it('parses an IPost', () => {
      const postJson = new PostJson({
        key: 'Key',
        title: 'Title',
        author: 'Author',
        date: new Date('2023-01-01'),
        body: 'Body',
        category: 'Category',
        tags: [],
      });

      expect(postJson).toEqual({
        key: 'Key',
        title: 'Title',
        author: 'Author',
        date: '1672531200000',
        body: 'Body',
        category: 'Category',
        tags: [],
      });
    });
  });

  describe('toIPost', () => {
    it('returns IPost', () => {
      const postJson = new PostJson();
      Object.assign(
        postJson, 
        {
          key: 'Key',
          title: 'Title',
          author: 'Author',
          date: '1672531200000',
          body: 'Body',
          category: 'Category',
          tags: [],
        }
      );

      const post = postJson.toIPost();

      expect(post).toEqual({
        key: 'Key',
        title: 'Title',
        author: 'Author',
        date: new Date('2023-01-01'),
        body: 'Body',
        category: 'Category',
        tags: [],
      });
    });
  });
});