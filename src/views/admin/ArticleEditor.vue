<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useArticleStore } from '@/stores/articles'
import { useCategoryStore } from '@/stores/categories'
import { defineAsyncComponent } from 'vue'
import { ElMessage } from 'element-plus'
import type { ArticleForm, Article } from '@/types'

const MdEditor = defineAsyncComponent(() => import('md-editor-v3'))
import 'md-editor-v3/lib/style.css'

const route = useRoute()
const router = useRouter()
const articleStore = useArticleStore()
const categoryStore = useCategoryStore()

const isEdit = computed(() => !!route.params.id)
const loading = ref(false)
const submitting = ref(false)

const form = reactive<ArticleForm>({
  title: '',
  content: '',
  summary: '',
  coverImage: '',
  categoryId: null,
  status: 'draft',
  tags: []
})

const tagInput = ref('')

async function loadArticle() {
  if (!isEdit.value) return
  loading.value = true
  try {
    const article: Article = await articleStore.fetchById(Number(route.params.id))
    form.title = article.title
    form.content = article.content
    form.summary = article.summary
    form.coverImage = article.coverImage || ''
    form.categoryId = article.categoryId
    form.status = article.status
    form.tags = article.tags || []
  } catch {
    ElMessage.error('文章加载失败')
    router.push('/admin/articles')
  } finally {
    loading.value = false
  }
}

function addTag() {
  const tag = tagInput.value.trim()
  if (tag && !form.tags.includes(tag)) {
    form.tags.push(tag)
  }
  tagInput.value = ''
}

function removeTag(tag: string) {
  form.tags = form.tags.filter(t => t !== tag)
}

async function handleSubmit(status: 'draft' | 'published') {
  if (!form.title.trim()) {
    ElMessage.warning('请输入文章标题')
    return
  }
  if (!form.content.trim()) {
    ElMessage.warning('请输入文章内容')
    return
  }

  form.status = status
  submitting.value = true
  try {
    if (isEdit.value) {
      await articleStore.update(Number(route.params.id), { ...form })
      ElMessage.success('文章更新成功')
    } else {
      await articleStore.create({ ...form })
      ElMessage.success('文章创建成功')
    }
    router.push('/admin/articles')
  } catch {
    ElMessage.error(isEdit.value ? '更新失败' : '创建失败')
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  await categoryStore.fetchAll()
  await loadArticle()
})
</script>

<template>
  <div class="article-editor">
    <div class="page-header">
      <h2>{{ isEdit ? '编辑文章' : '新建文章' }}</h2>
      <div class="header-actions">
        <el-button @click="router.push('/admin/articles')">取消</el-button>
        <el-button :loading="submitting" @click="handleSubmit('draft')">
          保存草稿
        </el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit('published')">
          发布
        </el-button>
      </div>
    </div>

    <div v-loading="loading" class="editor-body">
      <el-row :gutter="20">
        <el-col :xs="24" :lg="18">
          <el-card shadow="never" class="editor-card">
            <el-form :model="form" label-position="top">
              <el-form-item label="标题">
                <el-input
                  v-model="form.title"
                  placeholder="输入文章标题"
                  size="large"
                />
              </el-form-item>

              <el-form-item label="摘要">
                <el-input
                  v-model="form.summary"
                  type="textarea"
                  :rows="3"
                  placeholder="文章摘要，用于列表展示"
                />
              </el-form-item>

              <el-form-item label="文章内容 (Markdown)">
                <MdEditor
                  v-model="form.content"
                  :toolbars="[
                    'bold', 'italic', 'underline', 'strikeThrough',
                    '|',
                    'title', 'list', 'quote', 'code', 'link', 'image',
                    '|',
                    'preview', 'fullscreen'
                  ]"
                  :theme="'light'"
                  language="zh-CN"
                  class="md-editor"
                />
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>

        <el-col :xs="24" :lg="6">
          <el-card shadow="never" class="side-card">
            <template #header>
              <span>文章设置</span>
            </template>
            <el-form :model="form" label-position="top">
              <el-form-item label="分类">
                <el-select v-model="form.categoryId" placeholder="选择分类" clearable class="full-width">
                  <el-option
                    v-for="cat in categoryStore.list"
                    :key="cat.id"
                    :label="cat.name"
                    :value="cat.id"
                  />
                </el-select>
              </el-form-item>

              <el-form-item label="标签">
                <div class="tag-input-row">
                  <el-input
                    v-model="tagInput"
                    placeholder="输入标签"
                    size="small"
                    @keyup.enter="addTag"
                  />
                  <el-button size="small" @click="addTag">添加</el-button>
                </div>
                <div class="tag-list" v-if="form.tags.length">
                  <el-tag
                    v-for="tag in form.tags"
                    :key="tag"
                    closable
                    size="small"
                    @close="removeTag(tag)"
                  >
                    {{ tag }}
                  </el-tag>
                </div>
              </el-form-item>

              <el-form-item label="封面图">
                <el-input
                  v-model="form.coverImage"
                  placeholder="图片 URL"
                  size="small"
                />
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
      </el-row>
    </div>
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

.header-actions {
  display: flex;
  gap: 8px;
}

.editor-body {
  min-height: 500px;
}

.editor-card {
  border-radius: 8px;
  margin-bottom: 20px;
}

.md-editor {
  min-height: 460px;
}

.side-card {
  border-radius: 8px;
  position: sticky;
  top: 80px;
}

.full-width {
  width: 100%;
}

.tag-input-row {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

@media (max-width: 992px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  .side-card {
    position: static;
  }
}
</style>
