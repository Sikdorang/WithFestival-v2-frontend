import MockAdapter from 'axios-mock-adapter';
import { storeAPI } from '@/entities/store';
import axiosInstance from '@/shared/api/instance';

describe('entities/store api (integration)', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(axiosInstance);
  });

  afterEach(() => {
    mock.restore();
  });

  it('loads public and my store info', async () => {
    mock.onGet('/stores/9/info').reply(200, { id: 9, name: '부스A' });
    mock.onGet('/stores/me/info').reply(200, { id: 9, name: '부스A' });

    await expect(storeAPI.getStorePublicInfo(9)).resolves.toEqual({
      id: 9,
      name: '부스A',
    });
    await expect(storeAPI.getStoreMyInfo()).resolves.toEqual({
      id: 9,
      name: '부스A',
    });
  });

  it('patches store settings', async () => {
    mock
      .onPatch('/stores/account-number', { accountNumber: '123' })
      .reply(200, { ok: true });
    mock.onPatch('/stores/name', { name: '새이름' }).reply(200, { ok: true });
    mock
      .onPatch('/stores/waitings-enabled', { waitingsEnabled: true })
      .reply(200, { ok: true });

    await expect(storeAPI.updateStoreInfo('123')).resolves.toEqual({
      ok: true,
    });
    await expect(storeAPI.updateStoreName('새이름')).resolves.toEqual({
      ok: true,
    });
    await expect(storeAPI.updateStoreWaitingsEnabled(true)).resolves.toEqual({
      ok: true,
    });
  });
});
