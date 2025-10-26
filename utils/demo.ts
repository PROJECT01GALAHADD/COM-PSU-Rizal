export function isDemoMode(): boolean {
  try {
    if (typeof window === 'undefined') return false
    const raw = localStorage.getItem('com_demo_auth_v1')
    return !!raw
  } catch {
    return false
  }
}

export function getDemoUserSafe<T = any>(): T | null {
  try {
    if (typeof window === 'undefined') return null
    const raw = localStorage.getItem('com_demo_auth_v1')
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}