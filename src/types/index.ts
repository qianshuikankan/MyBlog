export interface User {
  id: number
  username: string
  email: string
  avatar?: string
}

export interface AuthState {
  token: string
  refreshToken: string
  user: User | null
}

export interface Category {
  id: number
  name: string
  description?: string
  articleCount?: number
  createdAt: string
  updatedAt: string
}

export interface Article {
  id: number
  title: string
  content: string
  summary: string
  coverImage?: string
  categoryId: number
  category?: Category
  status: 'draft' | 'published'
  tags: string[]
  viewCount: number
  createdAt: string
  updatedAt: string
}

export interface ArticleForm {
  title: string
  content: string
  summary: string
  coverImage?: string
  categoryId: number | null
  status: 'draft' | 'published'
  tags: string[]
}

export interface PaginationParams {
  page: number
  pageSize: number
}

export interface PaginatedResponse<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}
