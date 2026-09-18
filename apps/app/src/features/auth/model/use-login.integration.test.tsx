import MockAdapter from 'axios-mock-adapter';
import { KEYS } from '@/constants/storage';
import { ROUTES } from '@/constants/routes';
import { useLogin } from '@/features/auth';
import axiosInstance from '@/shared/api/instance';
import { act, renderHook, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ReactNode } from 'react';
import { toast } from 'react-hot-toast';

const navigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => navigate,
}));

jest.mock('react-hot-toast', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

function wrapper({ children }: { children: ReactNode }) {
  return <MemoryRouter>{children}</MemoryRouter>;
}

describe('features/auth useLogin (integration)', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(axiosInstance);
    navigate.mockReset();
  });

  afterEach(() => {
    mock.restore();
  });

  it('stores token and navigates on success', async () => {
    mock.onPost('/auth/login').reply(200, { accessToken: 'login-token' });

    const { result } = renderHook(() => useLogin(), { wrapper });

    let ok = false;
    await act(async () => {
      ok = await result.current.login('CODE');
    });

    expect(ok).toBe(true);
    expect(sessionStorage.getItem(KEYS.ACCESS_TOKEN)).toBe('login-token');
    expect(navigate).toHaveBeenCalledWith(ROUTES.MANAGE_WAITING);
    expect(toast.success).toHaveBeenCalled();
    await waitFor(() => expect(result.current.isLoading).toBe(false));
  });

  it('returns false when token is missing', async () => {
    mock.onPost('/auth/login').reply(200, {});

    const { result } = renderHook(() => useLogin(), { wrapper });

    let ok = true;
    await act(async () => {
      ok = await result.current.login('BAD');
    });

    expect(ok).toBe(false);
    expect(navigate).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalled();
  });

  it('handles login API errors via handelError', async () => {
    mock.onPost('/auth/login').reply(500, { message: 'fail' });

    const { result } = renderHook(() => useLogin(), { wrapper });

    let ok = true;
    await act(async () => {
      ok = await result.current.login('ERR');
    });

    expect(ok).toBe(false);
    expect(toast.error).toHaveBeenCalled();
    await waitFor(() => expect(result.current.isLoading).toBe(false));
  });

  it('exposes loginError setters', () => {
    const { result } = renderHook(() => useLogin(), { wrapper });
    act(() => {
      result.current.setLoginError('x');
      result.current.setIsLoading(true);
    });
    expect(result.current.loginError).toBe('x');
    expect(result.current.isLoading).toBe(true);
  });
});
