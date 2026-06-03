<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useArticleStore } from '@/stores/articles'
import type { Article } from '@/types'
import { formatDate } from '@/utils/format'
import { ElMessage } from 'element-plus'
import { MdPreview } from 'md-editor-v3'
import 'md-editor-v3/lib/preview.css'

const route = useRoute()
const router = useRouter()
const articleStore = useArticleStore()
const article = ref<Article | null>(null)
const loading = ref(true)

async function loadArticle() {
  loading.value = true
  try {
    article.value = await articleStore.fetchById(Number(route.params.id))
  } catch {
    ElMessage.error('文章加载失败')
  } finally {
    loading.value = false
  }
}

onMounted(loadArticle)
watch(() => route.params.id, loadArticle)
</script>

<template>
  <div class="article-detail-page">
    <!-- 加载中 -->
    <template v-if="loading">
      <div class="detail-loading">
        <el-skeleton animated>
          <template #template>
            <el-skeleton-item variant="h1" style="width: 70%; margin-bottom: 16px" />
            <el-skeleton-item variant="text" style="margin-bottom: 8px" />
            <el-skeleton-item variant="text" style="margin-bottom: 8px" />
            <el-skeleton-item variant="text" style="width: 60%" />
          </template>
        </el-skeleton>
      </div>
    </template>

    <!-- 文章内容 -->
    <template v-else-if="article">
      <article class="article-detail">
        <header class="detail-header">
          <h1 class="detail-title">{{ article.title }}</h1>
          <div class="detail-meta">
            <span v-if="article.category">
              <el-tag size="small">{{ article.category.name }}</el-tag>
            </span>
            <span class="meta-item">
              <el-icon><Calendar /></el-icon> {{ formatDate(article.createdAt) }}
            </span>
            <span class="meta-item">
              <el-icon><View /></el-icon> {{ article.viewCount }} 次阅读
            </span>
          </div>
          <div class="detail-tags" v-if="article.tags?.length">
            <el-tag
              v-for="tag in article.tags"
              :key="tag"
              size="small"
              type="info"
              class="tag"
            >
              {{ tag }}
            </el-tag>
          </div>
        </header>

        <div class="detail-body">
          <MdPreview
            :modelValue="article.content"
            :theme="'light'"
            previewTheme="default"
            codeTheme="github"
            language="zh-CN"
          />
        </div>
      </article>
    </template>

    <!-- 404 -->
    <template v-else>
      <div class="detail-not-found">
        <h2>文章不存在</h2>
        <el-button @click="router.push('/')">返回首页</el-button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.article-detail {
  background: #fff;
  border-radius: 8px;
  padding: 40px;
  border: 1px solid #e4e7ed;
}

.detail-header {
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid #eee;
}

.detail-title {
  font-size: 28px;
  font-weight: 700;
  color: #303133;
  margin-bottom: 16px;
  line-height: 1.4;
}

.detail-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 14px;
  color: #909399;
  flex-wrap: wrap;
}

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.detail-tags {
  margin-top: 12px;
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.detail-body {
  line-height: 1.8;
  font-size: 16px;
  color: #303133;
}

.detail-loading {
  background: #fff;
  border-radius: 8px;
  padding: 40px;
}

.detail-not-found {
  text-align: center;
  padding: 80px 0;
}

.detail-not-found h2 {
  margin-bottom: 16px;
  color: #909399;
}

@media (max-width: 768px) {
  .article-detail {
    padding: 20px;
  }
  .detail-title {
    font-size: 22px;
  }
}
</style>

<!-- 全局样式：修复 md-editor-v3 代码块头部遮挡导航栏 -->
<style>
.md-editor-code-head {
  position: static !important;
  z-index: auto !important;
}
</style>
