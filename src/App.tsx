import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from '@/pages/Dashboard'
import Login from '@/pages/Login'
import Landing from '@/pages/Landing'
import Admin from '@/pages/Admin'
import Profile from '@/pages/Profile'
import { ProtectedRoute, AdminRoute } from '@/components/ProtectedRoute'
import { useAuth } from '@/store/useAuth'

export default function App() {
  const isAuthenticated = useAuth((state) => state.isAuthenticated)

  return (
    <BrowserRouter>
      <Routes>
        {/* Landing page — public */}
        <Route path="/" element={<Landing />} />

        {/* Login — redirect to /app if already logged in */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/app" replace /> : <Login />}
        />

        {/* Protected dashboard and profile */}
        <Route element={<ProtectedRoute />}>
          <Route path="/app" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Admin Dashboard */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<Admin />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
