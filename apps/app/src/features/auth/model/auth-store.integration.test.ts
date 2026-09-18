import MockAdapter from 'axios-mock-adapter';
import { KEYS } from '@/constants/storage';
import { useAuthStore } from '@/features/auth';
import axiosInstance from '@/shared/api/instance';
import { toast } from 'react-hot-toast';

jest.mock('react-hot-toast', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

describe('features/auth model store (unit + integration)', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(axiosInstance);
    useAuthStore.setState({
      user: null,
      isLoggedIn: false,
      isLoading: false,
      error: null,
    });
  });

  afterEach(() => {
    mock.restore();
  });

  it('logs out and clears token', () => {
    sessionStorage.setItem(KEYS.ACCESS_TOKEN, 'token');
    useAuthStore.setState({
      user: { id: 1 } as never,
      isLoggedIn: true,
    });

    useAuthStore.getState().logout();

    expect(sessionStorage.getItem(KEYS.ACCESS_TOKEN)).toBeNull();
    expect(useAuthStore.getState().isLoggedIn).toBe(false);
    expect(useAuthStore.getState().user).toBeNull();
  });

  it('checkAuthStatus throws without token', async () => {
    await expect(useAuthStore.getState().checkAuthStatus()).rejects.toThrow(
      'No access token found',
    );
    expect(useAuthStore.getState().isLoggedIn).toBe(false);
  });

  it('checkAuthStatus hydrates user from store API', async () => {
    sessionStorage.setItem(KEYS.ACCESS_TOKEN, 'token');
    mock.onGet('/stores/me/info').reply(200, { id: 7, name: '부스' });

    const user = await useAuthStore.getState().checkAuthStatus();

    expect(user).toEqual({ id: 7, name: '부스' });
    expect(useAuthStore.getState().isLoggedIn).toBe(true);
  });

  it('checkAuthStatus clears session on invalid payload', async () => {
    sessionStorage.setItem(KEYS.ACCESS_TOKEN, 'token');
    mock.onGet('/stores/me/info').reply(200, { name: 'no-id' });

    await expect(useAuthStore.getState().checkAuthStatus()).rejects.toThrow(
      'Invalid store data',
    );
    expect(sessionStorage.getItem(KEYS.ACCESS_TOKEN)).toBeNull();
    expect(useAuthStore.getState().isLoggedIn).toBe(false);
  });

  it('login succeeds and syncs auth status', async () => {
    mock.onPost('/auth/login').reply(200, { accessToken: 'access-1' });
    mock.onGet('/stores/me/info').reply(200, { id: 3, name: 'Store' });

    const ok = await useAuthStore.getState().login('ABCD');

    expect(ok).toBe(true);
    expect(sessionStorage.getItem(KEYS.ACCESS_TOKEN)).toBe('access-1');
    expect(useAuthStore.getState().isLoggedIn).toBe(true);
    expect(toast.success).toHaveBeenCalled();
  });

  it('login fails when accessToken is missing', async () => {
    mock.onPost('/auth/login').reply(200, {});

    const ok = await useAuthStore.getState().login('BAD');

    expect(ok).toBe(false);
    expect(useAuthStore.getState().isLoggedIn).toBe(false);
    expect(toast.error).toHaveBeenCalled();
  });

  it('login rolls back token when store sync fails', async () => {
    mock.onPost('/auth/login').reply(200, { accessToken: 'access-2' });
    mock.onGet('/stores/me/info').reply(500);

    const ok = await useAuthStore.getState().login('CODE');

    expect(ok).toBe(false);
    expect(sessionStorage.getItem(KEYS.ACCESS_TOKEN)).toBeNull();
    expect(useAuthStore.getState().isLoggedIn).toBe(false);
  });
});
