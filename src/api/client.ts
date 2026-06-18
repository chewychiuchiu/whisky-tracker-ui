const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8080'

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || 'API error')
  }
  return res.json()
}