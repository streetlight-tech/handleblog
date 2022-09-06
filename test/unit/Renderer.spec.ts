import { IPostProvider, ITemplateProvider, Renderer } from '../../src/index';

const mockList = jest.fn();
const mockGet = jest.fn();
const postProvider: IPostProvider = {
  list: mockList,
  get: mockGet,
};

const mockGetHomeTemplate = jest.fn();
const mockGetListTemplate = jest.fn();
const mockGetPostTemplate = jest.fn();
const templateProvider: ITemplateProvider = {
  getTemplate: jest.fn(),
  getHomeTemplate: mockGetHomeTemplate,
  getListTemplate: mockGetListTemplate,
  getLPostTemplate: mockGetPostTemplate,
};

const renderer = new Renderer({
  templateProvider,
  postProvider,
});

describe('Renderer', () => {
  describe('render()', () => {
    it('should render template with content', async() => {
      const result = await renderer.render('Handlebars <b>{{doesWhat}}</b> compiled!', { doesWhat: 'rocks!' });

      expect(result).toBe('Handlebars <b>rocks!</b> compiled!');
    });
  });

  describe('renderList()', () => {
    it('should render home with minimum post fields', async() => {
      mockList.mockResolvedValue([
        {
          key: 'post-1',
          title: 'Blog post 1',
        },
        {
          key: 'post-2',
          title: 'Blog post 2',
        }
      ]);

      mockGetHomeTemplate.mockResolvedValue('<ul>{{#posts}}<li><a href="/post/{{key}}">{{title}}</a></li>{{/posts}}</ul>');

      const result = await renderer.renderHome();

      expect(result).toBe('<ul><li><a href="/post/post-1">Blog post 1</a></li><li><a href="/post/post-2">Blog post 2</a></li></ul>');
    });

    it('should render template with all post fields', async() => {
      mockList.mockResolvedValue([
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

      mockGetListTemplate.mockResolvedValue('{{#posts}}{{key}}:{{title}}:{{author}}:{{formatDate date}}::{{body}}/{{category}}[{{#tags}}{{this}},{{/tags}}]{{/posts}}');

      const result = await renderer.renderList();

      expect(result).toBe('post-1:Blog post 1:Bloggy Blogerton:Jan 1, 2000::This is a blog post/Posts about Blogs[blog,post,]post-2:Blog post 2:Bloggy Blogerton:Jan 2, 2000::This is another blog post/Posts about Blogs[blog,post,]');
    });
  });

  describe('renderPost()', () => {
    it('should render a single post', async() => {
      mockGet.mockResolvedValue({
        key: 'post-1',
        title: 'Blog post 1',
        author: 'Bloggy Blogerton',
        date: new Date(2000, 0, 1),
        body: 'This is a blog post',
        category: 'Posts about Blogs',
        tags: [ 'blog', 'post' ],
      });

      mockGetPostTemplate.mockResolvedValue('{{key}}:{{title}}:{{author}}:{{formatDate date}}::{{body}}/{{category}}[{{#tags}}{{this}},{{/tags}}]');

      const result = await renderer.renderPost('post-1');

      expect(result).toBe('post-1:Blog post 1:Bloggy Blogerton:Jan 1, 2000::This is a blog post/Posts about Blogs[blog,post,]');
    });
  });
});