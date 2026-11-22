<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '@/api/request'
import type { OrderDetail } from '@/types/order'

const route = useRoute()
const router = useRouter()

const order = ref<OrderDetail | null>(null)
const loading = ref(false)
const acting = ref(false)

// 拉取订单详情
async function fetchDetail() {
  loading.value = true
  try {
    const res = await request.get(`/api/orders/${route.params.orderId}`)
    if (res.data.code === 200) {
      order.value = res.data.data
    } else {
      ElMessage.error(res.data.msg || '订单不存在')
    }
  } catch (err: any) {
    ElMessage.error(err.response?.data?.msg || '获取订单失败')
  } finally {
    loading.value = false
  }
}

// 支付
async function handlePay() {
  try {
    await ElMessageBox.confirm(
      `确认支付 ¥${Number(order.value?.totalAmount).toFixed(2)}？`,
      '确认支付',
      { type: 'info' }
    )
  } catch {
    return
  }

  acting.value = true
  try {
    const res = await request.put(`/api/orders/${route.params.orderId}/pay`)
    if (res.data.code === 200) {
      ElMessage.success('支付成功')
      if (order.value) order.value.status = '已支付'
    } else {
      ElMessage.error(res.data.msg || '支付失败')
    }
  } catch (err: any) {
    ElMessage.error(err.response?.data?.msg || '支付失败')
  } finally {
    acting.value = false
  }
}

// 取消订单
async function handleCancel() {
  try {
    await ElMessageBox.confirm(
      '取消后库存会释放，确定取消？',
      '确认取消',
      { type: 'warning' }
    )
  } catch {
    return
  }

  acting.value = true
  try {
    const res = await request.put(`/api/orders/${route.params.orderId}/cancel`)
    if (res.data.code === 200) {
      ElMessage.success('订单已取消')
      if (order.value) order.value.status = '已取消'
    } else {
      ElMessage.error(res.data.msg || '取消失败')
    }
  } catch (err: any) {
    ElMessage.error(err.response?.data?.msg || '取消失败')
  } finally {
    acting.value = false
  }
}

// 确认收货 
async function handleConfirm(){
  try{
    await ElMessageBox.confirm(
      "确认已收到货物?",
      "确认收货",
      {type:"info"}
    )
  }catch{
    return
  }

  acting.value=true
  try{
    const res = await request.put(`/api/orders/${route.params.orderId}/confirm`)
    if(res.data.code===200){
      ElMessage.success("确认成功")
      if(order.value) order.value.status="已完成"
    }else{
      ElMessage.error(res.data.msg || '操作失败')
    }
  }catch(err:any){
    ElMessage.error(err.response?.data?.msg || '操作失败')
  }finally{
    acting.value=false
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

onMounted(fetchDetail)
</script>

<template>
  <div class="order-detail">
    <div class="header">
      <h2 class="title">订单详情</h2>
      <el-button link @click="router.back()">
        <el-icon>
          <ArrowLeft />
        </el-icon>
        返回
      </el-button>
    </div>

    <div v-if="loading" class="state">加载中...</div>

    <div v-else-if="!order" class="state">订单不存在</div>

    <template v-else>
      <!-- 订单信息 -->
      <div class="info-card">
        <div class="info-row">
          <span class="label">订单号</span>
          <span class="value">{{ order.orderNo }}</span>
        </div>
        <div class="info-row">
          <span class="label">下单时间</span>
          <span class="value">{{ formatTime(order.createdAt) }}</span>
        </div>
        <div class="info-row">
          <span class="label">订单状态</span>
          <el-tag :type="statusType(order.status)" size="small">
            {{ order.status }}
          </el-tag>
        </div>
        <div class="info-row">
          <span class="label">订单金额</span>
          <span class="amount">¥{{ Number(order.totalAmount).toFixed(2) }}</span>
        </div>
      </div>

      <!-- 商品明细 -->
      <div class="items-card">
        <h3 class="sub-title">商品明细</h3>
        <div v-for="item in order.items" :key="item.itemId" class="item">
          <img :src="item.cover" class="cover" @click="router.push(`/book/${item.bookId}`)" />
          <div class="item-info">
            <h4 class="item-title">{{ item.title }}</h4>
            <p class="item-price">¥{{ Number(item.price).toFixed(2) }} × {{ item.quantity }}</p>
          </div>
          <div class="item-subtotal">
            ¥{{ (Number(item.price) * item.quantity).toFixed(2) }}
          </div>
        </div>
      </div>

      <div v-if="order.status === '待支付'" class="actions">
        <el-button type="primary" :loading="acting" @click="handlePay">
          去支付
        </el-button>
        <el-button :loading="acting" @click="handleCancel">
          取消订单
        </el-button>
      </div>

      <div v-else-if="order.status === '已发货'" class="actions">
        <el-button type="primary" :loading="acting" @click="handleConfirm">
          确认收货
        </el-button>
      </div>

      <span v-else class="no-action">订单已{{ order.status }}</span>
    </template>
  </div>
</template>

<style scoped>
.no-action {
  color: #9ca3af;
  font-size: 14px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.title {
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.state {
  text-align: center;
  padding: 60px 0;
  color: #9ca3af;
}

.info-card,
.items-card {
  background: #fafbfc;
  border-radius: 10px;
  padding: 20px 24px;
  margin-bottom: 20px;
}

.info-row {
  display: flex;
  align-items: center;
  padding: 8px 0;
  font-size: 14px;
}

.info-row .label {
  width: 90px;
  color: #9ca3af;
}

.info-row .value {
  color: #1f2937;
}

.amount {
  font-size: 18px;
  font-weight: 700;
  color: #ef4444;
}

.sub-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 16px;
}

.item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid #f0f2f5;
}

.item:last-child {
  border-bottom: none;
}

.cover {
  width: 56px;
  height: 76px;
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;
  flex-shrink: 0;
}

.item-info {
  flex: 1;
}

.item-title {
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 6px;
}

.item-price {
  font-size: 13px;
  color: #9ca3af;
  margin: 0;
}

.item-subtotal {
  font-size: 16px;
  font-weight: 700;
  color: #ef4444;
}
</style>