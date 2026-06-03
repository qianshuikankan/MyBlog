<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useArticleStore } from '@/stores/articles'
import { useCategoryStore } from '@/stores/categories'
import ArticleCard from '@/components/common/ArticleCard.vue'
import Empty from '@/components/common/Empty.vue'
import { ElSkeleton, ElPagination } from 'element-plus'
import { useMediaQuery } from '@vueuse/core'
import { getTagList } from '@/api/tags'
import type { TagItem } from '@/api/tags'

const route = useRoute()
const router = useRouter()
const articleStore = useArticleStore()
const categoryStore = useCategoryStore()
const isMobile = useMediaQuery('(max-width: 768px)')

const activeCategory = ref<number | undefined>(undefined)
const allTags = ref<TagItem[]>([])

// 加载所有标签
async function loadTags() {
  try {
    const res = await getTagList()
    allTags.value = res.data
  } catch { /* ignore */ }
}

async function loadData() {
  const params: any = { page: articleStore.page, pageSize: 10 }

  if (route.name === 'Category' && route.params.id) {
    activeCategory.value = Number(route.params.id)
    params.categoryId = activeCategory.value
  } else if (route.query.categoryId) {
    activeCategory.value = Number(route.query.categoryId)
    params.categoryId = activeCategory.value
  } else {
    activeCategory.value = undefined
  }

  if (route.query.keyword) {
    params.keyword = route.query.keyword
  }

  await articleStore.fetchList(params)
}

function onCategoryClick(categoryId?: number) {
  articleStore.page = 1
  if (categoryId) {
    router.push({ name: 'Category', params: { id: categoryId } })
  } else {
    router.push({ name: 'Home' })
  }
}

function onTagClick(tag: string) {
  articleStore.page = 1
  router.push({ path: '/search', query: { q: tag } })
}

function onPageChange(page: number) {
  articleStore.page = page
  loadData()
}

onMounted(async () => {
  await Promise.all([
    categoryStore.fetchAll(),
    loadTags()
  ])
  await loadData()
})

watch(() => route.params, loadData)
</script>

<template>
  <div class="page-with-nav">
    <!-- 左侧分类导航栏（桌面端） -->
    <aside v-if="!isMobile" class="nav-sidebar">
      <div class="nav-header">文章分类</div>
      <nav class="nav-list">
        <div
          class="nav-item"
          :class="{ active: !activeCategory }"
          @click="onCategoryClick()"
        >
          <span class="nav-dot" :class="{ 'dot-active': !activeCategory }" />
          <span class="nav-label">全部分类</span>
          <span class="nav-count">{{ articleStore.total }}</span>
        </div>
        <div
          v-for="cat in categoryStore.list"
          :key="cat.id"
          class="nav-item"
          :class="{ active: activeCategory === cat.id }"
          @click="onCategoryClick(cat.id)"
        >
          <span class="nav-dot" :class="{ 'dot-active': activeCategory === cat.id }" />
          <span class="nav-label">{{ cat.name }}</span>
          <span class="nav-count">{{ cat.articleCount || 0 }}</span>
        </div>
      </nav>
    </aside>

    <!-- 移动端分类横向滚动 -->
    <div v-if="isMobile" class="mobile-nav-scroll">
      <div
        class="mobile-nav-chip"
        :class="{ chipActive: !activeCategory }"
        @click="onCategoryClick()"
      >
        全部
      </div>
      <div
        v-for="cat in categoryStore.list"
        :key="cat.id"
        class="mobile-nav-chip"
        :class="{ chipActive: activeCategory === cat.id }"
        @click="onCategoryClick(cat.id)"
      >
        {{ cat.name }}
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="content-area">
      <div class="content-header">
        <h2 class="section-title">
          {{ activeCategory
            ? categoryStore.list.find(c => c.id === activeCategory)?.name || '文章'
            : '全部文章'
          }}
        </h2>
        <span class="section-count">共 {{ articleStore.total }} 篇</span>
      </div>

      <template v-if="articleStore.loading && !articleStore.list.length">
        <el-skeleton v-for="i in 3" :key="i" animated class="skeleton-item">
          <template #template>
            <el-skeleton-item variant="h3" style="width: 60%; margin-bottom: 12px" />
            <el-skeleton-item variant="text" style="margin-bottom: 8px" />
            <el-skeleton-item variant="text" style="width: 40%" />
          </template>
        </el-skeleton>
      </template>

      <template v-else-if="!articleStore.list.length">
        <Empty description="暂无文章" />
      </template>

      <template v-else>
        <div class="article-grid">
          <ArticleCard
            v-for="article in articleStore.list"
            :key="article.id"
            :article="article"
            :show-actions="false"
          />
        </div>

        <div class="pagination-wrap" v-if="articleStore.total > 10">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="articleStore.total"
            :page-size="10"
            :current-page="articleStore.page"
            @current-change="onPageChange"
          />
        </div>
      </template>
    </div>

    <!-- 右侧标签云（桌面端） -->
    <aside v-if="!isMobile" class="right-sidebar">
      <div class="right-sidebar-card">
        <div class="right-sidebar-title">热门标签</div>
        <div class="tag-cloud">
          <span
            v-for="tag in allTags"
            :key="tag.name"
            class="tag-cloud-item"
            @click="onTagClick(tag.name)"
          >
            {{ tag.name }}
          </span>
          <div v-if="!allTags.length" class="no-tags">暂无标签</div>
        </div>
      </div>
    </aside>
  </div>
