import { storeAPI } from '@/apis/store';
import { useStore } from '@/hooks/useStore';
import { act, renderHook } from '@testing-library/react';

jest.mock('@/apis/store', () => ({
  storeAPI: { updateStoreNotice: jest.fn() },
}));

const updateStoreNotice = storeAPI.updateStoreNotice as jest.Mock;

describe('hooks/useStore (unit)', () => {
  // Pages list these fetchers as effect deps; a new reference per render
  // re-fires the effect forever (React error #185).
  it('keeps fetcher references stable across renders', () => {
    const { result, rerender } = renderHook(() => useStore());
    const { getMyStoreInfo, getStorePublicInfo } = result.current;

    rerender();

    expect(result.current.getMyStoreInfo).toBe(getMyStoreInfo);
    expect(result.current.getStorePublicInfo).toBe(getStorePublicInfo);
  });

  it('shows the new notice before the slow save finishes', async () => {
    let finish!: () => void;
    updateStoreNotice.mockReturnValue(
      new Promise<void>((resolve) => {
        finish = resolve;
      }),
    );
    const { result } = renderHook(() => useStore());

    let saving!: Promise<boolean>;
    act(() => {
      saving = result.current.updateStoreNotice('새 공지');
    });
    expect(result.current.notice).toBe('새 공지');

    await act(async () => {
      finish();
      await expect(saving).resolves.toBe(true);
    });
    expect(result.current.notice).toBe('새 공지');
  });

  it('rolls the notice back when the save fails', async () => {
    updateStoreNotice.mockRejectedValue(new Error('network'));
    const { result } = renderHook(() => useStore());

    await act(async () => {
      await expect(result.current.updateStoreNotice('새 공지')).resolves.toBe(
        false,
      );
    });
    expect(result.current.notice).toBe('');
  });
});
