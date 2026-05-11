import { useState, useEffect } from 'react'

export function useDebouncedQuery<T>(
  fetcher: ((query: string) => Promise<T>) | null,
  query: string,
  delay = 300,
): { data: T | null; loading: boolean; error: string | null } {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!fetcher || query.length < 2) {
      setData(null)
      setLoading(false)
      return
    }
    setLoading(true)
    const timer = setTimeout(async () => {
      try {
        const result = await fetcher(query)
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
  }, [query, delay]) // eslint-disable-line react-hooks/exhaustive-deps

  return { data, loading, error }
}
