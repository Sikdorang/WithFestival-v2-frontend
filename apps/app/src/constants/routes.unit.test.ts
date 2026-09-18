import { ROUTES } from '@/constants/routes';

describe('constants/routes (unit)', () => {
  it('builds all parameterized routes including defaults', () => {
    expect(ROUTES.STORES.DETAIL()).toBe('/stores/:storeId');
    expect(ROUTES.STORES.DETAIL('9')).toBe('/stores/9');
    expect(ROUTES.MANAGE_MENUS.DETAIL()).toBe('/manage-menus/:menuId');
    expect(ROUTES.MANAGE_MENUS.DETAIL('1')).toBe('/manage-menus/1');
    expect(ROUTES.MENUS.DETAIL()).toBe('/menus/:menuId');
    expect(ROUTES.MENUS.DETAIL('2')).toBe('/menus/2');
    expect(ROUTES.GAMES.DETAIL()).toBe('/games/:gameId');
    expect(ROUTES.GAMES.DETAIL('3')).toBe('/games/3');
    expect(ROUTES.MANAGE_MISSIONS.DETAIL()).toBe('/manage-missions/:missionId');
    expect(ROUTES.MANAGE_MISSIONS.DETAIL('4')).toBe('/manage-missions/4');
    expect(ROUTES.MANAGE_RESERVE.DETAIL_PATH).toBe(
      '/manage-reserve/detail/:slotId',
    );
    expect(ROUTES.MANAGE_RESERVE.DETAIL('5')).toBe('/manage-reserve/detail/5');
    expect(ROUTES.MANAGE_RESERVE.DETAIL(6)).toBe('/manage-reserve/detail/6');
  });
});
