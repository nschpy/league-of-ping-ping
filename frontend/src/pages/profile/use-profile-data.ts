import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { fetchMyProfile, fetchProfile } from '@/lib/profile-api'
import type { ProfileResult } from '@/lib/types/profile'

export function useProfileData(): {
  data: ProfileResult | null
  loading: boolean
  error: string | null
  refetch: () => void
} {
  const { id } = useParams<{ id?: string }>()
  const [data, setData] = useState<ProfileResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  const refetch = useCallback(() => {
    setTick(t => t + 1)
  }, [])

  useEffect(() => {
    let cancelled = false

    setLoading(true)
    setError(null)

    const req = id ? fetchProfile(id) : fetchMyProfile()

    req
      .then(result => {
        if (cancelled) return
        setData(result)
      })
      .catch((err: unknown) => {
        if (cancelled) return
        const message = err instanceof Error ? err.message : 'Unknown error'
        setError(message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [id, tick])

  return { data, loading, error, refetch }
}
