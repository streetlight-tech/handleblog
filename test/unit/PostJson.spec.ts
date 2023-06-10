import { PostJson, PostStatus } from '../../src';

describe('PostJson', () => {
  describe('fromPost', () => {
    it('parses an IPost', () => {
      const postJson = PostJson.fromPost({
        key: 'Key',
        title: 'Title',
        author: 'Author',
        date: new Date('2023-01-01'),
        status: PostStatus.Published,
        body: 'Body',
        category: 'Category',
        tags: [],
        isPage: false,
      });

      expect(postJson).toEqual({
        key: 'Key',
        title: 'Title',
        author: 'Author',
        date: '1672531200000',
        status: 'published',
        body: 'Body',
        category: 'Category',
        tags: [],
        isPage: false,
      });
    });
  });

  describe('object', () => {
    it('parses a generic object', () => {
      const postJson = PostJson.fromObject({
        key: 'Key',
        title: 'Title',
        author: 'Author',
        date: '1672531200000',
        status: 'published',
        body: 'Body',
        category: 'Category',
        tags: [],
        isPage: false,
      });

      expect(postJson).toEqual({
        key: 'Key',
        title: 'Title',
        author: 'Author',
        date: '1672531200000',
        status: 'published',
        body: 'Body',
        category: 'Category',
        tags: [],
        isPage: false,
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
          status: 'published',
          body: 'Body',
          category: 'Category',
          tags: [],
          isPage: false,
        }
      );

      const post = postJson.toIPost();

      expect(post).toEqual({
        key: 'Key',
        title: 'Title',
        author: 'Author',
        date: new Date('2023-01-01'),
        status: 'published',
        body: 'Body',
        category: 'Category',
        tags: [],
        isPage: false,
      });
    });
  });
});