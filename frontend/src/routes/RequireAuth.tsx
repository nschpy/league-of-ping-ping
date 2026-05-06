import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/core/auth/auth-context';

export function RequireAuth() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="grid place-items-center min-h-screen text-fg-3 font-mono text-xs tracking-widest uppercase">
        Loading…
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
}
