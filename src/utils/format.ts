import { useDateFormat } from '@vueuse/core'

export function formatDate(dateStr: string): string {
  return useDateFormat(dateStr, 'YYYY-MM-DD HH:mm').value
}

export function formatDateShort(dateStr: string): string {
  return useDateFormat(dateStr, 'YYYY-MM-DD').value
}

export function truncate(text: string, length: number = 100): string {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

export function stripHtml(html: string): string {
  const div = document.createElement('div')
  div.innerHTML = html
  return div.textContent || div.innerText || ''
}

export function stripMarkdown(md: string): string {
  return md
    .replace(/[#*`_~\[\]()>|]/g, '')
    .replace(/-{3,}/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}
