import { 
  IPost, 
  IPostProvider, 
  IPostQuery, 
  ITemplateProvider, 
  Renderer 
} from '../../src/index';

const mockGetHomeTemplate = jest.fn();
const mockGetListTemplate = jest.fn();
const mockGetPostTemplate = jest.fn();
const mockGetPageTemplate = jest.fn();

const templateProvider: ITemplateProvider = {
  getTemplate: jest.fn(),
  getHomeTemplate: mockGetHomeTemplate,
  getListTemplate: mockGetListTemplate,
  getPostTemplate: mockGetPostTemplate,
  getPageTemplate: mockGetPageTemplate,
  getUploadUrl: jest.fn(),
};

const mockListPosts = jest.fn();
const mockGetPost = jest.fn();

const postProvider: IPostProvider = {
  list: mockListPosts,
  get: mockGetPost,
  save: jest.fn(),
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

describe('Renderer', () => {
  describe('render()', () => {
    it('should render template with content', async() => {
      const result = await renderer.render('Handlebars <b>{{doesWhat}}</b> compiled!', { doesWhat: 'rocks!' });

      expect(result).toBe('Handlebars <b>rocks!</b> compiled!');
    });
  });

  describe('parseBody', () => {
    it('should parse markdown', () => {
      const body = `# Heading

\`\`\`
source
\`\`\`

|Table|
-------
|Row  |

- List
- Items

1. Ordered
2. List

> Block Quote

[link](/link) ![image](image) **bold** *italics* ~~strikethrough~~ \`inline-code\``;

      const post: IPost = { key: 'key', title: 'title', body };
      
      renderer.parseBody(post);

      expect(post.body).toEqual(`<h1 id=\"heading\">Heading</h1>
<pre><code>source
</code></pre>
<table>
<thead>
<tr>
<th>Table</th>
</tr>
</thead>
<tbody><tr>
<td>Row</td>
</tr>
</tbody></table>
<ul>
<li>List</li>
<li>Items</li>
</ul>
<ol>
<li>Ordered</li>
<li>List</li>
</ol>
<blockquote>
<p>Block Quote</p>
</blockquote>
<p><a href=\"/link\">link</a> <img src=\"https://content.here.com/image\" alt=\"image\" /> <strong>bold</strong> <em>italics</em> <del>strikethrough</del> <code>inline-code</code></p>
`);
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

  describe('renderHome()', () => {
    it('should render template with all post fields, exclude pages, and handle missing dates', async() => {
      mockListPosts.mockResolvedValueOnce([
        {
          key: 'post-1',
          title: 'Blog post 1',
          author: 'Bloggy Blogerton',
          date: new Date(2000, 0, 1),
          excerpt: 'This is a blog post',
          category: 'Posts about Blogs',
          tags: [ 'blog', 'post' ],
        },
        {
          key: 'post-2',
          title: 'Blog post 2',
          author: 'Bloggy Blogerton',
          excerpt: 'This is another blog post',
          category: 'Posts about Blogs',
          tags: [ 'blog', 'post' ],
        }
      ]);

      mockGetHomeTemplate.mockResolvedValue('{{#posts}}{{key}}:{{title}}:{{author}}:{{formatDate date}}::{{excerpt}}/{{category}}[{{#tags}}{{this}},{{/tags}}]{{/posts}}');
      const result = await renderer.renderHome();

      expect(mockListPosts).toHaveBeenCalledWith({ isPage: false});

      expect(result).toBe('post-1:Blog post 1:Bloggy Blogerton:Jan 1, 2000::This is a blog post/Posts about Blogs[blog,post,]post-2:Blog post 2:Bloggy Blogerton:::This is another blog post/Posts about Blogs[blog,post,]');
    });
  });

  describe('renderList()', () => {

    it('should render list with minimum post fields', async() => {
      mockListPosts.mockResolvedValueOnce([
        {
          key: 'post-1',
          title: 'Blog post 1',
        },
        {
          key: 'post-2',
          title: 'Blog post 2',
        }
      ]);

      mockGetListTemplate.mockResolvedValue('<ul>{{#posts}}<li><a href="/post/{{key}}">{{title}}</a></li>{{/posts}}</ul>');
      const result = await renderer.renderList();

      expect(result).toBe('<ul><li><a href="/post/post-1">Blog post 1</a></li><li><a href="/post/post-2">Blog post 2</a></li></ul>');
    });
  });

  describe('renderList()', () => {
    it('should render template with all post fields', async() => {
      mockListPosts.mockResolvedValueOnce([
        {
          key: 'post-1',
          title: 'Blog post 1',
          author: 'Bloggy Blogerton',
          date: new Date(2000, 0, 1),
          excerpt: 'This is a blog post',
          category: 'Posts about Blogs',
          tags: [ 'blog', 'post' ],
        },
        {
          key: 'post-2',
          title: 'Blog post 2',
          author: 'Bloggy Blogerton',
          date: new Date(2000, 0, 2),
          excerpt: 'This is another blog post',
          category: 'Posts about Blogs',
          tags: [ 'blog', 'post' ],
        }
      ]);

      mockGetListTemplate.mockResolvedValue('{{#posts}}{{key}}:{{title}}:{{author}}:{{formatDate date}}::{{excerpt}}/{{category}}[{{#tags}}{{this}},{{/tags}}]{{/posts}}');
      const result = await renderer.renderList();

      expect(result).toBe('post-1:Blog post 1:Bloggy Blogerton:Jan 1, 2000::This is a blog post/Posts about Blogs[blog,post,]post-2:Blog post 2:Bloggy Blogerton:Jan 2, 2000::This is another blog post/Posts about Blogs[blog,post,]');
    });

    it('should render list with minimum post fields', async() => {
      mockListPosts.mockResolvedValueOnce([
        {
          key: 'post-1',
          title: 'Blog post 1',
        },
        {
          key: 'post-2',
          title: 'Blog post 2',
        }
      ]);

      mockGetListTemplate.mockResolvedValue('<ul>{{#posts}}<li><a href="/post/{{key}}">{{title}}</a></li>{{/posts}}</ul>');
      const result = await renderer.renderList();

      expect(result).toBe('<ul><li><a href="/post/post-1">Blog post 1</a></li><li><a href="/post/post-2">Blog post 2</a></li></ul>');
    });
  });

  describe('renderPost()', () => {
    it('should render a single post', async() => {
      mockGetPost.mockResolvedValueOnce({
        key: 'post-1',
        title: 'Blog post 1',
        author: 'Bloggy Blogerton',
        date: new Date(2000, 0, 1),
        body: 'This is a blog post with an image ![image](image.png)',
        category: 'Posts about Blogs',
        tags: [ 'blog', 'post' ],
      });
      
      mockGetPostTemplate.mockResolvedValue('{{key}}:{{title}}:{{author}}:{{formatDate date}}::{{{body}}}/{{category}}[{{#tags}}{{this}},{{/tags}}]');
      const result = await renderer.renderPost('post-1');

      expect(result).toBe('post-1:Blog post 1:Bloggy Blogerton:Jan 1, 2000::<p>This is a blog post with an image <img src="https://content.here.com/image.png" alt="image" /></p>\n/Posts about Blogs[blog,post,]');
    });

    it('should render a single post even after list is called', async() => {
      mockListPosts.mockResolvedValueOnce([
        {
          key: 'post-1',
          title: 'Blog post 1',
          author: 'Bloggy Blogerton',
          date: new Date(2000, 0, 1),
          excerpt: 'This is a blog post',
          category: 'Posts about Blogs',
          tags: [ 'blog', 'post' ],
        },
        {
          key: 'post-2',
          title: 'Blog post 2',
          author: 'Bloggy Blogerton',
          date: new Date(2000, 0, 2),
          excerpt: 'This is another blog post',
          category: 'Posts about Blogs',
          tags: [ 'blog', 'post' ],
        }
      ]);

      mockGetPost.mockResolvedValueOnce({
        key: 'post-1',
        title: 'Blog post 1',
        author: 'Bloggy Blogerton',
        date: new Date(2000, 0, 1),
        body: 'This is a blog post with an image ![image](image.png)',
        category: 'Posts about Blogs',
        tags: [ 'blog', 'post' ],
      });

      mockGetListTemplate.mockResolvedValue('{{#posts}}{{key}}:{{title}}:{{author}}:{{formatDate date}}::{{excerpt}}/{{category}}[{{#tags}}{{this}},{{/tags}}]{{/posts}}');
      const listResult = await renderer.renderList();

      expect(listResult).toBe('post-1:Blog post 1:Bloggy Blogerton:Jan 1, 2000::This is a blog post/Posts about Blogs[blog,post,]post-2:Blog post 2:Bloggy Blogerton:Jan 2, 2000::This is another blog post/Posts about Blogs[blog,post,]');
   
      mockGetPostTemplate.mockResolvedValue('{{key}}:{{title}}:{{author}}:{{formatDate date}}::{{{body}}}/{{category}}[{{#tags}}{{this}},{{/tags}}]');
      const result = await renderer.renderPost('post-1');

      expect(result).toBe('post-1:Blog post 1:Bloggy Blogerton:Jan 1, 2000::<p>This is a blog post with an image <img src="https://content.here.com/image.png" alt="image" /></p>\n/Posts about Blogs[blog,post,]');
    });

    it('should use page template if post.isPage is true', async() => {
      mockGetPageTemplate.mockResolvedValue('{{key}} Page Template');
      mockGetPost.mockResolvedValueOnce({
        key: 'page-1',
        title: 'Page 1',
        body: 'Body',
        isPage: true,
      });
      
      const result = await renderer.renderPost('post-1');

      expect(result).toEqual('page-1 Page Template');
    });



    it('should return undefined if no template found', async() => {
      mockGetPost.mockResolvedValueOnce({
        key: 'post-1',
        title: 'Post 1',
        body: 'Body',
        isPage: false,
      });
      mockGetPostTemplate.mockResolvedValue(undefined);

      const result = await renderer.renderPost('post-1');

      expect(result).toBeUndefined();
    });

    it('should return undefined if no post found', async() => {
      mockGetPostTemplate.mockResolvedValue('{{key}}:{{title}}:{{author}}:{{formatDate date}}::{{{body}}}/{{category}}[{{#tags}}{{this}},{{/tags}}]');
      mockGetPost.mockResolvedValueOnce(undefined);
      
      const result = await renderer.renderPost('post-1');

      expect(result).toBeUndefined();
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