</template>

<style scoped>
.page-with-nav {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

/* ===== 左侧导航栏 ===== */
.nav-sidebar {
  width: 180px;
  flex-shrink: 0;
  position: sticky;
  top: 88px;
  background: #fff;
  border-radius: 12px;
  border: 1px solid #f1f1f1;
  overflow: hidden;
}

.nav-header {
  padding: 16px 16px 12px;
  font-size: 12px;
  font-weight: 700;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-bottom: 1px solid #f3f4f6;
}

.nav-list {
  padding: 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all .2s;
  font-size: 14px;
  color: #6b7280;
}

.nav-item:hover {
  background: #FFFBEB;
  color: #D97706;
}

.nav-item.active {
  background: #FFFBEB;
  color: #D97706;
  font-weight: 600;
}

.nav-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #d1d5db;
  flex-shrink: 0;
  transition: all .2s;
}

.nav-dot.dot-active,
.nav-item.active .nav-dot {
  background: #D97706;
  width: 8px;
  height: 8px;
}

.nav-label {
  flex: 1;
}

.nav-count {
  font-size: 11px;
  color: #9ca3af;
  background: #f3f4f6;
  padding: 1px 7px;
  border-radius: 10px;
  min-width: 22px;
  text-align: center;
}

.nav-item.active .nav-count {
  background: #FDE68A;
  color: #B45309;
}

/* ===== 移动端横向滚动 ===== */
.mobile-nav-scroll {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 12px;
  margin-bottom: 4px;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}

.mobile-nav-scroll::-webkit-scrollbar { display: none; }

.mobile-nav-chip {
  white-space: nowrap;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 13px;
  background: #f3f4f6;
  color: #6b7280;
  cursor: pointer;
  transition: all .2s;
  flex-shrink: 0;
}

.mobile-nav-chip.chipActive {
  background: #D97706;
  color: #fff;
  font-weight: 600;
}

/* ===== 主内容区 ===== */
.content-area {
  flex: 1;
  min-width: 0;
}

.content-header {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 20px;
}

.section-title {
  font-size: 22px;
  font-weight: 700;
  color: #1f2937;
}

.section-count {
  font-size: 14px;
  color: #9ca3af;
}

.article-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.skeleton-item {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  margin-bottom: 16px;
}

.pagination-wrap {
  display: flex;
  justify-content: center;
  margin-top: 32px;
}

/* ===== 右侧标签云 ===== */
.right-sidebar {
  width: 200px;
  flex-shrink: 0;
  position: sticky;
  top: 88px;
}

.right-sidebar-card {
  background: #fff;
  border-radius: 12px;
  border: 1px solid #f1f1f1;
  overflow: hidden;
}

.right-sidebar-title {
  padding: 16px 16px 12px;
  font-size: 12px;
  font-weight: 700;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-bottom: 1px solid #f3f4f6;
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 14px 16px;
}

.tag-cloud-item {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 14px;
  background: #FFFBEB;
  color: #D97706;
  cursor: pointer;
  transition: all .2s;
  line-height: 1.4;
}

.tag-cloud-item:hover {
  background: #FDE68A;
  color: #B45309;
  transform: scale(1.05);
}

.no-tags {
  font-size: 13px;
  color: #d1d5db;
}

/* ===== 响应式 ===== */
@media (max-width: 1100px) {
  .right-sidebar {
    display: none;
  }
}

@media (max-width: 900px) {
  .nav-sidebar {
    display: none;
  }
}

@media (max-width: 768px) {
  .page-with-nav {
    flex-direction: column;
    gap: 4px;
  }
  .content-header {
    margin-bottom: 12px;
  }
  .section-title {
    font-size: 18px;
  }
}
</style>
