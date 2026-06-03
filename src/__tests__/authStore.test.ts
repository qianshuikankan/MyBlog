import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'

describe('authStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('should initialize with empty values', () => {
    const store = useAuthStore()
    expect(store.token).toBe('')
    expect(store.refreshToken).toBe('')
    expect(store.user).toBeNull()
    expect(store.isAuthenticated).toBe(false)
  })

  it('should set token', () => {
    const store = useAuthStore()
    store.setToken('new-token')
    expect(store.token).toBe('new-token')
    expect(store.isAuthenticated).toBe(true)
  })

  it('should clear state on logout', () => {
    const store = useAuthStore()
    store.setToken('test-token')
    store.logout()
    expect(store.token).toBe('')
    expect(store.refreshToken).toBe('')
    expect(store.user).toBeNull()
    expect(store.isAuthenticated).toBe(false)
  })
})
