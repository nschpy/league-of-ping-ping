import { useState, useEffect, useRef } from 'react'

export function useDebouncedQuery<T>(
  fetcher: ((query: string) => Promise<T>) | null,
  query: string,
  delay = 300,
): { data: T | null; loading: boolean; error: string | null } {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fetcherRef = useRef(fetcher)
  fetcherRef.current = fetcher

  useEffect(() => {
    if (!fetcherRef.current || query.length < 2) {
      setData(null)
      setLoading(false)
      return
    }
    setLoading(true)
    const timer = setTimeout(async () => {
      if (!fetcherRef.current) return
      try {
        const result = await fetcherRef.current(query)
        setData(result)
        setError(null)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Ошибка загрузки')
        setData(null)
      } finally {
        setLoading(false)
      }
    }, delay)
    return () => clearTimeout(timer)
  }, [query, delay])

  return { data, loading, error }
}
