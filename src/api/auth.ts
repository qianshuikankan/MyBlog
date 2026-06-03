import request from './request'
import type { ApiResponse, User } from '@/types'

export function login(data: { username: string; password: string }) {
  return request.post<any, ApiResponse<{ token: string; refreshToken: string; user: User }>>('/auth/login', data)
}

export function refreshToken(refreshToken: string) {
  return request.post<any, ApiResponse<{ token: string }>>('/auth/refresh', { refreshToken })
}

export function getUserInfo() {
  return request.get<any, ApiResponse<User>>('/auth/userinfo')
}

export function logout() {
  return request.post<any, ApiResponse<null>>('/auth/logout')
}
