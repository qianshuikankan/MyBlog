/**
 * 生产环境 Mock 数据 — 当没有后端服务器时直接返回内置数据
 * 所有 API 路径和返回格式与 server.cjs 保持一致
 */

import { ElMessage } from 'element-plus'

// ===== 原始数据 =====
const users = [
  { id: 1, username: 'admin', password: 'admin123', email: 'admin@blog.com', avatar: '' }
]

let categories = [
  { id: 1, name: '前端开发', description: '前端技术相关文章', articleCount: 0, createdAt: '2026-01-10T08:00:00Z', updatedAt: '2026-01-10T08:00:00Z' },
  { id: 2, name: '后端开发', description: '后端技术相关文章', articleCount: 0, createdAt: '2026-01-11T08:00:00Z', updatedAt: '2026-01-11T08:00:00Z' },
  { id: 3, name: '系统设计', description: '架构与设计模式', articleCount: 0, createdAt: '2026-01-15T08:00:00Z', updatedAt: '2026-01-15T08:00:00Z' },
  { id: 4, name: '开发工具', description: '工具链与效率', articleCount: 0, createdAt: '2026-02-01T08:00:00Z', updatedAt: '2026-02-01T08:00:00Z' },
  { id: 5, name: 'Java', description: 'Java 学习笔记', articleCount: 0, createdAt: '2026-01-01T08:00:00Z', updatedAt: '2026-01-01T08:00:00Z' }
]

let articles: any[] = []
let nextArticleId = 1

const auth = { token: 'mock-jwt-token-admin-2026', refreshToken: 'mock-refresh-token-admin-2026' }

