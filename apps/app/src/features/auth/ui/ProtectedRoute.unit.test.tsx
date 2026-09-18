import { ProtectedRoute, useAuthStore } from '@/features/auth';
import { ROUTES } from '@/constants/routes';
import { renderWithProviders, screen } from '@/shared/lib/testing/test-utils';
import { Route, Routes } from 'react-router-dom';

describe('features/auth ProtectedRoute (unit)', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      isLoggedIn: false,
      isLoading: false,
      error: null,
    });
  });

  it('redirects unauthenticated users to login', () => {
    renderWithProviders(
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<div>비밀 페이지</div>} />
        </Route>
        <Route path={ROUTES.LOGIN} element={<div>로그인 페이지</div>} />
      </Routes>,
      { route: '/' },
    );

    expect(screen.getByText('로그인 페이지')).toBeInTheDocument();
  });

  it('renders outlet for authenticated users', () => {
    useAuthStore.setState({
      isLoggedIn: true,
      user: { id: 1 } as never,
    });

    renderWithProviders(
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<div>비밀 페이지</div>} />
        </Route>
        <Route path={ROUTES.LOGIN} element={<div>로그인 페이지</div>} />
      </Routes>,
      { route: '/' },
    );

    expect(screen.getByText('비밀 페이지')).toBeInTheDocument();
  });
});
