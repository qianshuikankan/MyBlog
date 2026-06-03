import { describe, it, expect } from 'vitest'
import { truncate, stripMarkdown } from '@/utils/format'

describe('truncate', () => {
  it('should return the same string if shorter than length', () => {
    expect(truncate('hello', 10)).toBe('hello')
  })

  it('should truncate and add ellipsis if longer than length', () => {
    const result = truncate('hello world this is a long text', 10)
    expect(result).toBe('hello worl...')
    expect(result.length).toBe(13)
  })

  it('should handle empty string', () => {
    expect(truncate('', 10)).toBe('')
  })
})

describe('stripMarkdown', () => {
  it('should remove markdown heading markers', () => {
    expect(stripMarkdown('# Hello')).toBe('Hello')
  })

  it('should remove markdown bold and italic markers', () => {
    expect(stripMarkdown('**bold** and *italic*')).toBe('bold and italic')
  })

  it('should remove markdown code markers', () => {
    expect(stripMarkdown('`code`')).toBe('code')
  })

  it('should remove horizontal rules', () => {
    expect(stripMarkdown('text\n---\nmore')).toBe('text\n\nmore')
  })

  it('should handle multiple consecutive newlines', () => {
    const result = stripMarkdown('a\n\n\n\n\nb')
    expect(result).toBe('a\n\nb')
  })

  it('should handle empty string', () => {
    expect(stripMarkdown('')).toBe('')
  })
})
