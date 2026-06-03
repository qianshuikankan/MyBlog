import axios, { AxiosError } from 'axios'
import type { InternalAxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import router from '@/router'
import { mockRequest } from '@/mock'

// 生产环境使用内置 mock 数据（无需后端服务器）
// 开发环境使用真实 Axios 请求（通过 Vite proxy 转发到 server.cjs）
const useMock = import.meta.env.PROD

// ===== 生产环境：Mock 适配器 =====
function createMockInstance() {
  function buildUrl(url: string, config?: any): string {
    if (!config?.params) return url
    const params = new URLSearchParams()
    for (const [k, v] of Object.entries(config.params)) {
      if (v !== undefined && v !== null && v !== '') params.set(k, String(v))
    }
    const qs = params.toString()
    return qs ? url + '?' + qs : url
  }
  return {
    get: (url: string, config?: any) => mockRequest('GET', buildUrl(url, config), undefined, config),
    post: (url: string, data?: any, config?: any) => mockRequest('POST', url, data, config),
    put: (url: string, data?: any, config?: any) => mockRequest('PUT', url, data, config),
    delete: (url: string, config?: any) => mockRequest('DELETE', buildUrl(url, config), undefined, config),
  }
}

// ===== 开发环境：真实 Axios 实例 =====
function createAxiosInstance() {
  const instance = axios.create({
    baseURL: '/api',
    timeout: 15000,
    headers: { 'Content-Type': 'application/json' }
  })

  // 刷新 token 的 pending 队列
  let isRefreshing = false
  let pendingQueue: Array<{
    resolve: (token: string) => void
    reject: (err: unknown) => void
  }> = []

  function processQueue(err: unknown, token: string | null) {
    pendingQueue.forEach((p) => {
      if (err) p.reject(err)
      else p.resolve(token!)
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

      const msg = response?.data?.message || error.message || '请求失败'
      ElMessage.error(msg)
      return Promise.reject(error)
    }
  )

  return instance
}

const request = useMock ? createMockInstance() : createAxiosInstance()

export default request
