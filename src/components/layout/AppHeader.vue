<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { computed, ref } from 'vue';

const router = useRouter()
const searchKeyword = ref('')

function handleSearch() {
  const kw = searchKeyword.value.trim()
  if (!kw) return
  router.push({ path: '/books', query: { keyword: kw } })
  searchKeyword.value = ''
}

const userStore = useUserStore()

const navItems = computed(() => {
  const items = [
    { name: '首页', path: '/' },
    { name: '公告信息', path: '/notice' },
    { name: '书架', path: '/books' },
    { name: '购物车', path: '/cart' },
    { name: '我的订单', path: '/orders' },
    { name: '个人中心', path: '/profile' },
  ]
  if (userStore.role == '管理员') {
    items.push({ name: '后台管理', path: '/admin' })
  }
  return items;
})
</script>

<template>
  <header class="app-header">
    <div class="header-inner">
      <!-- 左侧 Logo -->
      <RouterLink to="/" class="logo">网上书城</RouterLink>

      <!-- 中间导航 -->
      <nav class="nav">
        <RouterLink v-for="item in navItems" :key="item.path" :to="item.path" class="nav-item">
          {{ item.name }}
        </RouterLink>
      </nav>

      <!-- 右侧搜索 -->
      <div class="search-wrap">
        <input class="search-input" type="text" placeholder="搜索书籍..." v-model="searchKeyword"
          @keyup.enter="handleSearch" />
      </div>

      <!-- 右侧用户信息 -->
      <div class="user-area" @click="router.push('/profile')">
        <el-avatar :size="32" :src="userStore.avatarUrl">
          {{ userStore.nickname?.charAt(0) || '用' }}
        </el-avatar>
        <span class="nickname">{{ userStore.nickname }}</span>
      </div>
    </div>
  </header>
</template>

<style scoped>
.nickname {
  color: white;
}

.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  z-index: 100;

  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.4);
}

.header-inner {
  max-width: 1200px;
  height: 100%;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  gap: 32px;
}

.logo {
  font-size: 30px;
  font-weight: 700;
  color: #eaeaea;
  text-shadow: 0 2px 10px rgb(255, 255, 255);
  text-decoration: none;
  white-space: nowrap;
}

.nav {
  display: flex;
  gap: 4px;
  flex: 1;
}

.nav-item {
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 15px;
  color: #ffffff;
  text-decoration: none;
  white-space: nowrap;
  transition: transform 0.25s ease, color 0.25s ease, text-shadow 0.25s ease;
  transform-origin: center bottom;
  display: inline-block;
}

.nav-item:hover {
  color: #eaeaea;
  text-shadow: 0 2px 10px rgb(255, 255, 255);
  transform: translateY(-3px) scale(1.2);
}

/* 当前路由高亮 */
.nav-item.router-link-active {
  color: #2e60d6;
  text-shadow: 0 4px 16px rgb(85, 141, 255);
  font-weight: 600;
  transform: translateY(-2px) scale(1.25);
}

.search-wrap {
  width: 220px;
}

.search-input {
  width: 100%;
  height: 36px;
  padding: 0 14px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  outline: none;
  transition: all 0.25s ease;
}

.search-input:focus {
  border-color: #667eea;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.12);
}

.user-area {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 20px;
  transition: background 0.2s ease;
}

.user-area:hover {
  background: rgba(201, 223, 252, 0.3);
}
</style>