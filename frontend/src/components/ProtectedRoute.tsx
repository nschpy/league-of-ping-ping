import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

export function ProtectedRoute() {
  const { token, _hasHydrated } = useAuth()
  if (!_hasHydrated) return null
  if (!token) return <Navigate to="/login" replace />
  return <Outlet />
}
