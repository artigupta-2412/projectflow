import { Navigate, Outlet } from 'react-router-dom'
import useAuthStore from '../../store/authStore'

export default function ProtectedRoute({ requiredRole }) {
  const { user } = useAuthStore()

  if (!user) return <Navigate to="/login" replace />
  if (requiredRole && user.role !== requiredRole) return <Navigate to="/dashboard" replace />

  return <Outlet />
}
