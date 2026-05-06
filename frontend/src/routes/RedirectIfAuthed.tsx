import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/core/auth/auth-context';

export function RedirectIfAuthed() {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}
