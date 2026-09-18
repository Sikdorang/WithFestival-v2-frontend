import MockAdapter from 'axios-mock-adapter';
import { menuAPI } from '@/apis/menu';
import axiosInstance from '@/shared/api/instance';
import axios from 'axios';

describe('apis/menu remaining endpoints (integration)', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(axiosInstance);
  });

  afterEach(() => {
    mock.restore();
  });

  it('creates and updates menus with multipart form data', async () => {
    const form = new FormData();
    form.append('name', '라면');

    mock.onPost('/menus').reply(201, { id: 1 });
    mock.onPatch('/menus/1').reply(200, { id: 1, name: '라면' });
    mock.onDelete('/menu/1/image').reply(200, { deleted: true });
    mock
      .onPatch('/menu/1/image', { fileName: 'a.png' })
      .reply(200, { url: 'https://s3/upload' });

    await expect(menuAPI.createMenu(form)).resolves.toEqual({ id: 1 });
    await expect(menuAPI.updateMenu(1, form)).resolves.toEqual({
      id: 1,
      name: '라면',
    });
    await expect(menuAPI.deleteMenuImage(1)).resolves.toEqual({
      deleted: true,
    });
    const uploadUrl = await menuAPI.getImageUploadUrl(1, {
      fileName: 'a.png',
    });
    expect(uploadUrl.data).toEqual({ url: 'https://s3/upload' });
  });

  it('uploads a file to S3 with the file content type', async () => {
    const putSpy = jest.spyOn(axios, 'put').mockResolvedValue({ status: 200 });
    const file = new File(['x'], 'a.png', { type: 'image/png' });

    await menuAPI.uploadToS3('https://s3/upload', file);

    expect(putSpy).toHaveBeenCalledWith('https://s3/upload', file, {
      headers: { 'Content-Type': 'image/png' },
    });
    putSpy.mockRestore();
  });
});
