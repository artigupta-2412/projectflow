import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import useAuthStore from './store/authStore'
import { Spinner } from './components/ui'

import AppLayout         from './components/layout/AppLayout'
import ProtectedRoute    from './components/auth/ProtectedRoute'
import LoginPage         from './pages/LoginPage'
import SignupPage        from './pages/SignupPage'
import DashboardPage     from './pages/DashboardPage'
import ProjectsPage      from './pages/ProjectsPage'
import ProjectDetailPage from './pages/ProjectDetailPage'
import TasksPage         from './pages/TasksPage'
import ProfilePage       from './pages/ProfilePage'

export default function App() {
  const { initialize, initialized } = useAuthStore()

  useEffect(() => { initialize() }, [])

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <Spinner size={32} />
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login"  element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard"    element={<DashboardPage />} />
            <Route path="/projects"     element={<ProjectsPage />} />
            <Route path="/projects/:id" element={<ProjectDetailPage />} />
            <Route path="/tasks"        element={<TasksPage />} />
            <Route path="/profile"      element={<ProfilePage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
