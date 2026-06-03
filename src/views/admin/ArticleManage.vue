<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useArticleStore } from '@/stores/articles'
import { useCategoryStore } from '@/stores/categories'
import { useMediaQuery } from '@vueuse/core'
import { ElMessage, ElMessageBox } from 'element-plus'
import Empty from '@/components/common/Empty.vue'

const router = useRouter()
const articleStore = useArticleStore()
const categoryStore = useCategoryStore()
const isMobile = useMediaQuery('(max-width: 768px)')

const filters = reactive({
  keyword: '',
  status: '' as string,
  categoryId: undefined as number | undefined
})

const tableLoading = ref(false)

async function loadArticles() {
  tableLoading.value = true
  try {
    await articleStore.fetchList({
      page: articleStore.page,
      pageSize: articleStore.pageSize,
      keyword: filters.keyword || undefined,
      status: filters.status || undefined,
      categoryId: filters.categoryId
    })
  } finally {
    tableLoading.value = false
  }
}

function goCreate() {
  router.push('/admin/articles/create')
}

function goEdit(id: number) {
  router.push(`/admin/articles/edit/${id}`)
}

async function handleDelete(id: number) {
  try {
    await ElMessageBox.confirm('确定删除该文章？此操作不可恢复。', '警告', {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning'
    })
  } catch {
    return
  }
  try {
    await articleStore.remove(id)
    ElMessage.success('删除成功')
    await loadArticles()
  } catch {
    ElMessage.error('删除失败')
  }
}

function handlePageChange(page: number) {
  articleStore.page = page
  loadArticles()
}

function handleSearch() {
  articleStore.page = 1
  loadArticles()
}

function clearFilters() {
  filters.keyword = ''
  filters.status = ''
  filters.categoryId = undefined
  articleStore.page = 1
  loadArticles()
}

onMounted(async () => {
  await categoryStore.fetchAll()
  await loadArticles()
})
</script>

<template>
  <div class="article-manage">
    <div class="page-header">
      <h2>文章管理</h2>
      <el-button type="primary" @click="goCreate">
        <el-icon><Plus /></el-icon> 新建文章
      </el-button>
    </div>

    <!-- 筛选栏 -->
    <el-card shadow="never" class="filter-card">
      <el-row :gutter="12" align="middle">
        <el-col :xs="24" :sm="8" :md="6">
          <el-input
            v-model="filters.keyword"
            placeholder="搜索标题..."
            clearable
            @keyup.enter="handleSearch"
          />
        </el-col>
        <el-col :xs="12" :sm="6" :md="4">
          <el-select
            v-model="filters.status"
            placeholder="状态"
            clearable
            class="full-width"
            @change="handleSearch"
          >
            <el-option label="已发布" value="published" />
            <el-option label="草稿" value="draft" />
          </el-select>
        </el-col>
        <el-col :xs="12" :sm="6" :md="4">
          <el-select
            v-model="filters.categoryId"
            placeholder="分类"
            clearable
            class="full-width"
            @change="handleSearch"
          >
            <el-option
              v-for="cat in categoryStore.list"
              :key="cat.id"
              :label="cat.name"
              :value="cat.id"
            />
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="4" :md="2">
          <el-button @click="clearFilters">重置</el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- 桌面端表格 -->
    <el-card shadow="never" v-if="!isMobile" class="table-card">
      <el-table
        :data="articleStore.list"
        v-loading="tableLoading"
        stripe
        style="width: 100%"
      >
        <el-table-column prop="title" label="标题" min-width="200" show-overflow-tooltip />
        <el-table-column label="分类" width="100">
          <template #default="{ row }">
            {{ row.category?.name || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 'published' ? 'success' : 'warning'" size="small">
              {{ row.status === 'published' ? '已发布' : '草稿' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="阅读" width="70" prop="viewCount" />
        <el-table-column label="更新时间" width="160">
          <template #default="{ row }">
            {{ row.updatedAt?.slice(0, 16) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="goEdit(row.id)">编辑</el-button>
            <el-button
              size="small"
              type="danger"
              plain
              @click="handleDelete(row.id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="table-pagination" v-if="articleStore.total > articleStore.pageSize">
        <el-pagination
          background
          layout="total, prev, pager, next"
          :total="articleStore.total"
          :page-size="articleStore.pageSize"
          :current-page="articleStore.page"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <!-- 移动端卡片列表 -->
    <template v-else>
      <div v-if="!articleStore.list.length && !tableLoading" class="empty-wrap">
        <Empty description="暂无文章" />
      </div>
      <div v-else class="mobile-list">
        <el-card
          v-for="article in articleStore.list"
          :key="article.id"
          shadow="never"
          class="mobile-article-card"
          @click="goEdit(article.id)"
        >
          <div class="mobile-article-header">
            <span class="mobile-article-title">{{ article.title }}</span>
            <el-tag
              :type="article.status === 'published' ? 'success' : 'warning'"
              size="small"
            >
              {{ article.status === 'published' ? '已发布' : '草稿' }}
            </el-tag>
          </div>
          <div class="mobile-article-meta">
            <span>{{ article.category?.name || '-' }}</span>
            <span>{{ article.updatedAt?.slice(0, 10) }}</span>
          </div>
          <div class="mobile-article-actions" @click.stop>
            <el-button size="small" @click="goEdit(article.id)">编辑</el-button>
            <el-button size="small" type="danger" plain @click="handleDelete(article.id)">删除</el-button>
          </div>
        </el-card>
      </div>
    </template>
  </div>
</template>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.page-header h2 {
  font-size: 20px;
  font-weight: 600;
}

.filter-card {
  margin-bottom: 16px;
}

.full-width {
  width: 100%;
}

.table-card {
  border-radius: 8px;
}

.table-pagination {
  display: flex;
  justify-content: center;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #eee;
}

.mobile-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mobile-article-card {
  cursor: pointer;
  border-radius: 8px;
}

.mobile-article-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.mobile-article-title {
  font-weight: 600;
  font-size: 15px;
  flex: 1;
  margin-right: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mobile-article-meta {
  font-size: 13px;
  color: #909399;
  display: flex;
  gap: 16px;
  margin-bottom: 8px;
}

.mobile-article-actions {
  display: flex;
  gap: 8px;
}

.empty-wrap {
  padding: 40px 0;
}
</style>
