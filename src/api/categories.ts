import request from './request'
import type { ApiResponse, Category } from '@/types'

export function getCategoryList() {
  return request.get<any, ApiResponse<Category[]>>('/categories')
}

export function createCategory(data: { name: string; description?: string }) {
  return request.post<any, ApiResponse<Category>>('/categories', data)
}

export function updateCategory(id: number, data: { name?: string; description?: string }) {
  return request.put<any, ApiResponse<Category>>(`/categories/${id}`, data)
}

export function deleteCategory(id: number) {
  return request.delete<any, ApiResponse<null>>(`/categories/${id}`)
}
