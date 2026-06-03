const jsonServer = require('json-server')
const express = require('express')
const path = require('path')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

server.use(jsonServer.bodyParser)

// 提供 my-articles 目录下的静态文件（图片附件等）
server.use(express.static(path.resolve('my-articles')))

// 添加延迟模拟网络
server.use((_req, _res, next) => {
  setTimeout(next, 100)
})

// CORS
server.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
  next()
})

function getDb() {
  return router.db
}

// ---- 认证 ----

server.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body
  const db = getDb()
  const user = db.get('users').find({ username, password }).value()
  if (user) {
    const auth = db.get('auth').value()
    res.json({
      code: 200, message: '登录成功',
      data: {
        token: auth.token,
        refreshToken: auth.refreshToken,
        user: { id: user.id, username: user.username, email: user.email, avatar: user.avatar }
      }
    })
  } else {
    res.status(401).json({ code: 401, message: '用户名或密码错误', data: null })
  }
})

server.post('/api/auth/refresh', (req, res) => {
  const { refreshToken } = req.body
  const auth = getDb().get('auth').value()
  if (refreshToken === auth.refreshToken) {
    res.json({ code: 200, message: '刷新成功', data: { token: auth.token } })
  } else {
    res.status(401).json({ code: 401, message: 'refreshToken 无效', data: null })
  }
})

server.get('/api/auth/userinfo', (req, res) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ code: 401, message: '未认证', data: null })
  }
  const user = getDb().get('users').find({}).value()
  res.json({ code: 200, message: 'ok', data: { id: user.id, username: user.username, email: user.email, avatar: user.avatar } })
})

server.post('/api/auth/logout', (_req, res) => {
  res.json({ code: 200, message: '已退出', data: null })
})

// ---- 文章 API ----

function parsePagination(query) {
  const page = Math.max(1, parseInt(query.page) || 1)
  const pageSize = Math.min(100, Math.max(1, parseInt(query.pageSize) || 10))
  return { page, pageSize }
}

function getArticles(query) {
  let articles = getDb().get('articles').value()
  const categories = getDb().get('categories').value()

  // 挂载 category
  articles = articles.map(a => ({
    ...a,
    category: categories.find(c => c.id === a.categoryId) || null
  }))

  // 筛选
  if (query.keyword) {
    const kw = query.keyword.toLowerCase()
    articles = articles.filter(a => a.title.toLowerCase().includes(kw))
  }
  if (query.categoryId) {
    articles = articles.filter(a => a.categoryId === parseInt(query.categoryId))
  }
  if (query.status) {
    articles = articles.filter(a => a.status === query.status)
  }

  return articles
}

server.get('/api/articles', (req, res) => {
  const { page, pageSize } = parsePagination(req.query)
  const all = getArticles(req.query)
  const total = all.length
  const start = (page - 1) * pageSize
  const list = all.slice(start, start + pageSize)

  res.json({
    code: 200, message: 'ok',
    data: { list, total, page, pageSize }
  })
})

// 单篇文章必须在 /api/articles 之后，/api/articles/:id 之前
server.get('/api/articles/search', (req, res) => {
  const { page, pageSize } = parsePagination(req.query)
  const all = getArticles(req.query)
  const total = all.length
  const start = (page - 1) * pageSize
  const list = all.slice(start, start + pageSize)
  res.json({ code: 200, message: 'ok', data: { list, total, page, pageSize } })
})

server.get('/api/articles/:id', (req, res) => {
  const db = getDb()
  const id = parseInt(req.params.id)
  let article = db.get('articles').find({ id }).value()
  if (!article) {
    return res.status(404).json({ code: 404, message: '文章不存在', data: null })
  }
  const categories = db.get('categories').value()
  article = { ...article, category: categories.find(c => c.id === article.categoryId) || null }
  // 增加阅读数
  db.get('articles').find({ id }).assign({ viewCount: article.viewCount + 1 }).write()
  res.json({ code: 200, message: 'ok', data: article })
})

server.post('/api/articles', (req, res) => {
  const db = getDb()
  const now = new Date().toISOString()
  const maxId = db.get('articles').maxBy('id').value()?.id || 0
  const article = {
    id: maxId + 1,
    title: req.body.title || '',
    content: req.body.content || '',
    summary: req.body.summary || '',
    coverImage: req.body.coverImage || '',
    categoryId: req.body.categoryId || null,
    status: req.body.status || 'draft',
    tags: req.body.tags || [],
    viewCount: 0,
    createdAt: now,
    updatedAt: now
  }
  db.get('articles').push(article).write()
  res.json({ code: 200, message: '创建成功', data: article })
})

server.put('/api/articles/:id', (req, res) => {
  const db = getDb()
  const id = parseInt(req.params.id)
  const existing = db.get('articles').find({ id }).value()
  if (!existing) {
    return res.status(404).json({ code: 404, message: '文章不存在', data: null })
  }
  const updates = { ...req.body, updatedAt: new Date().toISOString() }
  db.get('articles').find({ id }).assign(updates).write()
  const updated = db.get('articles').find({ id }).value()
  res.json({ code: 200, message: '更新成功', data: updated })
})

server.delete('/api/articles/:id', (req, res) => {
  const db = getDb()
  const id = parseInt(req.params.id)
  db.get('articles').remove({ id }).write()
  res.json({ code: 200, message: '删除成功', data: null })
})

// ---- 分类 API ----

server.get('/api/categories', (req, res) => {
  const db = getDb()
  const articles = db.get('articles').value()
  const categories = db.get('categories').value().map(c => ({
    ...c,
    articleCount: articles.filter(a => a.categoryId === c.id).length
  }))
  res.json({ code: 200, message: 'ok', data: categories })
})

server.post('/api/categories', (req, res) => {
  const db = getDb()
  const now = new Date().toISOString()
  const maxId = db.get('categories').maxBy('id').value()?.id || 0
  const cat = {
    id: maxId + 1,
    name: req.body.name || '',
    description: req.body.description || '',
    articleCount: 0,
    createdAt: now,
    updatedAt: now
  }
  db.get('categories').push(cat).write()
  res.json({ code: 200, message: '创建成功', data: cat })
})

server.put('/api/categories/:id', (req, res) => {
  const db = getDb()
  const id = parseInt(req.params.id)
  const existing = db.get('categories').find({ id }).value()
  if (!existing) {
    return res.status(404).json({ code: 404, message: '分类不存在', data: null })
  }
  const updates = { ...req.body, updatedAt: new Date().toISOString() }
  db.get('categories').find({ id }).assign(updates).write()
  const updated = db.get('categories').find({ id }).value()
  res.json({ code: 200, message: '更新成功', data: updated })
})

server.delete('/api/categories/:id', (req, res) => {
  const db = getDb()
  const id = parseInt(req.params.id)
  db.get('categories').remove({ id }).write()
  res.json({ code: 200, message: '删除成功', data: null })
})

// ---- 标签云 ----
server.get('/api/tags', (req, res) => {
  const db = getDb()
  const articles = db.get('articles').value()
  const tagMap = new Map()
  for (const a of articles) {
    if (a.tags) {
      for (const t of a.tags) {
        tagMap.set(t, (tagMap.get(t) || 0) + 1)
      }
    }
  }
  const tags = Array.from(tagMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
  res.json({ code: 200, message: 'ok', data: tags })
})

// ---- 默认 json-server 路由（兜底） ----
server.use('/api', router)

server.listen(8080, () => {
  console.log('Mock API Server is running on http://localhost:8080')
})
