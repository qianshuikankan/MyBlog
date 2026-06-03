import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types'
import { login as loginApi, getUserInfo } from '@/api/auth'
import { useLocalStorage } from '@vueuse/core'

export const useAuthStore = defineStore('auth', () => {
  const token = useLocalStorage('token', '')
  const refreshToken = useLocalStorage('refreshToken', '')
  const user = ref<User | null>(null)

  const isAuthenticated = computed(() => !!token.value)

  async function login(username: string, password: string) {
    const res = await loginApi({ username, password })
    token.value = res.data.token
    refreshToken.value = res.data.refreshToken
    user.value = res.data.user
    return res.data
  }

  async function fetchUserInfo() {
    try {
      const res = await getUserInfo()
      user.value = res.data
    } catch {
      logout()
    }
  }

  function setToken(newToken: string) {
    token.value = newToken
  }

  function logout() {
    token.value = ''
    refreshToken.value = ''
    user.value = null
  }

  return {
    token,
    refreshToken,
    user,
    isAuthenticated,
    login,
    fetchUserInfo,
    setToken,
    logout
  }
})
