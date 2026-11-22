<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import request from '@/api/request'

const notices = ref<any[]>([])
const loading = ref(false)

async function fetchNotices() {
  loading.value = true
  try {
    const res = await request.get('/api/notices')
    if (res.data.code === 200) {
      notices.value = res.data.data
    }
  } catch (err: any) {
    ElMessage.error(err.response?.data?.msg || '获取公告失败')
  } finally {
    loading.value = false
  }
}

onMounted(fetchNotices)
</script>

<template>
  <div class="notice-page">
    <div class="notice-header">
      <h2>公告信息</h2>
      <p>了解网上书城的最新动态</p>
    </div>

    <div v-if="loading" class="state">加载中...</div>
    <el-empty v-else-if="notices.length === 0" description="暂无公告" />

    <el-timeline v-else class="timeline">
      <el-timeline-item
        v-for="item in notices"
        :key="item.id"
        :timestamp="new Date(item.createdAt).toLocaleDateString()"
        placement="top"
        :type="item.type"
        size="large"
      >
        <el-card shadow="hover" class="notice-card">
          <h3 class="notice-title">{{ item.title }}</h3>
          <p class="notice-content">{{ item.content }}</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<style scoped>
.notice-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 88px 24px 60px;
  min-height: 100vh;
  background: #f7f8fa;
}

.notice-header {
  margin-bottom: 40px;
  text-align: center;
}

.notice-header h2 {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 10px;
}

.notice-header p {
  font-size: 14px;
  color: #9ca3af;
  margin: 0;
}

.timeline {
  padding-left: 10px;
}

.notice-card {
  border-radius: 12px;
  border: none;
  background: #fff;
}

.notice-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 12px;
}

.notice-content {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.8;
  margin: 0;
}
.state { text-align: center; padding: 60px 0; color: #9ca3af; }
</style>