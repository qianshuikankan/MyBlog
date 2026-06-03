import { describe, it, expect, vi } from 'vitest'
import { usePagination } from '@/composables/usePagination'

describe('usePagination', () => {
  it('should initialize with default values', () => {
    const fn = vi.fn()
    const pagination = usePagination(fn)
    expect(pagination.page.value).toBe(1)
    expect(pagination.pageSize.value).toBe(10)
    expect(pagination.total.value).toBe(0)
    expect(pagination.loading.value).toBe(false)
  })

  it('should initialize with custom pageSize', () => {
    const fn = vi.fn()
    const pagination = usePagination(fn, 20)
    expect(pagination.pageSize.value).toBe(20)
  })

  it('should calculate totalPages correctly', () => {
    const fn = vi.fn()
    const pagination = usePagination(fn)
    pagination.total.value = 25
    expect(pagination.totalPages.value).toBe(3) // 25/10 = 2.5 -> ceil 3
  })

  it('should call fetch function on loadPage', async () => {
    const fn = vi.fn().mockResolvedValue(undefined)
    const pagination = usePagination(fn)
    await pagination.loadPage(3)
    expect(pagination.page.value).toBe(3)
    expect(fn).toHaveBeenCalledOnce()
  })

  it('should reset page to 1', () => {
    const fn = vi.fn()
    const pagination = usePagination(fn)
    pagination.page.value = 5
    pagination.resetPage()
    expect(pagination.page.value).toBe(1)
  })
})
