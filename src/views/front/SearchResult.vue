<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useArticleStore } from '@/stores/articles'
import ArticleCard from '@/components/common/ArticleCard.vue'
import Empty from '@/components/common/Empty.vue'

const route = useRoute()
const articleStore = useArticleStore()
const keyword = ref('')

const emptyDescription = computed(() => {
  return keyword.value
    ? '未找到包含"' + keyword.value + '"的文章'
    : '请输入搜索关键词'
})

async function handleSearch() {
  keyword.value = (route.query.q as string) || ''
  if (!keyword.value) return
  await articleStore.fetchList({ keyword: keyword.value, page: 1 })
}

onMounted(handleSearch)
watch(() => route.query.q, handleSearch)
</script>

<template>
  <div class="search-page">
    <div class="search-header" v-if="keyword">
      <h2>搜索结果：<span class="keyword">{{ keyword }}</span></h2>
      <span class="result-count">共 {{ articleStore.total }} 条结果</span>
    </div>

    <template v-if="articleStore.loading">
      <div class="skeleton-list">
        <el-skeleton animated v-for="i in 3" :key="i" class="skeleton-item">
          <template #template>
            <el-skeleton-item variant="h3" style="width: 50%" />
            <el-skeleton-item variant="text" style="margin: 8px 0" />
            <el-skeleton-item variant="text" style="width: 30%" />
          </template>
        </el-skeleton>
      </div>
    </template>
    <template v-else-if="!articleStore.list.length">
      <Empty :description="emptyDescription" />
    </template>
    <template v-else>
      <div class="article-grid">
        <ArticleCard
          v-for="article in articleStore.list"
          :key="article.id"
          :article="article"
        />
      </div>
    </template>
  </div>
</template>

<style scoped>
.search-header {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 24px;
}

.search-header h2 {
  font-size: 20px;
  font-weight: 600;
}

.keyword {
  color: #D97706;
}

.result-count {
  font-size: 14px;
  color: #909399;
}

.article-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.skeleton-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.skeleton-item {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
}
</style>
