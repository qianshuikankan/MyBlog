import { ref, computed } from 'vue'

export function usePagination(fetchFn: () => Promise<void>, initialPageSize = 10) {
  const page = ref(1)
  const pageSize = ref(initialPageSize)
  const total = ref(0)
  const loading = ref(false)

  const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

  async function loadPage(p: number) {
    page.value = p
    loading.value = true
    try {
      await fetchFn()
    } finally {
      loading.value = false
    }
  }

  function nextPage() {
    if (page.value < totalPages.value) loadPage(page.value + 1)
  }

  function prevPage() {
    if (page.value > 1) loadPage(page.value - 1)
  }

  function resetPage() {
    page.value = 1
  }

  return {
    page,
    pageSize,
    total,
    loading,
    totalPages,
    loadPage,
    nextPage,
    prevPage,
    resetPage
  }
}
