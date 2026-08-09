import { Navigate, Outlet } from 'react-router-dom';
import { AppLoader } from '@/components/common';
import { useAuthHydration } from '@/hooks/useAuthHydration';
import { useAuthStore } from '@/store/auth.store';

export const PublicRoute = () => {
  const hydrated = useAuthHydration();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (!hydrated) {
    return <AppLoader tip="Loading..." />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
