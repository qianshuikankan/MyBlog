import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Category } from '@/types'
import {
  getCategoryList,
  createCategory,
  updateCategory,
  deleteCategory
} from '@/api/categories'

export const useCategoryStore = defineStore('categories', () => {
  const list = ref<Category[]>([])
  const loading = ref(false)

  async function fetchAll() {
    if (loading.value) return
    loading.value = true
    try {
      const res = await getCategoryList()
      list.value = res.data
    } finally {
      loading.value = false
    }
  }

  async function create(data: { name: string; description?: string }) {
    const res = await createCategory(data)
    list.value.push(res.data)
    return res.data
  }

  async function update(id: number, data: { name?: string; description?: string }) {
    const res = await updateCategory(id, data)
    const idx = list.value.findIndex((c) => c.id === id)
    if (idx !== -1) list.value[idx] = res.data
    return res.data
  }

  async function remove(id: number) {
    await deleteCategory(id)
    list.value = list.value.filter((c) => c.id !== id)
  }

  return {
    list,
    loading,
    fetchAll,
    create,
    update,
    remove
  }
})
