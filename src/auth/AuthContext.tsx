import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

export type AuthUser = { id: string; name: string; email: string; role: string; createdAt?: string; updatedAt?: string }
type Credentials = { email: string; password: string; remember?: boolean }
type Registration = Credentials & { name: string }
type AuthContextValue = { user: AuthUser | null; loading: boolean; isAuthenticated: boolean; login: (data: Credentials) => Promise<AuthUser>; register: (data: Registration) => Promise<AuthUser>; logout: () => Promise<void> }

const AuthContext = createContext<AuthContextValue | null>(null)
const configuredApiUrl = import.meta.env.VITE_API_URL || ''
const defaultProductionApiUrl = 'https://two-quill-author-website.onrender.com/api'
const apiBase = (configuredApiUrl && !configuredApiUrl.includes('YOUR-RENDER-URL')
  ? configuredApiUrl
  : import.meta.env.PROD
    ? defaultProductionApiUrl
    : '/api').replace(/\/$/, '')
const tokenKey = 'two-quill-access-token'
const getToken = () => localStorage.getItem(tokenKey) || sessionStorage.getItem(tokenKey)

async function request(path: string, options: RequestInit = {}) {
  const token = getToken()
  let response: Response
  try {
    response = await fetch(`${apiBase}${path}`, { ...options, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(options.headers || {}) } })
  } catch {
    throw new Error('The account service is not available. Please try again in a moment or contact support if the problem continues.')
  }
  const rawBody = await response.text()
  let payload: any = {}
  try { payload = rawBody ? JSON.parse(rawBody) : {} } catch { payload = {} }
  if (!response.ok) {
    const message = Array.isArray(payload.message) ? payload.message.join(' ') : payload.message || payload.error
    throw new Error(message || `The account service returned an unexpected response (${response.status}). Check that the NestJS backend is running.`)
  }
  return payload
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = getToken()
    if (!token) { setLoading(false); return }
    request('/auth/me').then((payload) => setUser(payload.user)).catch(() => { localStorage.removeItem(tokenKey); sessionStorage.removeItem(tokenKey) }).finally(() => setLoading(false))
  }, [])

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    isAuthenticated: Boolean(user),
    async login(data) {
      const payload = await request('/auth/login', { method: 'POST', body: JSON.stringify(data) })
      ;(data.remember ? localStorage : sessionStorage).setItem(tokenKey, payload.accessToken)
      setUser(payload.user)
      return payload.user
    },
    async register(data) {
      const payload = await request('/auth/register', { method: 'POST', body: JSON.stringify(data) })
      sessionStorage.setItem(tokenKey, payload.accessToken)
      setUser(payload.user)
      return payload.user
    },
    async logout() {
      try { await request('/auth/logout', { method: 'POST' }) } finally { localStorage.removeItem(tokenKey); sessionStorage.removeItem(tokenKey); setUser(null) }
    },
  }), [loading, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
