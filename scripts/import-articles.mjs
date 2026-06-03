/**
 * 从本地 .md 文件导入文章到 db.json
 *
 * 用法:
 *   node scripts/import-articles.mjs <目录路径>
 *
 * 示例:
 *   node scripts/import-articles.mjs ~/my-articles
 *
 * .md 文件格式支持两种:
 *
 * 1. 带 frontmatter（推荐）:
 *   ---
 *   title: 我的文章标题
 *   category: 前端开发    # 可选，需匹配 db.json 中的分类名
 *   tags: [Vue, TypeScript]
 *   summary: 文章摘要
 *   ---
 *   正文内容...
 *
 * 2. 纯 Markdown:
 *   文件名作为标题，无分类和标签
 *   正文内容就是文件内容
 */

import fs from 'fs'
import path from 'path'

const [, , sourceDir] = process.argv

if (!sourceDir) {
  console.error('用法: node scripts/import-articles.mjs <目录路径>')
  process.exit(1)
}

const dbPath = path.resolve('db.json')
const articlesDir = path.resolve(sourceDir)

if (!fs.existsSync(articlesDir)) {
  console.error(`目录不存在: ${articlesDir}`)
  process.exit(1)
}

const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'))
const categories = db.categories

let maxId = db.articles.reduce((max, a) => Math.max(max, a.id), 0)
const now = new Date().toISOString()
const imported = []

const files = fs.readdirSync(articlesDir).filter(f => {
  const ext = f.toLowerCase()
  return (ext.endsWith('.md')) && fs.statSync(path.join(articlesDir, f)).size > 0
})

if (files.length === 0) {
  console.log('没有找到 .md 文件')
  process.exit(0)
}

for (const file of files) {
  const filePath = path.join(articlesDir, file)
  const content = fs.readFileSync(filePath, 'utf-8')
  let title = path.basename(file, path.extname(file))
  let summary = ''
  let categoryName = ''
  let tags = []
  let body = content

  // 解析 frontmatter
  if (content.startsWith('---')) {
    const end = content.indexOf('---', 3)
    if (end !== -1) {
      const frontmatter = content.slice(3, end).trim()
      body = content.slice(end + 3).trim()

      for (const line of frontmatter.split('\n')) {
        const colonIdx = line.indexOf(':')
        if (colonIdx === -1) continue
        const key = line.slice(0, colonIdx).trim()
        const val = line.slice(colonIdx + 1).trim()

        if (key === 'title') title = val
        else if (key === 'summary') summary = val
        else if (key === 'category') categoryName = val
        else if (key === 'tags') {
          tags = val
            .replace(/[\[\]]/g, '')
            .split(',')
            .map(t => t.trim().replace(/['"]/g, ''))
            .filter(Boolean)
        }
      }
    }
  }

  // 如果没写摘要，取正文前 120 字
  if (!summary) {
    summary = body
      .replace(/[#*`_~>|]/g, '')
      .replace(/\n/g, ' ')
      .trim()
      .slice(0, 120) + (body.length > 120 ? '...' : '')
  }

  // 将正文中的相对图片路径改为绝对路径
  body = body.replace(/\]\((att\/[^)]+)\)/g, '](/$1)')

  // 查找分类
  let categoryId = null
  if (categoryName) {
    const cat = categories.find(c => c.name === categoryName)
    if (cat) {
      categoryId = cat.id
    } else {
      console.warn(`  分类 "${categoryName}" 不存在，已跳过分类`)
    }
  }

  maxId++
  const article = {
    id: maxId,
    title,
    content: body,
    summary,
    coverImage: '',
    categoryId,
    status: 'published',
    tags,
    viewCount: 0,
    createdAt: now,
    updatedAt: now
  }

  imported.push(article)
  console.log(`  ✓ ${title}`)
}

db.articles.push(...imported)
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8')
console.log(`\n完成！导入了 ${imported.length} 篇文章到 db.json`)
