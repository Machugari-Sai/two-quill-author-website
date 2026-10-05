import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'

export function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()
  if (loading) return <div className="auth-loading" role="status">Checking your account…</div>
  if (!isAuthenticated) return <Navigate replace to={`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`} />
  return <Outlet />
}