// ===== 从 db.json 加载文章数据 =====
function initArticles(): void {
  if (articles.length > 0) return
  // 35 篇文章的摘要数据——完整内容省略以减小产物体积
  // 实际部署时如果需要完整内容，可以从 db.json 复制
  const raw = [
    { id: 1, title: 'Vue 3 Composition API 实战指南', summary: '全面介绍 Vue 3 Composition API 的核心概念和实战技巧。', categoryId: 1, status: 'published', tags: ['Vue', 'Composition API', '前端'], viewCount: 129, createdAt: '2026-01-15T10:00:00Z', updatedAt: '2026-01-15T10:00:00Z' },
    { id: 2, title: 'TypeScript 高级类型详解', summary: '深入探讨 TypeScript 中的泛型、条件类型、映射类型等高级类型系统特性。', categoryId: 1, status: 'published', tags: ['TypeScript', '类型系统', '前端'], viewCount: 96, createdAt: '2026-01-20T10:00:00Z', updatedAt: '2026-01-20T10:00:00Z' },
    { id: 3, title: 'Pinia 状态管理最佳实践', summary: '介绍 Pinia 的核心概念和使用模式，包括 Store 定义、组件集成等。', categoryId: 1, status: 'published', tags: ['Pinia', 'Vue', '状态管理'], viewCount: 75, createdAt: '2026-02-01T10:00:00Z', updatedAt: '2026-02-01T10:00:00Z' },
    { id: 4, title: 'Node.js 中间件设计模式', summary: '深入解析 Node.js 框架中的中间件设计模式。', categoryId: 2, status: 'published', tags: ['Node.js', '中间件', '后端'], viewCount: 62, createdAt: '2026-02-10T10:00:00Z', updatedAt: '2026-02-10T10:00:00Z' },
    { id: 5, title: 'RESTful API 设计规范', summary: '总结 RESTful API 的设计原则和最佳实践。', categoryId: 2, status: 'draft', tags: ['API', 'REST', '后端'], viewCount: 44, createdAt: '2026-02-20T10:00:00Z', updatedAt: '2026-02-20T10:00:00Z' },
    { id: 6, title: '微服务架构设计要点', summary: '探讨微服务架构的设计要点，包括服务拆分、通信方式等。', categoryId: 3, status: 'published', tags: ['微服务', '架构', '系统设计'], viewCount: 88, createdAt: '2026-03-01T10:00:00Z', updatedAt: '2026-03-01T10:00:00Z' },
    { id: 7, title: 'Vite 构建优化实践', summary: '介绍 Vite 构建工具的优化策略，包括代码分割、Tree Shaking 等。', categoryId: 4, status: 'published', tags: ['Vite', '构建工具', '前端'], viewCount: 55, createdAt: '2026-03-10T10:00:00Z', updatedAt: '2026-03-10T10:00:00Z' }
  ]

  const javaArticles = [
    '0 面向对象原则', '0 面向对象程序设计的几个原则', '07-01 工具类及常用算法_', '07-02 Object Math System类',
    '07-03 String等字符相关类', '07-04 集合类', '07-04-1 List', '07-04-2 Set', '07-04-3 Map',
    '07-05 Iterator', '07-06 泛型', '08-01 文件的常用方法', '08-02 字节流', '08-03 字符流',
    '08-04 字符流和文件综合运用', '09-01 线程基本知识', '09-02 线程的访问冲突', '09-03 生产者消费者模型',
    '09-04 线程的几个状态', '10-01 网络编程', '11-01 反射和动态调用', '12-01 乱码和解决方法',
    '12-02 国际化', '13-01 匿名类', '13-02 函数式编程', '13-03 lambda表达式', '13-05 其他话题',
    '附录01-Java继承体系中的类型赋值规则与向上向下转型'
  ]

  const javaTagMap: Record<string, string[]> = {
    '0 面向对象原则': ['Java', 'OOP'], '0 面向对象程序设计的几个原则': ['Java', 'OOP'],
    '07-01 工具类及常用算法_': ['Java', '工具类'], '07-02 Object Math System类': ['Java', '基础类'],
    '07-03 String等字符相关类': ['Java', '字符串'], '07-04 集合类': ['Java', '集合'],
    '07-04-1 List': ['Java', '集合'], '07-04-2 Set': ['Java', '集合'], '07-04-3 Map': ['Java', '集合'],
    '07-05 Iterator': ['Java', '迭代器'], '07-06 泛型': ['Java', '泛型'],
    '08-01 文件的常用方法': ['Java', 'IO'], '08-02 字节流': ['Java', 'IO'], '08-03 字符流': ['Java', 'IO'],
    '08-04 字符流和文件综合运用': ['Java', 'IO'], '09-01 线程基本知识': ['Java', '多线程'],
    '09-02 线程的访问冲突': ['Java', '多线程'], '09-03 生产者消费者模型': ['Java', '多线程'],
    '09-04 线程的几个状态': ['Java', '多线程'], '10-01 网络编程': ['Java', '网络'],
    '11-01 反射和动态调用': ['Java', '反射'], '12-01 乱码和解决方法': ['Java', '编码'],
    '12-02 国际化': ['Java', '国际化'], '13-01 匿名类': ['Java', '匿名类'],
    '13-02 函数式编程': ['Java', '函数式'], '13-03 lambda表达式': ['Java', '函数式'],
    '13-05 其他话题': ['Java'], '附录01-Java继承体系中的类型赋值规则与向上向下转型': ['Java', '继承']
  }

  const now = new Date().toISOString()
  const baseSummary = 'Java 学习笔记'

  for (const title of javaArticles) {
    raw.push({
      id: 0,
      title,
      summary: baseSummary,
      categoryId: 5,
      status: 'published',
      tags: javaTagMap[title] || ['Java'],
      viewCount: Math.floor(Math.random() * 50) + 10,
      createdAt: now,
      updatedAt: now
    })
  }

  articles = raw.map((a, i) => ({ ...a, id: i + 1, content: `# ${a.title}\n\n${a.summary}` }))
  nextArticleId = articles.length + 1
  updateCategoryCounts()
}

function updateCategoryCounts() {
  for (const c of categories) {
    c.articleCount = articles.filter(a => a.categoryId === c.id).length
  }
}

initArticles()

// ===== 辅助函数 =====
function ok<T>(data: T) {
  return { code: 200, message: 'ok', data }
}

function fail(code: number, message: string) {
  return { code, message, data: null }
}

function getAuthHeader(req: any): string | null {
  return req.headers?.authorization || null
}

function checkAuth(req: any) {
  const ah = getAuthHeader(req)
  if (!ah || !ah.startsWith('Bearer ')) return null
  return users[0]
}

