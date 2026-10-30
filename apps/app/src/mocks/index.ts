import { KEYS } from '@/constants/storage';
import axiosInstance from '@/shared/api/instance';
import { encodeAccessPayload } from '@/shared/lib/crypto';
import { MOCK_STORE_ID, MOCK_TABLE_ID } from './db';
import { registerMockHandlers } from './handlers';

/**
 * Dev-only: route every axiosInstance request to in-memory fixtures and
 * pre-seed a booth session so protected admin routes open without a login.
 * Loaded from main.tsx only when VITE_USE_MOCK=true in dev.
 */
export function setupMockApi() {
  registerMockHandlers(axiosInstance);

  if (!sessionStorage.getItem(KEYS.ACCESS_TOKEN)) {
    sessionStorage.setItem(KEYS.ACCESS_TOKEN, 'mock-token');
  }

  const origin = window.location.origin;
  const tableLink = encodeAccessPayload({
    userId: String(MOCK_STORE_ID),
    tableId: MOCK_TABLE_ID,
  });
  const portalLink = encodeAccessPayload({ userId: String(MOCK_STORE_ID) });

  console.info(
    [
      '[mock api] 목업 모드 — 실제 API/소켓에 연결하지 않습니다.',
      `  부스(관리자): ${origin}/order`,
      `  손님(테이블 ${MOCK_TABLE_ID} 메뉴판): ${origin}/check/${tableLink}`,
      `  손님(부스 포털): ${origin}/check/${portalLink}`,
    ].join('\n'),
  );
}
