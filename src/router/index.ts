import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/admin/Login.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/',
    component: () => import('@/components/layout/FrontLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/front/ArticleList.vue'),
        meta: { title: '首页' }
      },
      {
        path: 'category/:id',
        name: 'Category',
        component: () => import('@/views/front/ArticleList.vue'),
        meta: { title: '分类筛选' }
      },
      {
        path: 'article/:id',
        name: 'ArticleDetail',
        component: () => import('@/views/front/ArticleDetail.vue'),
        meta: { title: '文章详情' }
      },
      {
        path: 'search',
        name: 'Search',
        component: () => import('@/views/front/SearchResult.vue'),
        meta: { title: '搜索结果' }
      }
    ]
  },
  {
    path: '/admin',
    component: () => import('@/components/layout/AdminLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/admin/dashboard'
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/admin/Dashboard.vue'),
        meta: { title: '控制台' }
      },
      {
        path: 'articles',
        name: 'ArticleManage',
        component: () => import('@/views/admin/ArticleManage.vue'),
        meta: { title: '文章管理' }
      },
      {
        path: 'articles/create',
        name: 'ArticleCreate',
        component: () => import('@/views/admin/ArticleEditor.vue'),
        meta: { title: '新建文章' }
      },
      {
        path: 'articles/edit/:id',
        name: 'ArticleEdit',
        component: () => import('@/views/admin/ArticleEditor.vue'),
        meta: { title: '编辑文章' }
      },
      {
        path: 'categories',
        name: 'CategoryManage',
        component: () => import('@/views/admin/CategoryManage.vue'),
        meta: { title: '分类管理' }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/front/NotFound.vue'),
    meta: { title: '404' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
