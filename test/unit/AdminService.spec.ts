import { AdminService, IContentProvider, IPost, IPostProvider, Renderer } from '../../src/index';
import { IPostQuery } from '../../src/IPostQuery';

const mockGetPost = jest.fn();
const mockSave = jest.fn();
const mockListPosts = jest.fn();
const mockList = jest.fn();
const mockGetUploadUrl = jest.fn();

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

describe('AdminService', () => {
  describe('getPost()', () => {
    it('should call get', async() => {
      const adminService = new AdminService(postProvider, contentProvider);

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
      const adminService = new AdminService(postProvider, contentProvider);

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
      const adminService = new AdminService(postProvider, contentProvider);

      await adminService.save({ key: 'foo', title: 'title' });

      expect(mockSave).toHaveBeenCalledWith({ key: 'foo', title: 'title' });
    });
  });

  describe('listContent()', () => {
    it('should call list', async() => {
      const adminService = new AdminService(postProvider, contentProvider);

      await adminService.listContent();

      expect(mockList).toHaveBeenCalledWith();
    });
  });

  describe('getUploadUrl()', () => {
    it('should call getUploadUrl', async() => {
      const adminService = new AdminService(postProvider, contentProvider);

      await adminService.getUploadUrl('image.png');

      expect(mockGetUploadUrl).toHaveBeenCalledWith('image.png');
    });

  });
});