import MockAdapter from 'axios-mock-adapter';
import { authAPI } from '@/features/auth';
import axiosInstance from '@/shared/api/instance';

describe('features/auth api (integration)', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(axiosInstance);
  });

  afterEach(() => {
    mock.restore();
  });

  it('posts login code and fetches me', async () => {
    mock
      .onPost('/auth/login', { authCode: 'XYZ' })
      .reply(200, { accessToken: 't' });
    mock.onGet('/auth/userId').reply(200, { userId: 1 });

    await expect(authAPI.login('XYZ')).resolves.toEqual({ accessToken: 't' });
    await expect(authAPI.me()).resolves.toEqual({ userId: 1 });
  });
});
