<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
  <div class="not-found">
    <h1 class="error-code">404</h1>
    <p class="error-desc">页面不存在</p>
    <el-button type="primary" @click="router.push('/')">返回首页</el-button>
  </div>
</template>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 0;
  text-align: center;
}

.error-code {
  font-size: 96px;
  font-weight: 700;
  color: #D97706;
  line-height: 1;
  margin-bottom: 16px;
}

.error-desc {
  font-size: 18px;
  color: #909399;
  margin-bottom: 24px;
}
</style>
