import { ROUTES } from '@/shared/config';

describe('shared/config/routes (unit)', () => {
  it('builds nested route helpers', () => {
    expect(ROUTES.STORES.DETAIL('7')).toBe('/stores/7');
    expect(ROUTES.MANAGE_MENUS.DETAIL('3')).toBe('/manage-menus/3');
    expect(ROUTES.MANAGE_RESERVE.DETAIL(42)).toBe('/manage-reserve/detail/42');
    expect(ROUTES.LOGIN).toBe('/login');
  });
});
