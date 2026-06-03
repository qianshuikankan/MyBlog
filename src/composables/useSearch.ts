import { ref } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { useRouter } from 'vue-router'

export function useSearch() {
  const keyword = ref('')
  const router = useRouter()

  const search = useDebounceFn((val: string) => {
    if (val.trim()) {
      router.push({ path: '/search', query: { q: val.trim() } })
    }
  }, 500)

  function handleSearch() {
    search(keyword.value)
  }

  return {
    keyword,
    handleSearch
  }
}
