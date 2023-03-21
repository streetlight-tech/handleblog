import { AdminService, IContentProvider, IPost, IPostProvider, ITemplateProvider, Renderer } from '../../src/index';
import { IPostQuery } from '../../src/IPostQuery';

const mockGetPost = jest.fn();
const mockSave = jest.fn();
const mockListPosts = jest.fn();
const mockList = jest.fn();
const mockGetUploadUrl = jest.fn();
const mockGetTemplate = jest.fn();

const postProvider: IPostProvider = {
  get: mockGetPost,
  save: mockSave,
  list: mockListPosts,
};

const contentProvider: IContentProvider = {
  list: mockList,
  getUploadUrl: mockGetUploadUrl,
  save: jest.fn(),
};

const templateProvider: ITemplateProvider = {
  getTemplate: mockGetTemplate,
  getHomeTemplate: jest.fn(),
  getListTemplate: jest.fn(),
  getPostTemplate: jest.fn(),
  getUploadUrl: mockGetUploadUrl,
};

describe('AdminService', () => {
  describe('getPost()', () => {
    it('should call get', async() => {
      const adminService = new AdminService(postProvider, contentProvider, templateProvider);

      mockGetPost.mockResolvedValueOnce({
        key: 'foo',
        title: 'Title',
        body: 'Body',
      });

      const posts = await adminService.getPost('foo');

      expect(mockGetPost).toHaveBeenCalledWith('foo');

      expect(posts).toEqual({
        key: 'foo',
        title: 'Title',
        body: 'Body',
      })
    });
  });

  describe('listPosts()', () => {
    it('should call list', async() => {
      const adminService = new AdminService(postProvider, contentProvider, templateProvider);

      mockListPosts.mockResolvedValueOnce([{
        key: 'foo',
        title: 'Title',
        body: 'Body',
      }]);

      const posts = await adminService.listPosts();

      expect(mockListPosts).toHaveBeenCalledWith(undefined);

      expect(posts).toEqual([{
        key: 'foo',
        title: 'Title',
        body: 'Body',
      }])
    });
  });

  describe('save()', () => {
    it('should call save', async() => {
      const adminService = new AdminService(postProvider, contentProvider, templateProvider);

      await adminService.save({ key: 'foo', title: 'title' });

      expect(mockSave).toHaveBeenCalledWith({ key: 'foo', title: 'title' });
    });
  });

  describe('listContent()', () => {
    it('should call list', async() => {
      const adminService = new AdminService(postProvider, contentProvider, templateProvider);

      await adminService.listContent();

      expect(mockList).toHaveBeenCalledWith();
    });
  });

  describe('getTemplateUploadUrl()', () => {
    it('should call getUploadUrl', async() => {
      const adminService = new AdminService(postProvider, contentProvider, templateProvider);

      await adminService.getTemplateUploadUrl('home');

      expect(mockGetUploadUrl).toHaveBeenCalledWith('home');
    });

  });
});