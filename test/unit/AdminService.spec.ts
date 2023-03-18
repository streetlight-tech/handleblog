import { AdminService, IContentProvider, IPost, IPostProvider, Renderer } from '../../src/index';
import { IPostQuery } from '../../src/IPostQuery';

const mockSave = jest.fn();
const mockListPosts = jest.fn();
const mockList = jest.fn();
const mockGetUploadUrl = jest.fn();

const postProvider: IPostProvider = {
  save: mockSave,
  list: mockListPosts,
  get: jest.fn(),
};

const contentProvider: IContentProvider = {
  list: mockList,
  getUploadUrl: mockGetUploadUrl,
  save: jest.fn(),
};

describe('AdminService', () => {
  describe('listPosts()', () => {
    it('should call list', async() => {
      const adminService = new AdminService(postProvider, contentProvider);

      await adminService.listPosts();

      expect(mockListPosts).toHaveBeenCalledWith(undefined);
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