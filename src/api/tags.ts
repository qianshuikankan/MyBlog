import request from './request'
import type { ApiResponse } from '@/types'

export interface TagItem {
  name: string
  count: number
}

export function getTagList() {
  return request.get<any, ApiResponse<TagItem[]>>('/tags')
}
