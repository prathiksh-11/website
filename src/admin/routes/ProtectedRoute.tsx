import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { PageSkeleton } from '@/components/common';
import { usePermissions } from '@/hooks/usePermissions';
import { useAuthHydration } from '@/hooks/useAuthHydration';
import { useAuthStore } from '@/store/auth.store';

interface ProtectedRouteProps {
  permission?: string;
}

export const ProtectedRoute = ({ permission }: ProtectedRouteProps) => {
  const hydrated = useAuthHydration();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const location = useLocation();
  const { canAccess } = usePermissions();

  if (!hydrated) {
    return <PageSkeleton variant="dashboard" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (permission && !canAccess(permission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};
