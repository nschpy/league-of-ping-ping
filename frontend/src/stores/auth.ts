import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface AuthUser {
  id: string
  email: string
  nickname: string
  mmr: number
  role: string
}

interface AuthState {
  token: string | null
  user: AuthUser | null
  setAuth: (token: string, user: AuthUser) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: (token, user) => {
        localStorage.setItem('auth-token', token)
        set({ token, user })
      },
      logout: () => {
        localStorage.removeItem('auth-token')
        set({ token: null, user: null })
      },
    }),
    { name: 'auth-storage' },
  ),
)
