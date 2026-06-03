<script setup lang="ts">
import FrontHeader from './FrontHeader.vue'
</script>

<template>
  <div class="front-layout">
    <FrontHeader />
    <main class="front-main">
      <router-view />
    </main>
    <footer class="front-footer">
      <div class="footer-inner">
        <div class="footer-brand">
          <span class="footer-logo">MyBlog</span>
          <p>&copy; 2026 MyBlog. All rights reserved.</p>
        </div>
        <div class="footer-links">
          <router-link to="/">首页</router-link>
          <router-link to="/login">后台管理</router-link>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.front-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f8fafc;
}

.front-main {
  flex: 1;
  width: 100%;
  max-width: 1200px;
  margin: 28px auto;
  padding: 0 20px;
}

.front-footer {
  border-top: 1px solid #f1f1f1;
  background: #fff;
  padding: 0 20px;
}

.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
}

.footer-logo {
  font-size: 16px;
  font-weight: 700;
  color: #D97706;
}

.footer-brand p {
  margin-top: 4px;
  font-size: 13px;
  color: #9ca3af;
}

.footer-links {
  display: flex;
  gap: 20px;
}

.footer-links a {
  font-size: 13px;
  color: #9ca3af;
  transition: color .2s;
}

.footer-links a:hover {
  color: #D97706;
}

@media (max-width: 768px) {
  .front-main {
    margin: 16px auto;
    padding: 0 12px;
  }
  .footer-inner {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }
}
</style>
