import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiError } from '@/lib/api';
import { clearAuth, getStoredUser, getToken, setStoredUser, setToken } from '@/lib/auth-storage';
import { meRequest, signInRequest, signUpRequest } from './auth-api';
import type { SignInInput, SignUpInput, User } from './auth-types';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
}

interface AuthContextValue extends AuthState {
  signIn: (input: SignInInput) => Promise<void>;
  signUp: (input: SignUpInput) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [state, setState] = useState<AuthState>({
    user: getStoredUser<User>(),
    token: getToken(),
    loading: !!getToken(),
  });

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    let ignore = false;
    meRequest()
      .then((user) => { if (!ignore) setState({ user, token, loading: false }); })
      .catch((err) => {
        if (ignore) return;
        if (err instanceof ApiError && err.status === 401) { clearAuth(); navigate('/auth', { replace: true }); }
        setState((s) => ({ ...s, loading: false }));
      });
    return () => { ignore = true; };
  }, [navigate]);

  async function signIn(input: SignInInput) {
    const { token, user } = await signInRequest(input);
    setToken(token);
    setStoredUser(user);
    setState({ user, token, loading: false });
  }

  async function signUp(input: SignUpInput) {
    const { token, user } = await signUpRequest(input);
    setToken(token);
    setStoredUser(user);
    setState({ user, token, loading: false });
  }

  function signOut() {
    clearAuth();
    setState({ user: null, token: null, loading: false });
    navigate('/auth', { replace: true });
  }

  return (
    <AuthContext.Provider value={{ ...state, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
