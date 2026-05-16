import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { fetchMyProfile, fetchProfile } from '@/lib/profile-api'
import type { ProfileResult } from '@/lib/types/profile'

type FetchState = { data: ProfileResult | null; loading: boolean; error: string | null }

const INITIAL: FetchState = { data: null, loading: true, error: null }

export function useProfileData(): FetchState & { refetch: () => void } {
  const { id } = useParams<{ id?: string }>()
  const [tick, setTick] = useState(0)
  const [state, setState] = useState<FetchState>(INITIAL)

  const refetch = useCallback(() => {
    setState(s => ({ ...s, loading: true, error: null }))
    setTick(t => t + 1)
  }, [])

  useEffect(() => {
    let cancelled = false
    const req = id ? fetchProfile(id) : fetchMyProfile()

    req
      .then(result => {
        if (!cancelled) setState({ data: result, loading: false, error: null })
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : 'Unknown error'
          setState({ data: null, loading: false, error: message })
        }
      })

    return () => {
      cancelled = true
    }
  }, [id, tick])

  return { ...state, refetch }
}
