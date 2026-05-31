export const LOG_ACTIONS = {
  // Drop-off
  DROPOFF_REMIT: 'customer.ordering.dropoff.remit',
  DROPOFF_DEPOSITOR: 'customer.ordering.dropoff.depositor',

  // Portal Click
  PORTAL_WAITING: 'customer.portal.click.waiting',
  PORTAL_RESERVATION: 'customer.portal.click.reservation',
  PORTAL_TAKEOUT: 'customer.portal.click.takeout',
  PORTAL_SCHEDULE: 'customer.portal.click.festival-schedule',
  PORTAL_RANKING: 'customer.portal.click.pub-ranking',
  PORTAL_PREVIEW: 'customer.portal.click.preview',
  PORTAL_BLIND_DATE: 'customer.portal.click.blind-date',

  // Board Click
  BOARD_BLIND_DATE: 'customer.board.click.blindDate',

  // Admin Management Click
  ADMIN_BOOTH_INFO: 'admin.management.click.boothInfo',
  ADMIN_WAITING: 'admin.management.click.waiting',
  ADMIN_RESERVATION: 'admin.management.click.reservation',
  ADMIN_QR: 'admin.management.click.qr',
  ADMIN_MISSION: 'admin.management.click.mission',
  ADMIN_COUPON: 'admin.management.click.coupon',
} as const;

export type SupportedLanguage = 'ko' | 'en' | 'zh' | 'ja';
export type LanguageChangeAction =
  `customer.board.change.language.${SupportedLanguage}`;

export type StaticLogAction = (typeof LOG_ACTIONS)[keyof typeof LOG_ACTIONS];
export type LogActionType = StaticLogAction | LanguageChangeAction;

export interface LogPayload {
  identifier: string;
  action: LogActionType;
  storeId?: number;
}
