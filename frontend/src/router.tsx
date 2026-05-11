import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { AuthLayout } from '@/pages/auth/AuthLayout'
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { DashboardPage } from '@/pages/dashboard/DashboardPage'
import { AppShell } from '@/components/layout/AppShell'
import { CreateGamePage } from '@/pages/games/CreateGamePage'

// Temporary placeholder — will be replaced in Task G
const GameViewPage = () => <div className="p-8 text-foreground">Game View — coming soon</div>

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
    ],
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          { index: true, element: <Navigate to="/dashboard" replace /> },
          { path: 'dashboard', element: <DashboardPage /> },
          { path: 'games/new', element: <CreateGamePage /> },
          { path: 'games/:id', element: <GameViewPage /> },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <div style={{ padding: '2rem', color: '#fff', fontFamily: 'Inter' }}>404 — страница не найдена</div>,
  },
])
