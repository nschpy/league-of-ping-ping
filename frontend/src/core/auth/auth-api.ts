import { apiFetch } from '@/lib/api';
import type { AuthResponse, SignInInput, SignUpInput, User } from './auth-types';

export function signInRequest(body: SignInInput): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/auth/signin', {
    method: 'POST',
    body: JSON.stringify(body),
    auth: false,
  });
}

export function signUpRequest(body: SignUpInput): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(body),
    auth: false,
  });
}

export function meRequest(): Promise<User> {
  return apiFetch<User>('/auth/me');
}
