import { authLoader, useAuthStore } from '@/features/auth';
import { redirect } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  redirect: jest.fn((to: string) => ({ type: 'redirect', to })),
}));

describe('features/auth authLoader (integration)', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      isLoggedIn: false,
      isLoading: false,
      error: null,
    });
    (redirect as jest.Mock).mockClear();
  });

  it('returns user when auth check succeeds', async () => {
    const user = { id: 1, name: 'Store' };
    useAuthStore.setState({
      checkAuthStatus: jest.fn().mockResolvedValue(user),
    } as never);

    await expect(authLoader()).resolves.toEqual(user);
    expect(redirect).not.toHaveBeenCalled();
  });

  it('redirects to login when auth check fails', async () => {
    useAuthStore.setState({
      checkAuthStatus: jest.fn().mockRejectedValue(new Error('no token')),
    } as never);

    const result = await authLoader();

    expect(redirect).toHaveBeenCalledWith('/login');
    expect(result).toEqual({ type: 'redirect', to: '/login' });
  });
});
