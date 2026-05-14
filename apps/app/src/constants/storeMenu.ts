import { ROUTES } from '@/constants/routes';

export interface StoreMenuConfig {
  id: string;
  label: string;
  route: string;
}

export const STORE_MANAGEMENT_MENUS: StoreMenuConfig[] = [
  {
    id: 'waiting',
    label: '웨이팅 관리',
    route: ROUTES.MANAGE_WAITING_SETTING,
  },
  {
    id: 'reserve',
    label: '예약 관리',
    route: ROUTES.MANAGE_RESERVE.ROOT,
  },
  {
    id: 'qr',
    label: 'QR 관리',
    route: ROUTES.MANAGE_QR,
  },
  {
    id: 'mission',
    label: '미션 관리',
    route: ROUTES.MANAGE_MISSIONS.ROOT,
  },
  {
    id: 'coupon',
    label: '쿠폰 관리',
    route: ROUTES.COUPON,
  },
];
