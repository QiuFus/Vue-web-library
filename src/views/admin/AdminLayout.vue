<script setup lang="ts">
import { RouterView, RouterLink } from 'vue-router'

</script>

<template>
    <div class="admin-layout">
        <aside class="sidebar">
            <h2 class="logo">网上图书 后台管理</h2>
            <nav class="menu">
                <RouterLink to="/admin/books" class="menu-item">
                    <el-icon>
                        <Reading />
                    </el-icon>
                    <span>图书管理</span>
                </RouterLink>
                <RouterLink to="/admin/orders" class="menu-item">
                    <el-icon>
                        <List />
                    </el-icon>
                    <span>订单管理</span>
                </RouterLink>
                <RouterLink to="/admin/notices" class="menu-item">
                    <el-icon><Calendar /></el-icon>
                    <span>公告管理</span>
                </RouterLink>
                <RouterLink to="/admin/dashborad" class="menu-item">
                    <el-icon><Calendar /></el-icon>
                    <span>统计数据</span>
                </RouterLink>
            </nav>
        </aside>
        <main class="content">
            <RouterView />
        </main>
    </div>
</template>

<style scoped>
.admin-layout {
    display: flex;
    min-height: 100vh;
    padding-top: 64px;
    background: #f7f8fa;
}

.sidebar {
    width: 220px;
    flex-shrink: 0;
    background: #1f2937;
    color: #d1d5db;
    padding: 24px 16px;
    position: fixed;
    top: 64px;
    bottom: 0;
    left: 0;
    overflow-y: auto;
}

.logo {
    font-size: 18px;
    font-weight: 700;
    color: #fff;
    margin: 0 0 24px;
    padding-left: 14px;
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
    color: #d1d5db;
    text-decoration: none;
    transition: all 0.2s ease;
}

.menu-item:hover {
    background: rgba(255, 255, 255, 0.06);
    color: #fff;
}

.menu-item.router-link-active {
    background: rgba(102, 126, 234, 0.2);
    color: #667eea;
    font-weight: 600;
}

.content {
    flex: 1;
    margin-left: 220px;
    padding: 24px 32px;
}
</style>