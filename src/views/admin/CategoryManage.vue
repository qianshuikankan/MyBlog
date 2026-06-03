<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue'
import { useCategoryStore } from '@/stores/categories'
import type { Category } from '@/types'
import { ElMessage, ElMessageBox } from 'element-plus'

const categoryStore = useCategoryStore()

const dialogVisible = ref(false)
const editingCategory = ref<Category | null>(null)
const form = reactive({ name: '', description: '' })
const submitting = ref(false)

function openCreate() {
  editingCategory.value = null
  form.name = ''
  form.description = ''
  dialogVisible.value = true
}

function openEdit(cat: Category) {
  editingCategory.value = cat
  form.name = cat.name
  form.description = cat.description || ''
  dialogVisible.value = true
}

async function handleSubmit() {
  if (!form.name.trim()) {
    ElMessage.warning('请输入分类名称')
    return
  }
  submitting.value = true
  try {
    if (editingCategory.value) {
      await categoryStore.update(editingCategory.value.id, {
        name: form.name,
        description: form.description
      })
      ElMessage.success('分类更新成功')
    } else {
      await categoryStore.create({
        name: form.name,
        description: form.description
      })
      ElMessage.success('分类创建成功')
    }
    dialogVisible.value = false
  } catch {
    ElMessage.error('操作失败')
  } finally {
    submitting.value = false
  }
}

async function handleDelete(id: number) {
  try {
    await ElMessageBox.confirm('确定删除该分类？关联文章的分类将被清空。', '警告', {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning'
    })
  } catch {
    return
  }
  try {
    await categoryStore.remove(id)
    ElMessage.success('删除成功')
  } catch {
    ElMessage.error('删除失败')
  }
}

onMounted(() => {
  categoryStore.fetchAll()
})
</script>

<template>
  <div class="category-manage">
    <div class="page-header">
      <h2>分类管理</h2>
      <el-button type="primary" @click="openCreate">
        <el-icon><Plus /></el-icon> 新建分类
      </el-button>
    </div>

    <el-card shadow="never" v-loading="categoryStore.loading">
      <el-table :data="categoryStore.list" stripe style="width: 100%">
        <el-table-column prop="name" label="分类名称" width="200" />
        <el-table-column prop="description" label="描述" min-width="200" show-overflow-tooltip />
        <el-table-column prop="articleCount" label="文章数量" width="100" align="center" />
        <el-table-column label="创建时间" width="160">
          <template #default="{ row }">
            {{ row.createdAt?.slice(0, 16) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="openEdit(row)">编辑</el-button>
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
    </el-card>

    <!-- 新建/编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="editingCategory ? '编辑分类' : '新建分类'"
      width="420px"
      :close-on-click-modal="false"
    >
      <el-form :model="form" label-position="top">
        <el-form-item label="分类名称">
          <el-input
            v-model="form.name"
            placeholder="请输入分类名称"
          />
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="分类描述（可选）"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">
          {{ editingCategory ? '保存' : '创建' }}
        </el-button>
      </template>
    </el-dialog>
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
</style>
