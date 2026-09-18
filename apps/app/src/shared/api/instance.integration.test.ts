import MockAdapter from 'axios-mock-adapter';
import { KEYS } from '@/constants/storage';
import { ROUTES } from '@/constants/routes';
import { redirectTo } from '@/shared/lib/navigation';
import axiosInstance from '@/shared/api/instance';

jest.mock('@/shared/lib/navigation', () => ({
  redirectTo: jest.fn(),
}));

describe('shared/api/instance (integration)', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(axiosInstance);
    (redirectTo as jest.Mock).mockClear();
  });

  afterEach(() => {
    mock.restore();
  });

  it('attaches Bearer token from sessionStorage', async () => {
    sessionStorage.setItem(KEYS.ACCESS_TOKEN, 'token-123');

    mock.onGet('/stores/me/info').reply((config) => {
      expect(config.headers?.Authorization).toBe('Bearer token-123');
      return [200, { id: 1 }];
    });

    const response = await axiosInstance.get('/stores/me/info');
    expect(response.data).toEqual({ id: 1 });
  });

  it('redirects to login and clears token on 401', async () => {
    sessionStorage.setItem(KEYS.ACCESS_TOKEN, 'expired');

    mock.onGet('/orders').reply(401, { message: 'unauthorized' });

    await expect(axiosInstance.get('/orders')).rejects.toMatchObject({
      response: { status: 401 },
    });

    expect(sessionStorage.getItem(KEYS.ACCESS_TOKEN)).toBeNull();
    expect(redirectTo).toHaveBeenCalledWith(ROUTES.LOGIN);
  });

  it('does not redirect on login 401', async () => {
    sessionStorage.setItem(KEYS.ACCESS_TOKEN, 'temp');

    mock.onPost('/auth/login').reply(401, { message: 'invalid' });

    await expect(
      axiosInstance.post('/auth/login', { authCode: 'bad' }),
    ).rejects.toMatchObject({ response: { status: 401 } });

    expect(sessionStorage.getItem(KEYS.ACCESS_TOKEN)).toBe('temp');
    expect(redirectTo).not.toHaveBeenCalled();
  });
});
