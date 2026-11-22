<script setup lang="ts">
import { RouterView, RouterLink } from 'vue-router'
import {useUserStore} from '@/stores/user'

const ui=useUserStore()
</script>

<template>
  <div class="profile-page">
    <aside class="sidebar">
      <div class="user-brief">
        <el-avatar :size="60" :src="ui.avatarUrl">
            {{ ui.nickname?.charAt(0) || '用' }}
          </el-avatar>
        <p class="welcome">个人中心</p>
      </div>
      <nav class="menu">
         <RouterLink to="/profile/info" class="menu-item">
          <el-icon><User /></el-icon>
          <span>个人信息</span>
        </RouterLink>
        <RouterLink to="/profile/favorites" class="menu-item">
          <el-icon><Star /></el-icon>
          <span>我的收藏</span>
        </RouterLink>
        <RouterLink to="/profile/orders" class="menu-item">
          <el-icon><List /></el-icon>
          <span>我的订单</span>
        </RouterLink>
      </nav>
    </aside>
    <main class="content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.profile-page {
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  padding: 88px 24px 60px;
  gap: 24px;
  min-height: 100vh;
  background: #f7f8fa;
}

.sidebar {
  width: 220px;
  flex-shrink: 0;
  background: #fff;
  border-radius: 12px;
  padding: 24px 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  align-self: flex-start;
}

.user-brief {
  text-align: center;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f2f5;
  margin-bottom: 16px;
}

.welcome {
  margin: 10px 0 0;
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 14px;
  color: #4b5563;
  text-decoration: none;
  transition: all 0.2s ease;
}

.menu-item:hover {
  background: rgba(102, 126, 234, 0.08);
  color: #667eea;
}

.menu-item.router-link-exact-active {
  background: rgba(102, 126, 234, 0.12);
  color: #667eea;
  font-weight: 600;
}

.content {
  flex: 1;
  background: #fff;
  border-radius: 12px;
  padding: 24px 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  min-height: 500px;
}
</style>