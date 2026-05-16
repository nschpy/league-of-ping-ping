import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { AuthLayout } from '@/pages/auth/AuthLayout'
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { DashboardPage } from '@/pages/dashboard/DashboardPage'
import { AppShell } from '@/components/layout/AppShell'
import { CreateGamePage } from '@/pages/games/CreateGamePage'
import { GameViewPage } from '@/pages/games/GameViewPage'
import { MatchesPage } from '@/pages/matches/MatchesPage'
import { ProfilePage } from '@/pages/profile/ProfilePage'

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
          { path: 'matches', element: <MatchesPage /> },
          { path: 'profile', element: <ProfilePage /> },
          { path: 'profile/:id', element: <ProfilePage /> },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <div style={{ padding: '2rem', fontFamily: 'Inter' }}>404 — страница не найдена</div>,
  },
])
