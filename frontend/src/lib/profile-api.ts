import { api } from '@/lib/api'
import type { ProfileResult, PatchMeRequest, PatchMeResponse } from '@/lib/types/profile'

export function fetchMyProfile(): Promise<ProfileResult> {
  return api.get<ProfileResult>('/users/me/profile')
}

export function fetchProfile(id: string): Promise<ProfileResult> {
  return api.get<ProfileResult>(`/users/${id}/profile`)
}

export function patchMe(body: PatchMeRequest): Promise<PatchMeResponse> {
  return api.patch<PatchMeResponse>('/users/me', body)
}
