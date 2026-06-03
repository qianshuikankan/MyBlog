<script setup lang="ts">
import type { Article } from '@/types'
import { formatDateShort } from '@/utils/format'

const props = defineProps<{
  article: Article
  showActions?: boolean
}>()

const emit = defineEmits<{
  edit: [id: number]
  delete: [id: number]
}>()
</script>

<template>
  <article class="article-card">
    <router-link :to="`/article/${article.id}`" class="card-body">
      <div class="card-content">
        <h3 class="card-title">{{ article.title }}</h3>
        <p class="card-summary">{{ article.summary }}</p>
        <div class="card-meta">
          <span v-if="article.category" class="meta-category">
            <el-icon><Collection /></el-icon> {{ article.category.name }}
          </span>
          <span class="meta-date">
            <el-icon><Calendar /></el-icon> {{ formatDateShort(article.createdAt) }}
          </span>
          <span class="meta-views">
            <el-icon><View /></el-icon> {{ article.viewCount }}
          </span>
          <span class="meta-status" v-if="article.status === 'draft'">
            <el-tag size="small" type="warning">草稿</el-tag>
          </span>
        </div>
        <div class="card-tags" v-if="article.tags?.length">
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
      </div>
      <div v-if="article.coverImage" class="card-cover">
        <img :src="article.coverImage" :alt="article.title" loading="lazy" />
      </div>
    </router-link>
    <div v-if="showActions" class="card-actions">
      <el-button size="small" @click.stop="emit('edit', article.id)">
        <el-icon><Edit /></el-icon> 编辑
      </el-button>
      <el-button size="small" type="danger" plain @click.stop="emit('delete', article.id)">
        <el-icon><Delete /></el-icon> 删除
      </el-button>
    </div>
  </article>
</template>

<style scoped>
.article-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  transition: box-shadow .25s, transform .25s;
  border: 1px solid #e4e7ed;
}

.article-card:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,.08);
  transform: translateY(-2px);
}

.card-body {
  display: flex;
  padding: 20px;
  gap: 20px;
  cursor: pointer;
}

.card-content {
  flex: 1;
  min-width: 0;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
  line-height: 1.4;
}

.card-summary {
  font-size: 14px;
  color: #909399;
  line-height: 1.6;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 13px;
  color: #909399;
  flex-wrap: wrap;
}

.card-meta span {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.card-tags {
  margin-top: 10px;
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.tag {
  cursor: default;
}

.card-cover {
  width: 180px;
  flex-shrink: 0;
  border-radius: 6px;
  overflow: hidden;
}

.card-cover img {
  width: 100%;
  height: 120px;
  object-fit: cover;
}

.card-actions {
  padding: 0 20px 12px;
  display: flex;
  gap: 8px;
}

@media (max-width: 768px) {
  .card-body {
    flex-direction: column;
    padding: 16px;
  }
  .card-cover {
    width: 100%;
  }
  .card-cover img {
    height: 160px;
  }
}
</style>
