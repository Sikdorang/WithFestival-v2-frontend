import MockAdapter from 'axios-mock-adapter';
import { waitingAPI } from '@/entities/waiting';
import axiosInstance from '@/shared/api/instance';

describe('entities/waiting api (integration)', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(axiosInstance);
  });

  afterEach(() => {
    mock.restore();
  });

  it('reads active waiting count', async () => {
    mock.onGet('/stores/3/waitings/active-count').reply(200, { count: 4 });

    await expect(waitingAPI.getActiveWaitingCount(3)).resolves.toEqual({
      count: 4,
    });
  });

  it('creates waiting and updates status', async () => {
    const payload = {
      name: '이몽룡',
      phoneNumber: '010-1111-2222',
      partySize: 2,
    };

    mock.onPost('/stores/3/waitings').reply((config) => {
      expect(
        config.headers?.['Idempotency-Key'] || config.headers?.['idempotency-key'],
      ).toBeTruthy();
      expect(JSON.parse(config.data)).toEqual(payload);
      return [201, { id: 10 }];
    });
    mock
      .onPatch('/waitings/10', { status: 'ENTERED' })
      .reply(200, { status: 'ENTERED' });
    mock.onGet('/waitings').reply(200, { data: [{ id: 10 }] });

    await expect(
      waitingAPI.createWaiting(3, payload, { idempotencyKey: 'waiting_test' }),
    ).resolves.toEqual({
      id: 10,
    });
    await expect(
      waitingAPI.updateWaitingStatus(10, { status: 'ENTERED' }),
    ).resolves.toEqual({ status: 'ENTERED' });
    await expect(waitingAPI.getWaitings()).resolves.toEqual({
      data: [{ id: 10 }],
    });
  });
});
