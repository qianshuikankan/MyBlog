<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { computed } from 'vue'

const router = useRouter()
const route = useRoute()
const props = defineProps<{ collapsed: boolean }>()

const menus = [
  { path: '/admin/dashboard', icon: 'Odometer', label: '控制台' },
  { path: '/admin/articles', icon: 'Document', label: '文章管理' },
  { path: '/admin/categories', icon: 'Collection', label: '分类管理' }
]

const activeIndex = computed(() => route.path)

function navigate(path: string) {
  router.push(path)
}
</script>

<template>
  <aside class="admin-sidebar" :class="{ collapsed }">
    <div class="sidebar-logo">
      <span v-show="!collapsed" class="logo-text">MyBlog</span>
      <span v-show="collapsed" class="logo-short">M</span>
    </div>

    <el-menu
      :default-active="activeIndex"
      :collapse="collapsed"
      :router="false"
      class="sidebar-menu"
      @select="navigate"
    >
      <el-menu-item
        v-for="item in menus"
        :key="item.path"
        :index="item.path"
      >
        <el-icon>
          <component :is="item.icon" />
        </el-icon>
        <template #title>
          <span>{{ item.label }}</span>
        </template>
      </el-menu-item>
    </el-menu>
  </aside>
</template>

<style scoped>
.admin-sidebar {
  width: 220px;
  background: #304156;
  color: #bfcbd9;
  transition: width .3s;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.admin-sidebar.collapsed {
  width: 64px;
}

.sidebar-logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: rgba(0,0,0,.2);
}

.logo-short {
  font-size: 20px;
  font-weight: 800;
  color: #D97706;
}
.logo-text {
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  white-space: nowrap;
}

.sidebar-menu {
  flex: 1;
  border-right: none;
}

.sidebar-menu:not(.el-menu--collapse) {
  width: 220px;
}
</style>
