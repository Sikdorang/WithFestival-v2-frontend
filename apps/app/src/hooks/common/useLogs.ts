import { LogActionType, LogPayload } from '@/types/log';
import { getOrCreateDeviceId } from '@/utils/deviceId';
import { useCallback, useRef } from 'react';

const THROTTLE_MS = 1000;

export const useLogs = () => {
  const lastLogTimeRef = useRef<Map<string, number>>(new Map());

  const sendLog = useCallback((action: LogActionType, storeId?: number) => {
    try {
      const now = Date.now();
      const logKey = `${action}_${storeId || 'global'}`;
      const lastTime = lastLogTimeRef.current.get(logKey) || 0;

      if (now - lastTime < THROTTLE_MS) {
        console.warn(`[Telemetry] Blocked duplicate log: ${logKey}`);
        return;
      }

      lastLogTimeRef.current.set(logKey, now);

      const identifier = getOrCreateDeviceId();
      const payload: LogPayload = { identifier, action, storeId };
      const stringifiedData = JSON.stringify(payload);

      const LOG_API_URL = '/api/logs';

      if (navigator.sendBeacon) {
        const blob = new Blob([stringifiedData], { type: 'application/json' });
        const isQueued = navigator.sendBeacon(LOG_API_URL, blob);

        if (isQueued) return;
      }

      fetch(LOG_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: stringifiedData,
        keepalive: true,
      }).catch((err) => console.error('Fallback Telemetry Error:', err));
    } catch (error) {
      console.error(`Telemetry Error (${action}):`, error);
    }
  }, []);

  // 하위 래핑 함수
  const sendBoothPortalClickLog = useCallback(
    (linkId: string, storeId?: number) => {
      sendLog(`customer.portal.click.${linkId}` as LogActionType, storeId);
    },
    [sendLog],
  );

  const sendAdminSettingsClickLog = useCallback(
    (menuId: string, storeId?: number) => {
      sendLog(`admin.management.click.${menuId}` as LogActionType, storeId);
    },
    [sendLog],
  );

  return { sendLog, sendBoothPortalClickLog, sendAdminSettingsClickLog };
};
