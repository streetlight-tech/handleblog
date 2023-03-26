import { 
  IPost, 
  IPostProvider, 
  IPostQuery, 
  ITemplateProvider, 
  Renderer 
} from '../../src/index';

const mockGetHome = jest.fn();
const mockGetList = jest.fn();
const mockGetPost = jest.fn();

const templateProvider: ITemplateProvider = {
  getTemplate: jest.fn(),
  getHomeTemplate: mockGetHome,
  getListTemplate: mockGetList,
  getPostTemplate: mockGetPost,
  getUploadUrl: jest.fn(),
};

describe('Renderer', () => {
  describe('render()', () => {
    it('should render template with content', async() => {
      const postProvider: IPostProvider = {
        list: () => {
          return Promise.resolve([]);
        },
        get: (key) => {
          return Promise.resolve({ key, title: 'foo' });
        },
        save: () => { return Promise.resolve(); },
      };

      const renderer = new Renderer({ 
        postProvider, 
        templateProvider,
        pageConfig: {
          pageTitle: 'Title',
          root: 'https://here.com',
          contentRoot: 'https://content.here.com',
          social: [],
        } 
      });

      const result = await renderer.render('Handlebars <b>{{doesWhat}}</b> compiled!', { doesWhat: 'rocks!' });

      expect(result).toBe('Handlebars <b>rocks!</b> compiled!');
    });
  });

  describe('renderHome()', () => {
    it('should render template with all post fields and handle missing dates', async() => {
      const postProvider: IPostProvider = {
        list: (query?: IPostQuery): Promise<IPost[]> => {
          return Promise.resolve([
            {
              key: 'post-1',
              title: 'Blog post 1',
              author: 'Bloggy Blogerton',
              date: new Date(2000, 0, 1),
              body: 'This is a blog post',
              category: 'Posts about Blogs',
              tags: [ 'blog', 'post' ],
            },
            {
              key: 'post-2',
              title: 'Blog post 2',
              author: 'Bloggy Blogerton',
              body: 'This is another blog post',
              category: 'Posts about Blogs',
              tags: [ 'blog', 'post' ],
            }
          ]);
        },
        get: (key) => {
          return Promise.resolve({ key, title: 'foo' });
        },
        save: () => { return Promise.resolve(); },
      };

      const renderer = new Renderer({ 
        postProvider, 
        templateProvider,
        pageConfig: {
          pageTitle: 'Title',
          root: 'https://here.com',
          contentRoot: 'https://content.here.com',
          social: [],
        } 
      });

      mockGetHome.mockResolvedValue('{{#posts}}{{key}}:{{title}}:{{author}}:{{formatDate date}}::{{{body}}}/{{category}}[{{#tags}}{{this}},{{/tags}}]{{/posts}}');
      const result = await renderer.renderHome();

      expect(result).toBe('post-1:Blog post 1:Bloggy Blogerton:Jan 1, 2000::<p>This is a blog post</p>\n/Posts about Blogs[blog,post,]post-2:Blog post 2:Bloggy Blogerton:::<p>This is another blog post</p>\n/Posts about Blogs[blog,post,]');
    });

    it('should render list with minimum post fields', async() => {
      const postProvider: IPostProvider = {
        list: () => {
          return Promise.resolve([
            {
              key: 'post-1',
              title: 'Blog post 1',
            },
            {
              key: 'post-2',
              title: 'Blog post 2',
            }
          ]);
        },
        get: (key) => {
          return Promise.resolve({ key, title: 'foo' });
        },
        save: () => { return Promise.resolve(); },
      };

      const renderer = new Renderer({ 
        postProvider, 
        templateProvider,
        pageConfig: {
          pageTitle: 'Title',
          root: 'https://here.com',
          contentRoot: 'https://content.here.com',
          social: [],
        } 
      });

      mockGetList.mockResolvedValue('<ul>{{#posts}}<li><a href="/post/{{key}}">{{title}}</a></li>{{/posts}}</ul>');
      const result = await renderer.renderList();

      expect(result).toBe('<ul><li><a href="/post/post-1">Blog post 1</a></li><li><a href="/post/post-2">Blog post 2</a></li></ul>');
    });
  });

  describe('renderList()', () => {
    it('should render template with all post fields', async() => {
      const postProvider: IPostProvider = {
        list: (query?: IPostQuery): Promise<IPost[]> => {
          return Promise.resolve([
            {
              key: 'post-1',
              title: 'Blog post 1',
              author: 'Bloggy Blogerton',
              date: new Date(2000, 0, 1),
              body: 'This is a blog post',
              category: 'Posts about Blogs',
              tags: [ 'blog', 'post' ],
            },
            {
              key: 'post-2',
              title: 'Blog post 2',
              author: 'Bloggy Blogerton',
              date: new Date(2000, 0, 2),
              body: 'This is another blog post',
              category: 'Posts about Blogs',
              tags: [ 'blog', 'post' ],
            }
          ]);
        },
        get: (key) => {
          return Promise.resolve({ key, title: 'foo' });
        },
        save: () => { return Promise.resolve(); },
      };

      const renderer = new Renderer({ 
        postProvider, 
        templateProvider,
        pageConfig: {
          pageTitle: 'Title',
          root: 'https://here.com',
          contentRoot: 'https://content.here.com',
          social: [],
        } 
      });


      mockGetList.mockResolvedValue('{{#posts}}{{key}}:{{title}}:{{author}}:{{formatDate date}}::{{{body}}}/{{category}}[{{#tags}}{{this}},{{/tags}}]{{/posts}}');
      const result = await renderer.renderList();

      expect(result).toBe('post-1:Blog post 1:Bloggy Blogerton:Jan 1, 2000::<p>This is a blog post</p>\n/Posts about Blogs[blog,post,]post-2:Blog post 2:Bloggy Blogerton:Jan 2, 2000::<p>This is another blog post</p>\n/Posts about Blogs[blog,post,]');
    });

    it('should render list with minimum post fields', async() => {
      const postProvider: IPostProvider = {
        list: () => {
          return Promise.resolve([
            {
              key: 'post-1',
              title: 'Blog post 1',
            },
            {
              key: 'post-2',
              title: 'Blog post 2',
            }
          ]);
        },
        get: (key) => {
          return Promise.resolve({ key, title: 'foo' });
        },
        save: () => { return Promise.resolve(); },
      };

      const renderer = new Renderer({ 
        postProvider, 
        templateProvider,
        pageConfig: {
          pageTitle: 'Title',
          root: 'https://here.com',
          contentRoot: 'https://content.here.com',
          social: [],
        } 
      });

      mockGetList.mockResolvedValue('<ul>{{#posts}}<li><a href="/post/{{key}}">{{title}}</a></li>{{/posts}}</ul>');
      const result = await renderer.renderList();

      expect(result).toBe('<ul><li><a href="/post/post-1">Blog post 1</a></li><li><a href="/post/post-2">Blog post 2</a></li></ul>');
    });
  });

  describe('renderPost()', () => {
    it('should render a single post', async() => {
      const postProvider: IPostProvider = {
        list: () => {
          return Promise.resolve([]);
        },
        get: (key) => {
          return Promise.resolve({
            key,
            title: 'Blog post 1',
            author: 'Bloggy Blogerton',
            date: new Date(2000, 0, 1),
            body: 'This is a blog post with an image ![image](image.png)',
            category: 'Posts about Blogs',
            tags: [ 'blog', 'post' ],
          });
        },
        save: () => { return Promise.resolve(); },
      };

      const renderer = new Renderer({ 
        postProvider, 
        templateProvider,
        pageConfig: {
          pageTitle: 'Title',
          root: 'https://here.com',
          contentRoot: 'https://content.here.com',
          social: [],
        } 
      });
      
      mockGetPost.mockResolvedValue('{{key}}:{{title}}:{{author}}:{{formatDate date}}::{{{body}}}/{{category}}[{{#tags}}{{this}},{{/tags}}]');
      const result = await renderer.renderPost('post-1');

      expect(result).toBe('post-1:Blog post 1:Bloggy Blogerton:Jan 1, 2000::<p>This is a blog post with an image <img src="https://content.here.com/image.png" alt="image" /></p>\n/Posts about Blogs[blog,post,]');
    });

    it('should render a single post even afte list', async() => {
      const postProvider: IPostProvider = {
        list: (query?: IPostQuery): Promise<IPost[]> => {
          return Promise.resolve([
            {
              key: 'post-1',
              title: 'Blog post 1',
              author: 'Bloggy Blogerton',
              date: new Date(2000, 0, 1),
              body: 'This is a blog post',
              category: 'Posts about Blogs',
              tags: [ 'blog', 'post' ],
            },
            {
              key: 'post-2',
              title: 'Blog post 2',
              author: 'Bloggy Blogerton',
              date: new Date(2000, 0, 2),
              body: 'This is another blog post',
              category: 'Posts about Blogs',
              tags: [ 'blog', 'post' ],
            }
          ]);
        } ,
        get: (key) => {
          return Promise.resolve({
            key,
            title: 'Blog post 1',
            author: 'Bloggy Blogerton',
            date: new Date(2000, 0, 1),
            body: 'This is a blog post with an image ![image](image.png)',
            category: 'Posts about Blogs',
            tags: [ 'blog', 'post' ],
          });
        },
        save: () => { return Promise.resolve(); },
      };

      const renderer = new Renderer({ 
        postProvider, 
        templateProvider,
        pageConfig: {
          pageTitle: 'Title',
          root: 'https://here.com',
          contentRoot: 'https://content.here.com',
          social: [],
        } 
      });


      mockGetList.mockResolvedValue('{{#posts}}{{key}}:{{title}}:{{author}}:{{formatDate date}}::{{{body}}}/{{category}}[{{#tags}}{{this}},{{/tags}}]{{/posts}}');
      const listResult = await renderer.renderList();

      expect(listResult).toBe('post-1:Blog post 1:Bloggy Blogerton:Jan 1, 2000::<p>This is a blog post</p>\n/Posts about Blogs[blog,post,]post-2:Blog post 2:Bloggy Blogerton:Jan 2, 2000::<p>This is another blog post</p>\n/Posts about Blogs[blog,post,]');
   
      mockGetPost.mockResolvedValue('{{key}}:{{title}}:{{author}}:{{formatDate date}}::{{{body}}}/{{category}}[{{#tags}}{{this}},{{/tags}}]');
      const result = await renderer.renderPost('post-1');

      expect(result).toBe('post-1:Blog post 1:Bloggy Blogerton:Jan 1, 2000::<p>This is a blog post with an image <img src="https://content.here.com/image.png" alt="image" /></p>\n/Posts about Blogs[blog,post,]');
    });

  });

  describe('stripMarkdown', () => {
    it('should remove formatting', () => {
      const input = '![image](image.png) **bold** *italics* `some code` and a [link](https://here.com)';

      const stripped = Renderer.stripMarkdown(input);

      expect(stripped).toBe(' (image: image) bold italics some code and a link');
    });

    it('should remove header formatting', () => {
      const input = '## Heading';

      const stripped = Renderer.stripMarkdown(input);

      expect(stripped).toBe('Heading');
    });

    it('should remove block quote formatting', () => {
      const input = '> Block quote';

      const stripped = Renderer.stripMarkdown(input);

      expect(stripped).toBe('Block quote');
    });

    it('should remove lists', () => {
      const input = `Here is a list:

- And
- This
- Is
- A
- List

That is the list.`;

      const excerpt = Renderer.getExcerpt(input);

      expect(excerpt).toBe('Here is a list: (list) That is the list.');
    });

    it('should remove code', () => {
      const input = `Here is a code sample:

    10 print 'hello world'
    20 goto 10

  That is the code.`;

      const excerpt = Renderer.getExcerpt(input);

      expect(excerpt).toBe('Here is a code sample: (code sample) That is the code.');
    });
  });

  describe('getExcerpt', () => {

    it('should not trim if less than the limit', () => {
      const input = 'nothingtotrimherebutitshouldntmatter';

      const excerpt = Renderer.getExcerpt(input);

      expect(excerpt).toBe('nothingtotrimherebutitshouldntmatter');
    });

    it('should trim at a sentence', () => {
      const input = `This is some long text. And here is another sentence. Now here is some more text to fill up the
      character imit. Now here is some more text to fill up the character imit. Now here is some more text to fill up
      the character imit. Now here is some more text to fill up the character imit. Now here is some more text to fill
      up the character imit. Now here is some more text to fill up the character imit. Now here is some more text to
      fill up the character imit. Now here is some more text to fill up the character imit. Now here is some more text
      to fill up the character imit. Now here is some more text to fill up the character imit.`;

      const excerpt = Renderer.getExcerpt(input);

      expect(excerpt).toBe('This is some long text. And here is another sentence. Now here is some more text to fill up the ' +
          'character imit. Now here is some more text to fill up the character imit. Now here is some more text to fill up ' +
          'the character imit. Now here is some more text to fill up the character imit. Now here is some more text to fill ' +
          'up the character imit. Now here is some more text to fill up the character imit. Now here is some more text to ' +
          'fill up the character imit.');
    });

    it('should trim at a space if there is no period within the limit', () => {
      const input = `This is some long text And here is another sentence Now here is some more text to fill up the
      character imit Now here is some more text to fill up the character imit Now here is some more text to fill up
      the character imit Now here is some more text to fill up the character imit Now here is some more text to fill
      up the character imit Now here is some more text to fill up the character imit Now here is some more text to
      fill up the character imit Now here is some more text to fill up the character imit Now here is some more text
      to fill up the character imit Now here is some more text to fill up the character imit`;

      const excerpt = Renderer.getExcerpt(input);

      expect(excerpt).toBe('This is some long text And here is another sentence Now here is some more text to fill up ' +
        'the character imit Now here is some more text to fill up the character imit Now here is some more text to ' +
        'fill up the character imit Now here is some more text to fill up the character imit Now here is some more ' +
        'text to fill up the character imit Now here is some more text to fill up the character imit Now here is some ' +
        'more text to fill up the character imit Now here is some more text to fill up the ');
    });
  });
});
