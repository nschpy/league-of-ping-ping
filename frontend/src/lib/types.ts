import type { AuthUser } from '@/stores/auth'

export interface AuthResponse {
  token: string
  user: AuthUser
}
