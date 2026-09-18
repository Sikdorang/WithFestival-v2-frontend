import axiosInstance from '@/shared/api/instance';
import axios from 'axios';
import { KEYS } from '@/constants/storage';
import { redirectTo } from '@/shared/lib/navigation';

jest.mock('@/shared/lib/navigation', () => ({
  redirectTo: jest.fn(),
}));

describe('shared/api/instance request interceptor (unit)', () => {
  it('rejects request interceptor errors', async () => {
    const interceptorManager = axiosInstance.interceptors.request as unknown as {
      handlers: Array<{
        fulfilled?: unknown;
        rejected?: (error: unknown) => Promise<unknown>;
      } | null>;
    };

    const rejected = interceptorManager.handlers
      .filter(Boolean)
      .map((h) => h!.rejected)
      .find(Boolean);

    expect(rejected).toEqual(expect.any(Function));
    const error = new Error('network');
    await expect(rejected!(error)).rejects.toBe(error);
  });

  it('response interceptor ignores non-axios errors and missing urls', async () => {
    const interceptorManager = axiosInstance.interceptors
      .response as unknown as {
      handlers: Array<{
        rejected?: (error: unknown) => Promise<unknown>;
      } | null>;
    };

    const rejected = interceptorManager.handlers
      .filter(Boolean)
      .map((h) => h!.rejected)
      .find(Boolean);

    const plain = new Error('plain');
    await expect(rejected!(plain)).rejects.toBe(plain);

    const axiosError = new axios.AxiosError('no config');
    axiosError.response = {
      status: 401,
      data: {},
      statusText: 'Unauthorized',
      headers: {},
      config: { headers: {} as never },
    };
    // no config / url → still treats as 401 redirect path
    sessionStorage.setItem(KEYS.ACCESS_TOKEN, 't');
    await expect(rejected!(axiosError)).rejects.toBe(axiosError);
    expect(sessionStorage.getItem(KEYS.ACCESS_TOKEN)).toBeNull();
    expect(redirectTo).toHaveBeenCalled();
  });
});
