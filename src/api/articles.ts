import request from './request'
import type { ApiResponse, Article, ArticleForm, PaginatedResponse } from '@/types'

export function getArticleList(params: {
  page?: number
  pageSize?: number
  categoryId?: number
  keyword?: string
  status?: string
}) {
  return request.get<any, ApiResponse<PaginatedResponse<Article>>>('/articles', { params })
}

export function getArticleById(id: number) {
  return request.get<any, ApiResponse<Article>>(`/articles/${id}`)
}

export function createArticle(data: ArticleForm) {
  return request.post<any, ApiResponse<Article>>('/articles', data)
}

export function updateArticle(id: number, data: Partial<ArticleForm>) {
  return request.put<any, ApiResponse<Article>>(`/articles/${id}`, data)
}

export function deleteArticle(id: number) {
  return request.delete<any, ApiResponse<null>>(`/articles/${id}`)
}
