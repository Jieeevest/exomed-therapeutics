import { useAuth } from '@/store/useAuth'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  let { accessToken, refreshToken, login, logout, user } = useAuth.getState()

  const headers = new Headers(options.headers)
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`)
  }

  const isFullUrl = endpoint.startsWith('http')
  const url = isFullUrl ? endpoint : `${API_URL}${endpoint}`

  let res = await fetch(url, { ...options, headers })

  // If unauthorized (token expired), try to refresh
  if (res.status === 401) {
    if (!refreshToken) {
      logout()
      window.location.href = '/login'
      return res
    }

    try {
      const refreshRes = await fetch(`${API_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      })

      const refreshData = await refreshRes.json()
      if (refreshData.success && refreshData.data.accessToken) {
        // Update store with new tokens
        login(refreshData.data.accessToken, refreshData.data.refreshToken, user!)
        
        // Retry original request with new token
        headers.set('Authorization', `Bearer ${refreshData.data.accessToken}`)
        res = await fetch(url, { ...options, headers })
      } else {
        // Refresh failed (e.g. revoked or expired refresh token)
        logout()
        window.location.href = '/login'
      }
    } catch {
      logout()
      window.location.href = '/login'
    }
  }

  return res
}
