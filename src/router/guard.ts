import type { Router } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export function setupRouterGuard(router: Router) {
  router.beforeEach((to, _from, next) => {
    // 设置页面标题
    const title = (to.meta?.title as string) || 'MyBlog'
    document.title = `${title} - MyBlog`

    // 权限检查
    if (to.meta.requiresAuth) {
      const authStore = useAuthStore()
      if (!authStore.isAuthenticated) {
        next({ path: '/login', query: { redirect: to.fullPath } })
        return
      }
    }

    next()
  })
}
