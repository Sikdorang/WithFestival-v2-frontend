import MockAdapter from 'axios-mock-adapter';
import { storeAPI } from '@/apis/store';
import axiosInstance from '@/shared/api/instance';

describe('apis/store remaining endpoints (integration)', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(axiosInstance);
  });

  afterEach(() => {
    mock.restore();
  });

  it('patches notice, event, reservation and missions flags', async () => {
    mock.onPatch('/stores/notice', { notice: '공지' }).reply(200, { ok: true });
    mock.onPatch('/stores/event', { event: '이벤트' }).reply(200, { ok: true });
    mock
      .onPatch('/stores/reservation-enabled', { reservationEnabled: false })
      .reply(200, { ok: true });
    mock
      .onPatch('/stores/missions-enabled', { missionsEnabled: true })
      .reply(200, { ok: true });

    await expect(storeAPI.updateStoreNotice('공지')).resolves.toEqual({
      ok: true,
    });
    await expect(storeAPI.updateStoreEvent('이벤트')).resolves.toEqual({
      ok: true,
    });
    await expect(
      storeAPI.updateStoreReservationEnabled(false),
    ).resolves.toEqual({ ok: true });
    await expect(storeAPI.updateStoreMissionsEnabled(true)).resolves.toEqual({
      ok: true,
    });
  });
});
