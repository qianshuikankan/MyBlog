<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSearch } from '@/composables/useSearch'
import { Search } from '@element-plus/icons-vue'

const router = useRouter()
const { keyword, handleSearch } = useSearch()
const mobileMenuOpen = ref(false)

function navigate(path: string) {
  router.push(path)
  mobileMenuOpen.value = false
}
</script>

<template>
  <header class="site-header">
    <div class="header-inner">
      <!-- 左侧：Logo -->
      <div class="logo" @click="navigate('/')">
        <span class="logo-text">MyBlog</span>
      </div>

      <!-- 中间：搜索栏（放大） -->
      <div class="search-area">
        <div class="search-wrapper">
          <el-input
            v-model="keyword"
            placeholder="搜索文章..."
            :prefix-icon="Search"
            clearable
            size="large"
            class="search-input"
            @input="handleSearch"
            @keyup.enter="handleSearch"
          />
        </div>
      </div>

      <!-- 右侧：登录按钮 -->
      <div class="header-right">
        <router-link to="/login">
          <el-button class="login-btn" size="default">登录后台</el-button>
        </router-link>
        <button class="hamburger" @click="mobileMenuOpen = !mobileMenuOpen">
          <span class="hamburger-line" :class="{ open: mobileMenuOpen }" />
        </button>
      </div>
    </div>

    <Transition name="slide">
      <div v-if="mobileMenuOpen" class="mobile-menu">
        <router-link to="/" class="mobile-link" @click="navigate('/')">首页</router-link>
        <router-link to="/login" class="mobile-link" @click="navigate('/login')">登录后台</router-link>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: #fff;
  border-bottom: 2px solid #f1f1f1;
  box-shadow: 0 2px 8px rgba(0,0,0,.06);
}

.header-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 64px;
  gap: 24px;
}

.logo {
  flex-shrink: 0;
  cursor: pointer;
}

.logo-text {
  font-size: 22px;
  font-weight: 800;
  color: #D97706;
  letter-spacing: -0.5px;
}

.search-area {
  flex: 1;
  display: flex;
  justify-content: center;
  max-width: 520px;
  margin: 0 auto;
}

.search-wrapper {
  width: 100%;
}

.search-input :deep(.el-input__wrapper) {
  border-radius: 24px;
  background: #f3f4f6;
  border: 2px solid transparent;
  transition: all 0.25s;
}

.search-input :deep(.el-input__wrapper:hover) {
  border-color: #FDE68A;
}

.search-input :deep(.el-input__wrapper.is-focus) {
  border-color: #D97706;
  background: #fff;
  box-shadow: none;
}

.search-input :deep(.el-input__inner) {
  font-size: 15px;
}

.header-right {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.login-btn {
  border-radius: 20px;
  background: #D97706;
  color: #fff;
  border: none;
  font-weight: 600;
  padding: 8px 20px;
}

.login-btn:hover {
  background: #B45309 !important;
  color: #fff !important;
}

/* 汉堡菜单 */
.hamburger {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
}

.hamburger-line,
.hamburger-line::before,
.hamburger-line::after {
  display: block;
  width: 22px;
  height: 2px;
  background: #374151;
  transition: all .3s;
  position: relative;
}

.hamburger-line::before,
.hamburger-line::after {
  content: '';
  position: absolute;
}

.hamburger-line::before { top: -7px; }
.hamburger-line::after { top: 7px; }
.hamburger-line.open { background: transparent; }
.hamburger-line.open::before { top: 0; transform: rotate(45deg); }
.hamburger-line.open::after { top: 0; transform: rotate(-45deg); }

.mobile-menu {
  padding: 12px 20px;
  background: #fff;
  border-top: 1px solid #eee;
}

.mobile-link {
  display: block;
  padding: 10px 0;
  color: #374151;
  font-size: 15px;
}

.slide-enter-active,
.slide-leave-active {
  transition: all .3s ease;
}
.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
}
.slide-enter-to,
.slide-leave-from {
  max-height: 200px;
  opacity: 1;
}

@media (max-width: 768px) {
  .header-inner {
    gap: 12px;
    height: 56px;
  }
  .search-area {
    max-width: none;
  }
  .login-btn :deep(span) {
    font-size: 0;
    width: 0;
  }
  .login-btn :deep(svg) {
    display: none;
  }
  .hamburger { display: block; }
}
</style>
