import axios, { AxiosError } from 'axios'
import type { InternalAxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import router from '@/router'

const instance = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 刷新 token 的 pending 队列 —— 解决并发 401 重复刷新问题
let isRefreshing = false
let pendingQueue: Array<{
  resolve: (token: string) => void
  reject: (err: unknown) => void
}> = []

function processQueue(err: unknown, token: string | null) {
  pendingQueue.forEach((p) => {
    if (err) {
      p.reject(err)
    } else {
      p.resolve(token!)
    }
  })
  pendingQueue = []
}

instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const authStore = useAuthStore()
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

instance.interceptors.response.use(
  (response) => response.data,
  async (error: AxiosError<{ message?: string }>) => {
    const { config, response } = error
    if (!config) return Promise.reject(error)

    // 401 → 尝试刷新 token
    if (response?.status === 401 && !config.url?.includes('/auth/refresh')) {
      const authStore = useAuthStore()

      if (!authStore.refreshToken) {
        authStore.logout()
        router.push('/login')
        return Promise.reject(error)
      }

      if (!isRefreshing) {
        isRefreshing = true
        try {
          const res: any = await axios.post('/api/auth/refresh', {
            refreshToken: authStore.refreshToken
          })
          const { token } = res.data
          authStore.setToken(token)
          processQueue(null, token)
          // 重放原始请求
          config.headers.Authorization = `Bearer ${token}`
          return instance(config)
        } catch (refreshErr) {
          processQueue(refreshErr, null)
          authStore.logout()
          router.push('/login')
          return Promise.reject(refreshErr)
        } finally {
          isRefreshing = false
        }
      } else {
        // 已有刷新请求进行中，排队等待
        return new Promise((resolve, reject) => {
          pendingQueue.push({
            resolve: (token: string) => {
              config.headers.Authorization = `Bearer ${token}`
              resolve(instance(config))
            },
            reject
          })
        })
      }
    }

    // 业务错误提示
    const msg = response?.data?.message || error.message || '请求失败'
    ElMessage.error(msg)
    return Promise.reject(error)
  }
)

export default instance
