import { useLogs } from '@/hooks/common/useLogs';
import { LogActionType } from '@/types/log';
import { useEffect } from 'react';

export function useGlobalLogger() {
  const { sendLog } = useLogs();

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      const logElement = target.closest(
        '[data-log-action]',
      ) as HTMLElement | null;

      if (logElement) {
        const action = logElement.dataset.logAction as LogActionType;
        const storeId = logElement.dataset.logStoreId;

        if (action) {
          sendLog(action, storeId ? Number(storeId) : undefined);
        }
      }
    };

    document.addEventListener('click', handleGlobalClick, true);

    return () => {
      document.removeEventListener('click', handleGlobalClick, true);
    };
  }, [sendLog]);
}
