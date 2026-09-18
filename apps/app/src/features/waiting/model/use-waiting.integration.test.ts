import MockAdapter from 'axios-mock-adapter';
import { useWaiting } from '@/features/waiting';
import axiosInstance from '@/shared/api/instance';
import { act, renderHook, waitFor } from '@testing-library/react';
import { toast } from 'react-hot-toast';

jest.mock('react-hot-toast', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

describe('features/waiting useWaiting (integration)', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(axiosInstance);
  });

  afterEach(() => {
    mock.restore();
  });

  it('fetches active waiting count', async () => {
    mock.onGet('/stores/4/waitings/active-count').reply(200, { count: 6 });

    const { result } = renderHook(() => useWaiting());

    let ok = false;
    await act(async () => {
      ok = Boolean(await result.current.fetchActiveWaitingCount(4));
    });

    expect(ok).toBe(true);
    await waitFor(() => expect(result.current.activeWaitingCount).toBe(6));
  });

  it('creates waiting and refreshes list on status update', async () => {
    mock.onPost('/stores/4/waitings').reply(201, {
      id: 20,
      name: '성춘향',
    });
    mock.onGet('/waitings').reply(200, {
      data: [{ id: 20, status: 'WAITING' }],
    });
    mock.onPatch('/waitings/20').reply(200, { ok: true });

    const { result } = renderHook(() => useWaiting());

    await act(async () => {
      await result.current.createWaiting(4, {
        name: '성춘향',
        phoneNumber: '010-3333-4444',
        partySize: 3,
      });
    });

    expect(toast.success).toHaveBeenCalled();

    await act(async () => {
      await result.current.updateWaitingStatus(20, 'ENTERED');
    });

    await waitFor(() =>
      expect(result.current.waitingList).toEqual([
        { id: 20, status: 'WAITING' },
      ]),
    );
  });

  it('returns false and toasts on API failures', async () => {
    mock.onGet('/stores/4/waitings/active-count').reply(500);
    mock.onGet('/waitings').reply(500);
    mock.onPost('/stores/4/waitings').reply(500);
    mock.onPatch('/waitings/1').reply(500);

    const { result } = renderHook(() => useWaiting());

    let countOk = true;
    let listOk = true;
    let createOk: unknown = true;
    let statusOk = true;

    await act(async () => {
      countOk = Boolean(await result.current.fetchActiveWaitingCount(4));
      listOk = Boolean(await result.current.fetchWaitings());
      createOk = await result.current.createWaiting(4, {
        name: 'x',
        phoneNumber: '010-0000-0000',
        partySize: 1,
      });
      statusOk = Boolean(await result.current.updateWaitingStatus(1, 'ENTERED'));
    });

    expect(countOk).toBe(false);
    expect(listOk).toBe(false);
    expect(createOk).toBe(false);
    expect(statusOk).toBe(false);
    expect(toast.error).toHaveBeenCalled();
  });

  it('toasts cancel success and accepts bare waiting list payloads', async () => {
    mock.onGet('/waitings').reply(200, [{ id: 1, status: 'WAITING' }]);
    mock.onPatch('/waitings/1').reply(200, { ok: true });

    const { result } = renderHook(() => useWaiting());

    await act(async () => {
      await result.current.fetchWaitings();
      await result.current.updateWaitingStatus(1, 'CANCELED');
    });

    await waitFor(() =>
      expect(result.current.waitingList).toEqual([
        { id: 1, status: 'WAITING' },
      ]),
    );
    expect(toast.success).toHaveBeenCalled();
  });

  it('updates status without special toast for other statuses', async () => {
    mock.onGet('/waitings').reply(200, { data: [] });
    mock.onPatch('/waitings/2').reply(200, { ok: true });

    const { result } = renderHook(() => useWaiting());

    await act(async () => {
      await result.current.updateWaitingStatus(2, 'WAITING');
    });

    expect(toast.success).not.toHaveBeenCalledWith('입장 처리되었습니다.');
  });
});
