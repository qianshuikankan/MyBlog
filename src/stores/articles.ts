import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Article, ArticleForm } from '@/types'
import {
  getArticleList,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle
} from '@/api/articles'

export const useArticleStore = defineStore('articles', () => {
  const list = ref<Article[]>([])
  const total = ref(0)
  const current = ref<Article | null>(null)
  const loading = ref(false)
  const page = ref(1)
  const pageSize = ref(10)

  async function fetchList(params?: {
    page?: number
    pageSize?: number
    categoryId?: number
    keyword?: string
    status?: string
  }) {
    loading.value = true
    try {
      const res = await getArticleList({
        page: page.value,
        pageSize: pageSize.value,
        ...params
      })
      list.value = res.data.list
      total.value = res.data.total
      page.value = res.data.page
    } finally {
      loading.value = false
    }
  }

  async function fetchById(id: number) {
    loading.value = true
    try {
      const res = await getArticleById(id)
      current.value = res.data
      return res.data
    } finally {
      loading.value = false
    }
  }

  async function create(data: ArticleForm) {
    const res = await createArticle(data)
    return res.data
  }

  async function update(id: number, data: Partial<ArticleForm>) {
    const res = await updateArticle(id, data)
    return res.data
  }

  async function remove(id: number) {
    await deleteArticle(id)
    list.value = list.value.filter((a) => a.id !== id)
    total.value--
  }

  return {
    list,
    total,
    current,
    loading,
    page,
    pageSize,
    fetchList,
    fetchById,
    create,
    update,
    remove
  }
})
