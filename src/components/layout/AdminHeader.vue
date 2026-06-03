<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'

const emit = defineEmits<{ toggle: [] }>()
const authStore = useAuthStore()
const router = useRouter()

async function handleLogout() {
  try {
    await ElMessageBox.confirm('确定退出登录？', '提示')
  } catch {
    return
  }
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <header class="admin-header">
    <div class="header-left">
      <el-button text @click="emit('toggle')" class="collapse-btn">
        <el-icon :size="20"><Fold /></el-icon>
      </el-button>
    </div>
    <div class="header-right">
      <span class="user-info">
        <el-icon><User /></el-icon>
        {{ authStore.user?.username || '管理员' }}
      </span>
      <el-button text @click="router.push('/')" class="header-btn">
        <el-icon><Monitor /></el-icon> 前台
      </el-button>
      <el-button text @click="handleLogout" class="header-btn">
        <el-icon><SwitchButton /></el-icon> 退出
      </el-button>
    </div>
  </header>
</template>

<style scoped>
.admin-header {
  height: 60px;
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: 0 1px 4px rgba(0,0,0,.04);
}

.header-left,
.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #606266;
}

.header-btn {
  font-size: 14px;
}
</style>
