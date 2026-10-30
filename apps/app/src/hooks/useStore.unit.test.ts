import { useStore } from '@/hooks/useStore';
import { renderHook } from '@testing-library/react';

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
});
