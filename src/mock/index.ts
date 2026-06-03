/**
 * 生产环境 Mock 数据 — 当没有后端服务器时直接返回内置数据
 * 所有 API 路径和返回格式与 server.cjs 保持一致
 */

import { ElMessage } from 'element-plus'
import _db from '../../db.json'

const db = _db as any

// ===== 可变数据（运行时修改不影响源文件） =====
let users = JSON.parse(JSON.stringify(db.users))
let categories: any[] = JSON.parse(JSON.stringify(db.categories))
let articles: any[] = JSON.parse(JSON.stringify(db.articles))
let nextArticleId = articles.length + 1

// 将 Java 分类移到最前面
const javaCatIdx = categories.findIndex((c: any) => c.name === 'Java')
if (javaCatIdx > 0) {
  const java = categories.splice(javaCatIdx, 1)[0]
  categories.unshift(java)
}

// 将 Java 分类的文章排在列表最前面
const javaId = 5
const javaArticles = articles.filter((a: any) => a.categoryId === javaId)
const otherArticles = articles.filter((a: any) => a.categoryId !== javaId)
articles = [...javaArticles, ...otherArticles]

const auth = { token: 'mock-jwt-token-admin-2026', refreshToken: 'mock-refresh-token-admin-2026' }

// ===== 辅助函数 =====
function ok<T>(data: T) {
  return { code: 200, message: 'ok', data }
}
function fail(code: number, message: string) {
  return { code, message, data: null }
}
function checkAuth(req: any) {
  const ah = req.headers?.authorization
  if (!ah || !ah.startsWith('Bearer ')) return null
  return users[0]
}
function parsePagination(query: any) {
  const page = Math.max(1, parseInt(query?.page) || 1)
  const pageSize = Math.min(100, Math.max(1, parseInt(query?.pageSize) || 10))
  return { page, pageSize }
}
function updateCounts() {
  for (const c of categories) {
    c.articleCount = articles.filter((a: any) => a.categoryId === c.id).length
  }
}
updateCounts()

// ===== 路由处理函数 =====
const handlers: Record<string, (req: any) => any> = {
  'POST /auth/login': (req) => {
    const { username, password } = req.body || {}
    const user = users.find((u: any) => u.username === username && u.password === password)
    if (!user) return fail(401, '用户名或密码错误')
    return ok({ token: auth.token, refreshToken: auth.refreshToken, user: { id: user.id, username: user.username, email: user.email, avatar: user.avatar } })
  },
  'POST /auth/refresh': (req) => {
    if (req.body?.refreshToken !== auth.refreshToken) return fail(401, 'refreshToken 无效')
    return ok({ token: auth.token })
  },
  'GET /auth/userinfo': (req) => {
    const user = checkAuth(req)
    if (!user) return fail(401, '未认证')
    return ok({ id: user.id, username: user.username, email: user.email, avatar: user.avatar })
  },
  'POST /auth/logout': () => ok(null),
  'GET /articles': (req) => {
    const { page, pageSize } = parsePagination(req.query)
    let filtered = articles.map((a: any) => ({ ...a, category: categories.find((c: any) => c.id === a.categoryId) || null }))
    const kw = (req.query?.keyword || '').toLowerCase()
    if (kw) filtered = filtered.filter((a: any) => a.title.toLowerCase().includes(kw))
    if (req.query?.categoryId) filtered = filtered.filter((a: any) => a.categoryId === parseInt(req.query.categoryId))
    if (req.query?.status) filtered = filtered.filter((a: any) => a.status === req.query.status)
    const total = filtered.length
    const list = filtered.slice((page - 1) * pageSize, page * pageSize)
    return ok({ list, total, page, pageSize })
  },
  'GET /articles/:id': (req) => {
    const id = parseInt(req.params?.id || req.query?.id || 0)
    let a = articles.find((a: any) => a.id === id)
    if (!a) return fail(404, '文章不存在')
    a = { ...a, category: categories.find((c: any) => c.id === a.categoryId) || null, viewCount: a.viewCount + 1 }
    return ok(a)
  },
  'POST /articles': (req) => {
    const now = new Date().toISOString()
    const a = { id: nextArticleId++, ...req.body, viewCount: 0, createdAt: now, updatedAt: now }
    articles.push(a)
    updateCounts()
    return ok(a)
  },
  'PUT /articles/:id': (req) => {
    const id = parseInt(req.params?.id || req.query?.id || 0)
    const idx = articles.findIndex((a: any) => a.id === id)
    if (idx === -1) return fail(404, '文章不存在')
    articles[idx] = { ...articles[idx], ...req.body, id, updatedAt: new Date().toISOString() }
    updateCounts()
    return ok(articles[idx])
  },
  'DELETE /articles/:id': (req) => {
    const id = parseInt(req.params?.id || req.query?.id || 0)
    articles = articles.filter((a: any) => a.id !== id)
    updateCounts()
    return ok(null)
  },
  'GET /categories': () => {
    return ok(categories.map((c: any) => ({ ...c, articleCount: articles.filter((a: any) => a.categoryId === c.id).length })))
  },
  'POST /categories': (req) => {
    const now = new Date().toISOString()
    const c = { id: categories.length + 1, name: req.body?.name || '', description: req.body?.description || '', articleCount: 0, createdAt: now, updatedAt: now }
    categories.push(c)
    return ok(c)
  },
  'PUT /categories/:id': (req) => {
    const id = parseInt(req.params?.id || req.query?.id || 0)
    const idx = categories.findIndex((c: any) => c.id === id)
    if (idx === -1) return fail(404, '分类不存在')
    categories[idx] = { ...categories[idx], ...req.body, id, updatedAt: new Date().toISOString() }
    return ok(categories[idx])
  },
  'DELETE /categories/:id': (req) => {
    const id = parseInt(req.params?.id || req.query?.id || 0)
    categories = categories.filter((c: any) => c.id !== id)
    return ok(null)
  },
  'GET /tags': () => {
    const map = new Map<string, number>()
    for (const a of articles) {
      if (a.tags) for (const t of a.tags) map.set(t, (map.get(t) || 0) + 1)
    }
    return ok(Array.from(map.entries()).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count))
  }
}

// ===== Mock Axios 请求函数 =====
export async function mockRequest(method: string, url: string, data?: any, config?: any): Promise<any> {
  await new Promise(r => setTimeout(r, 80))

  const body = data
  const query: Record<string, string> = {}
  const params: Record<string, string> = {}

  const qIdx = url.indexOf('?')
  let path = qIdx >= 0 ? url.slice(0, qIdx) : url
  if (qIdx >= 0) {
    new URLSearchParams(url.slice(qIdx)).forEach((v, k) => { query[k] = v })
  }

  // 解析动态路由参数（如 /articles/1 → params.id=1, path=/articles/:id）
  for (const key of ['id']) {
    const match = path.match(new RegExp(`/(\\d+)/?$`))
    if (match) {
      params[key] = match[1]
      path = path.replace(/\/\d+$/, '/:id')
    }
  }

  const key = `${method.toUpperCase()} ${path}`
  const handler = handlers[key]

  if (!handler) {
    console.warn(`[Mock] No handler for ${method} ${path}`)
    return { code: 404, message: 'Not Found', data: null }
  }

  const req = { body, query, params, headers: config?.headers || {} }

  try {
    const result = handler(req)
    if (result.code >= 400) {
      if (result.code === 401) ElMessage.error('认证失败，请重新登录')
      throw { response: { data: result } }
    }
    return result
  } catch (e: any) {
    if (e.response) throw e
    throw { response: { data: { code: 500, message: 'Mock handler error', data: null } } }
  }
}
