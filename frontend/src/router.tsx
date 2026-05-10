import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ProtectedRoute } from '@/components/ProtectedRoute'

// Lazy placeholders — Task C will replace these with real components
const LoginPage = () => <div>Login page — Task C</div>
const RegisterPage = () => <div>Register page — Task C</div>
const DashboardPage = () => <div>Dashboard — Task C</div>

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
    ],
  },
  {
    path: '*',
    element: <div style={{ padding: '2rem', color: '#fff' }}>404 — страница не найдена</div>,
  },
])
