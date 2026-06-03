<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useArticleStore } from '@/stores/articles'
import { useCategoryStore } from '@/stores/categories'
import { useAuthStore } from '@/stores/auth'

const articleStore = useArticleStore()
const categoryStore = useCategoryStore()
const authStore = useAuthStore()

const stats = ref([
  { label: '文章总数', value: 0, icon: 'Document', color: '#409eff' },
  { label: '分类数量', value: 0, icon: 'Collection', color: '#67c23a' },
  { label: '已发布', value: 0, icon: 'SuccessFilled', color: '#e6a23c' },
  { label: '草稿', value: 0, icon: 'Edit', color: '#f56c6c' }
])

onMounted(async () => {
  await Promise.all([
    // 拉取足够多的文章来统计发布/草稿数量
    articleStore.fetchList({ page: 1, pageSize: 100 }),
    categoryStore.fetchAll()
  ])
  stats.value[0].value = articleStore.total
  stats.value[1].value = categoryStore.list.length
  stats.value[2].value = articleStore.list.filter(a => a.status === 'published').length
  stats.value[3].value = articleStore.list.filter(a => a.status === 'draft').length
})
</script>

<template>
  <div class="dashboard">
    <div class="welcome">
      <h2>欢迎回来，{{ authStore.user?.username || '管理员' }}</h2>
      <p>今日数据概览</p>
    </div>

    <el-row :gutter="16" class="stats-row">
      <el-col
        v-for="stat in stats"
        :key="stat.label"
        :xs="12"
        :sm="12"
        :md="6"
        class="stat-col"
      >
        <el-card shadow="never" class="stat-card">
          <div class="stat-content">
            <div class="stat-info">
              <div class="stat-label">{{ stat.label }}</div>
              <div class="stat-value">{{ stat.value }}</div>
            </div>
            <el-icon :size="48" :color="stat.color" class="stat-icon">
              <component :is="stat.icon" />
            </el-icon>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.welcome {
  margin-bottom: 24px;
}

.welcome h2 {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 4px;
}

.welcome p {
  color: #909399;
  font-size: 14px;
}

.stats-row {
  margin-bottom: 0 !important;
}

.stat-col {
  margin-bottom: 16px;
}

.stat-card {
  border-radius: 8px;
}

.stat-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #303133;
}

.stat-icon {
  opacity: .8;
}
</style>
