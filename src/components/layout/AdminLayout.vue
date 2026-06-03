<script setup lang="ts">
import { ref } from 'vue'
import AdminSidebar from './AdminSidebar.vue'
import AdminHeader from './AdminHeader.vue'
import { useMediaQuery } from '@vueuse/core'

const isMobile = useMediaQuery('(max-width: 768px)')
const sidebarCollapsed = ref(false)
const drawerVisible = ref(false)

function toggleSidebar() {
  if (isMobile.value) {
    drawerVisible.value = !drawerVisible.value
  } else {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }
}
</script>

<template>
  <div class="admin-layout">
    <!-- 桌面端侧边栏 -->
    <AdminSidebar
      v-if="!isMobile"
      :collapsed="sidebarCollapsed"
    />

    <!-- 移动端抽屉 -->
    <el-drawer
      v-model="drawerVisible"
      size="220px"
      :with-header="false"
      direction="ltr"
      class="admin-drawer"
    >
      <AdminSidebar :collapsed="false" />
    </el-drawer>

    <div class="admin-main">
      <AdminHeader @toggle="toggleSidebar" />
      <div class="admin-content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.admin-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
}

.admin-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background: #f0f2f5;
}

.admin-drawer :deep(.el-drawer__body) {
  padding: 0;
}
</style>
