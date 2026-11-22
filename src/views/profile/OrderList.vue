<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import request from '@/api/request'
import type { Order } from '@/types/order'

const router = useRouter()

const orders = ref<Order[]>([])
const loading = ref(false)
const activeStatus = ref('')

const statusTabs = [
  { label: '全部', value: '' },
  { label: '待支付', value: '待支付' },
  { label: '已支付', value: '已支付' },
  { label: '已发货', value: '已发货' },
  { label: '已完成', value: '已完成' },
  { label: '已取消', value: '已取消' },
]

async function fetchOrders() {
  loading.value = true
  try {
    const params = activeStatus.value ? { status: activeStatus.value } : {}
    const res = await request.get('/api/orders', { params })
    if (res.data.code === 200) {
      orders.value = res.data.data
    }
  } catch (err: any) {
    ElMessage.error(err.response?.data?.msg || '获取订单失败')
  } finally {
    loading.value = false
  }
}

function goDetail(orderId: number) {
  router.push(`/profile/orders/${orderId}`)
}

function formatTime(str: string) {
  const d = new Date(str)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

function statusType(status: string) {
  const map: Record<string, string> = {
    '待支付': 'warning',
    '已支付': 'primary',
    '已发货': 'info',
    '已完成': 'success',
    '已取消': 'danger',
  }
  return map[status] || 'info'
}

onMounted(fetchOrders)
</script>

<template>
  <div class="order-list">
    <h2 class="title">我的订单</h2>

    <el-tabs v-model="activeStatus" @tab-change="fetchOrders">
      <el-tab-pane
        v-for="tab in statusTabs"
        :key="tab.value"
        :label="tab.label"
        :name="tab.value"
      />
    </el-tabs>

    <div v-if="loading" class="state">加载中...</div>

    <el-empty v-else-if="orders.length === 0" description="暂无订单" />

    <div v-else class="orders">
      <div
        v-for="order in orders"
        :key="order.orderId"
        class="order-card"
        @click="goDetail(order.orderId)"
      >
        <div class="order-header">
          <span class="order-no">订单号：{{ order.orderNo }}</span>
          <el-tag :type="statusType(order.status)" size="small">
            {{ order.status }}
          </el-tag>
        </div>

        <div class="order-body">
          <img v-if="order.firstCover" :src="order.firstCover" class="cover" />
          <div class="order-info">
            <p class="time">{{ formatTime(order.createdAt) }}</p>
            <p class="count">共 {{ order.itemCount }} 件商品</p>
          </div>
          <div class="amount">¥{{ Number(order.totalAmount).toFixed(2) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.title {
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 20px;
}

.state {
  text-align: center;
  padding: 60px 0;
  color: #9ca3af;
}

.orders {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.order-card {
  border: 1px solid #f0f2f5;
  border-radius: 10px;
  padding: 16px 20px;
  cursor: pointer;
  transition: all 0.25s ease;
}

.order-card:hover {
  border-color: #667eea;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.1);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f2f5;
  margin-bottom: 12px;
}

.order-no {
  font-size: 13px;
  color: #6b7280;
}

.order-body {
  display: flex;
  align-items: center;
  gap: 16px;
}

.cover {
  width: 56px;
  height: 76px;
  object-fit: cover;
  border-radius: 4px;
  flex-shrink: 0;
}

.order-info {
  flex: 1;
}

.time {
  font-size: 13px;
  color: #9ca3af;
  margin: 0 0 6px;
}

.count {
  font-size: 14px;
  color: #4b5563;
  margin: 0;
}

.amount {
  font-size: 18px;
  font-weight: 700;
  color: #ef4444;
}
</style>