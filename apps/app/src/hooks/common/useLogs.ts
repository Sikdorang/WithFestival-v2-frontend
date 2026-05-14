import { createLog } from '@/apis/common/logs';
import { getOrCreateDeviceId } from '@/utils/deviceId';
import { useCallback } from 'react';

export type AdminMenuId =
  | 'boothInfo'
  | 'waiting'
  | 'reservation'
  | 'qr'
  | 'mission'
  | 'coupon';

export const useLogs = () => {
  const sendLog = useCallback(async (action: string, storeId?: number) => {
    try {
      const identifier = getOrCreateDeviceId();
      await createLog({ identifier, action, storeId });
    } catch (error) {
      console.error(`Telemetry Error (${action}):`, error);
    }
  }, []);

  const sendBoothPortalClickLog = useCallback(
    (linkId: string, storeId?: number) => {
      sendLog(`customer.portal.click.${linkId}`, storeId);
    },
    [sendLog],
  );

  const sendAdminSettingsClickLog = useCallback(
    (menuId: AdminMenuId, storeId?: number) => {
      sendLog(`admin.management.click.${menuId}`, storeId);
    },
    [sendLog],
  );

  return { sendLog, sendBoothPortalClickLog, sendAdminSettingsClickLog };
};
