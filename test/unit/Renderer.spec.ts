import { IPostProvider, Renderer } from '../../src/index';

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
      };

      const renderer = new Renderer(postProvider);
      const result = await renderer.render('Handlebars <b>{{doesWhat}}</b> compiled!', { doesWhat: 'rocks!' });

      expect(result).toBe('Handlebars <b>rocks!</b> compiled!');
    });
  });

  describe('renderList()', () => {
    it('should render template with all post fields', async() => {
      const postProvider: IPostProvider = {
        list: () => {
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
      };

      const renderer = new Renderer(postProvider);

      const template = '{{#posts}}{{key}}:{{title}}:{{author}}:{{formatDate date}}::{{body}}/{{category}}[{{#tags}}{{this}},{{/tags}}]{{/posts}}';
      const result = await renderer.renderList(template);

      expect(result).toBe('post-1:Blog post 1:Bloggy Blogerton:Jan 1, 2000::This is a blog post/Posts about Blogs[blog,post,]post-2:Blog post 2:Bloggy Blogerton:Jan 2, 2000::This is another blog post/Posts about Blogs[blog,post,]');
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
      };

      const renderer = new Renderer(postProvider);

      const template = '<ul>{{#posts}}<li><a href="/post/{{key}}">{{title}}</a></li>{{/posts}}</ul>';
      const result = await renderer.renderList(template);

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
            body: 'This is a blog post',
            category: 'Posts about Blogs',
            tags: [ 'blog', 'post' ],
          });
        },
      };

      const renderer = new Renderer(postProvider);

      const template = '{{key}}:{{title}}:{{author}}:{{formatDate date}}::{{body}}/{{category}}[{{#tags}}{{this}},{{/tags}}]';
      const result = await renderer.renderPost('post-1', template);

      expect(result).toBe('post-1:Blog post 1:Bloggy Blogerton:Jan 1, 2000::This is a blog post/Posts about Blogs[blog,post,]');
    });
  });
});