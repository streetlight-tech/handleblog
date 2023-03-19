import { IPost, IPostProvider, Renderer } from '../../src/index';
import { IPostQuery } from '../../src/IPostQuery';
import { ITemplateProvider } from '../../src/ITemplateProvider';

const mockGetHome = jest.fn();
const mockGetList = jest.fn();
const mockGetPost = jest.fn();

const templateProvider: ITemplateProvider = {
  getHomeTemplate: mockGetHome,
  getListTemplate: mockGetList,
  getPostTemplate: mockGetPost,
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
    it('should render template with all post fields and handle invalid dates', async() => {
      const postProvider: IPostProvider = {
        list: (query?: IPostQuery): Promise<IPost[]> => {
          return Promise.resolve([
            {
              key: 'post-1',
              title: 'Blog post 1',
              author: 'Bloggy Blogerton',
              date: new Date(2000, 0, 1).toLocaleDateString('en-us'),
              body: 'This is a blog post',
              category: 'Posts about Blogs',
              tags: [ 'blog', 'post' ],
            },
            {
              key: 'post-2',
              title: 'Blog post 2',
              author: 'Bloggy Blogerton',
              date: 'Invalid Date',
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

      expect(result).toBe('post-1:Blog post 1:Bloggy Blogerton:Jan 1, 2000::<p>This is a blog post</p>\n/Posts about Blogs[blog,post,]post-2:Blog post 2:Bloggy Blogerton:Invalid Date::<p>This is another blog post</p>\n/Posts about Blogs[blog,post,]');
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
              date: new Date(2000, 0, 1).toLocaleDateString('en-us'),
              body: 'This is a blog post',
              category: 'Posts about Blogs',
              tags: [ 'blog', 'post' ],
            },
            {
              key: 'post-2',
              title: 'Blog post 2',
              author: 'Bloggy Blogerton',
              date: new Date(2000, 0, 2).toLocaleDateString('en-us'),
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
            date: new Date(2000, 0, 1).toLocaleDateString('en-us'),
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
  });
});