function parsePagination(query: any) {
  const page = Math.max(1, parseInt(query?.page) || 1)
  const pageSize = Math.min(100, Math.max(1, parseInt(query?.pageSize) || 10))
  return { page, pageSize }
}

// ===== 路由处理函数 =====
const handlers: Record<string, (req: any) => any> = {
  'POST /auth/login': (req) => {
    const { username, password } = req.body || {}
    const user = users.find(u => u.username === username && u.password === password)
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
    let filtered = [...articles].map(a => ({ ...a, category: categories.find(c => c.id === a.categoryId) || null }))
    const kw = (req.query?.keyword || '').toLowerCase()
    if (kw) filtered = filtered.filter(a => a.title.toLowerCase().includes(kw))
    if (req.query?.categoryId) filtered = filtered.filter(a => a.categoryId === parseInt(req.query.categoryId))
    if (req.query?.status) filtered = filtered.filter(a => a.status === req.query.status)
    const total = filtered.length
    const list = filtered.slice((page - 1) * pageSize, page * pageSize)
    return ok({ list, total, page, pageSize })
  },
  'GET /articles/:id': (req) => {
    const id = parseInt(req.params?.id || req.query?.id || 0)
    let a = articles.find(a => a.id === id)
    if (!a) return fail(404, '文章不存在')
    a = { ...a, category: categories.find(c => c.id === a.categoryId) || null, viewCount: a.viewCount + 1 }
    return ok(a)
  },
  'POST /articles': (req) => {
    const now = new Date().toISOString()
    const a = { id: nextArticleId++, ...req.body, viewCount: 0, createdAt: now, updatedAt: now }
    articles.push(a)
    updateCategoryCounts()
    return ok(a)
  },
  'PUT /articles/:id': (req) => {
    const id = parseInt(req.params?.id || req.query?.id || 0)
    const idx = articles.findIndex(a => a.id === id)
    if (idx === -1) return fail(404, '文章不存在')
    articles[idx] = { ...articles[idx], ...req.body, id, updatedAt: new Date().toISOString() }
    updateCategoryCounts()
    return ok(articles[idx])
  },
  'DELETE /articles/:id': (req) => {
    const id = parseInt(req.params?.id || req.query?.id || 0)
    articles = articles.filter(a => a.id !== id)
    updateCategoryCounts()
    return ok(null)
  },
  'GET /categories': () => {
    return ok(categories.map(c => ({ ...c, articleCount: articles.filter(a => a.categoryId === c.id).length })))
  },
  'POST /categories': (req) => {
    const now = new Date().toISOString()
    const c = { id: categories.length + 1, name: req.body?.name || '', description: req.body?.description || '', articleCount: 0, createdAt: now, updatedAt: now }
    categories.push(c)
    return ok(c)
  },
  'PUT /categories/:id': (req) => {
    const id = parseInt(req.params?.id || req.query?.id || 0)
    const idx = categories.findIndex(c => c.id === id)
    if (idx === -1) return fail(404, '分类不存在')
    categories[idx] = { ...categories[idx], ...req.body, id, updatedAt: new Date().toISOString() }
    return ok(categories[idx])
  },
  'DELETE /categories/:id': (req) => {
    const id = parseInt(req.params?.id || req.query?.id || 0)
    categories = categories.filter(c => c.id !== id)
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
  // 延迟 100ms 模拟网络
  await new Promise(r => setTimeout(r, 80))

  const body = data
  const query: Record<string, string> = {}
  const params: Record<string, string> = {}

  // 解析 URL 中的 query 参数
  const qIdx = url.indexOf('?')
  let path = qIdx >= 0 ? url.slice(0, qIdx) : url
  if (qIdx >= 0) {
    new URLSearchParams(url.slice(qIdx)).forEach((v, k) => { query[k] = v })
  }

  // 解析动态路由参数
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
      if (result.code === 401) {
        ElMessage.error('认证失败，请重新登录')
      }
      throw { response: { data: result } }
    }
    return result
  } catch (e: any) {
    if (e.response) throw e
    throw { response: { data: { code: 500, message: 'Mock handler error', data: null } } }
  }
}
