export const ROUTES = {
  ROOT: '/',
  STORES: {
    ROOT: '/stores',
    DETAIL: (storeId: string = ':storeId') =>
      `${ROUTES.STORES.ROOT}/${storeId}`,
  },
  MANAGE_MENUS: {
    ROOT: '/manage-menus',
    DETAIL: (menuId: string = ':menuId') =>
      `${ROUTES.MANAGE_MENUS.ROOT}/${menuId}`,
  },
  MENUS: {
    ROOT: '/menus',
    DETAIL: (menuId: string = ':menuId') => `${ROUTES.MENUS.ROOT}/${menuId}`,
  },
  GAMES: {
    ROOT: '/games',
    DETAIL: (gameId: string = ':gameId') => `${ROUTES.GAMES.ROOT}/${gameId}`,
  },
  LOGIN: '/login',
  MANAGE_WAITING: '/manage-waiting',
  MANAGE_MISSIONS: {
    ROOT: '/manage-missions',
    DETAIL: (missionId: string = ':missionId') =>
      `${ROUTES.MANAGE_MISSIONS.ROOT}/${missionId}`,
  },
  MANAGE_QR: '/manage-qr',
  ORDER: '/order',
  HISTORY: '/history',
  STORE: '/store',
  WAITING: '/waiting',
  MENU_BOARD: '/board',
  LOVE_ALARM: '/alarm',
  NOT_FOUND: '/not-found',
  ORDERING: '/ordering',
} as const;
