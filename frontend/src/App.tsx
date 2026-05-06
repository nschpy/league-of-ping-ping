import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '@/core/auth/auth-context';
import { AuthPage } from '@/pages/auth/AuthPage';
import { DashboardPlaceholder } from '@/pages/dashboard/DashboardPage';
import { RedirectIfAuthed } from './routes/RedirectIfAuthed';
import { RequireAuth } from './routes/RequireAuth';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<RedirectIfAuthed />}>
          <Route path="/auth" element={<AuthPage />} />
        </Route>
        <Route element={<RequireAuth />}>
          <Route path="/dashboard" element={<DashboardPlaceholder />} />
        </Route>
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    </AuthProvider>
  );
}
