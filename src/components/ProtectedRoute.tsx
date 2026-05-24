import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/store/useAuth'

export function ProtectedRoute() {
  const isAuthenticated = useAuth((state) => state.isAuthenticated)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export function AdminRoute() {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/app" replace />
  }

  return <Outlet />
}
