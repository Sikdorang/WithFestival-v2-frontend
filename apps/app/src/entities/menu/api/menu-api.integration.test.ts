import MockAdapter from 'axios-mock-adapter';
import { menuAPI } from '@/entities/menu';
import axiosInstance from '@/shared/api/instance';

describe('entities/menu api (integration)', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(axiosInstance);
  });

  afterEach(() => {
    mock.restore();
  });

  it('lists and toggles menu availability', async () => {
    mock.onGet('/menus').reply(200, [{ id: 1, name: '라면' }]);
    mock.onGet('/stores/2/menus').reply(200, [{ id: 1 }]);
    mock.onPost('/menus/1/sold-out').reply(200, { soldOut: true });
    mock.onPost('/menus/1/available').reply(200, { soldOut: false });
    mock.onDelete('/menus/1').reply(200, { deleted: true });

    await expect(menuAPI.getMenus()).resolves.toEqual([
      { id: 1, name: '라면' },
    ]);
    await expect(menuAPI.getMenusByStoreId(2)).resolves.toEqual([{ id: 1 }]);
    await expect(menuAPI.setMenuSoldOut(1)).resolves.toEqual({ soldOut: true });
    await expect(menuAPI.setMenuAvailable(1)).resolves.toEqual({
      soldOut: false,
    });
    await expect(menuAPI.deleteMenu(1)).resolves.toEqual({ deleted: true });
  });
});
