import { useAuthStore } from '@/stores/authStore';
import { Navigate, Outlet } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

export function ProtectedRoute() {
  const { isLoggedIn, user } = useAuthStore();

  if (!isLoggedIn || !user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <Outlet />;
}
