<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import request from '@/api/request'

interface AdminOrder {
  orderId: number
  orderNo: string
  totalAmount: string | number
  status: string
  createdAt: string
  username: string
  nickname: string
}

const orders = ref<AdminOrder[]>([])
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
    const res = await request.get('/api/admin/orders', { params })
    if (res.data.code === 200) {
      orders.value = res.data.data
    }
  } catch (err: any) {
    ElMessage.error(err.response?.data?.msg || '获取订单失败')
  } finally {
    loading.value = false
  }
}

async function changeStatus(order: AdminOrder, newStatus: string) {
  try {
    const res = await request.put(`/api/admin/orders/${order.orderId}/status`, {
      status: newStatus,
    })
    if (res.data.code === 200) {
      ElMessage.success('状态修改成功')
      fetchOrders()
    } else {
      ElMessage.error(res.data.msg || '修改失败')
    }
  } catch (err: any) {
    ElMessage.error(err.response?.data?.msg || '修改失败')
  }
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
  <div class="order-manage">
    <h2 class="title">订单管理</h2>

    <el-tabs v-model="activeStatus" @tab-change="fetchOrders">
      <el-tab-pane
        v-for="tab in statusTabs"
        :key="tab.value"
        :label="tab.label"
        :name="tab.value"
      />
    </el-tabs>

    <el-table :data="orders" v-loading="loading" stripe>
      <el-table-column prop="orderNo" label="订单号" min-width="200" />
      <el-table-column label="用户" width="140">
        <template #default="{ row }">{{ row.nickname || row.username }}</template>
      </el-table-column>
      <el-table-column label="金额" width="110">
        <template #default="{ row }">¥{{ Number(row.totalAmount).toFixed(2) }}</template>
      </el-table-column>
      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="statusType(row.status)" size="small">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="下单时间" width="180">
        <template #default="{ row }">{{ formatTime(row.createdAt) }}</template>
      </el-table-column>
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <el-button
            v-if="row.status === '已支付'"
            link
            type="primary"
            @click="changeStatus(row, '已发货')"
          >
            发货
          </el-button>
          <el-button
            v-if="row.status === '待支付'"
            link
            type="danger"
            @click="changeStatus(row, '已取消')"
          >
            取消
          </el-button>
          <span v-if="row.status === '已完成' || row.status === '已取消'" class="no-action">
            无操作
          </span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped>
.order-manage {
  background: #fff;
  border-radius: 12px;
  padding: 24px 28px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.title {
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 20px;
}

.no-action {
  color: #c0c4cc;
  font-size: 13px;
}
</style>