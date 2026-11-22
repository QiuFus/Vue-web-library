<script setup lang="ts">
import { ref , onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '@/api/request'
import type { CartItem } from '@/types/cart'

const router = useRouter()

const items = ref<CartItem[]>([])
const loading = ref(false)
const total = ref('0.00')

async function fetchCart() {
  loading.value = true
  try {
    const res = await request.get('/api/cart')
    if (res.data.code === 200) {
      items.value = res.data.data
      total.value = res.data.total
    }
  } catch (err: any) {
    ElMessage.error(err.response?.data?.msg || '获取购物车失败')
  } finally {
    loading.value = false
  }
}

async function changeQuantity(item: CartItem, newQty: number) {
  if (newQty < 1) return
  if (newQty > item.stock) {
    ElMessage.warning(`库存不足，最多 ${item.stock} 本`)
    return
  }
  try {
    const res = await request.put(`/api/cart/${item.cartId}`, { quantity: newQty })
    if (res.data.code === 200) {
      item.quantity = newQty
      recalcTotal()
    } else {
      ElMessage.error(res.data.msg)
    }
  } catch (err: any) {
    ElMessage.error(err.response?.data?.msg || '修改失败')
  }
}

async function removeItem(item: CartItem) {
  try {
    await ElMessageBox.confirm('确定要删除这本书吗？', '提示', {
      type: 'warning',
    })
    const res = await request.delete(`/api/cart/${item.cartId}`)
    if (res.data.code === 200) {
      items.value = items.value.filter(i => i.cartId !== item.cartId)
      recalcTotal()
      ElMessage.success('已删除')
    }
  } catch (err: any) {
    if (err !== 'cancel') {
      ElMessage.error(err.response?.data?.msg || '删除失败')
    }
  }
}

// 本地计算总价（及时更新）
function recalcTotal() {
  let t = 0
  items.value.forEach(i => {
    t += Number(i.price) * i.quantity
  })
  total.value = t.toFixed(2)
}

async function goCheckout() {
  if (items.value.length === 0) {
    ElMessage.warning('购物车是空的')
    return
  }

  try {
    await ElMessageBox.confirm(
      `确认下单？共 ${items.value.length} 种商品，合计 ¥${total.value}`,
      '确认订单',
      { type: 'info' }
    )
  } catch {
    return
  }

  try {
    const res = await request.post('/api/orders')
    if (res.data.code === 200) {
      ElMessage.success('下单成功')
      router.push(`/profile/orders/${res.data.data.orderId}`)
    } else {
      ElMessage.error(res.data.msg || '下单失败')
    }
  } catch (err: any) {
    ElMessage.error(err.response?.data?.msg || '下单失败')
  }
}

onMounted(fetchCart)
</script>

<template>
  <div class="cart-page">
    <div class="cart-header">
      <h2>我的购物车</h2>
      <span class="count">{{ items.length }} 种商品</span>
    </div>

    <div v-if="loading" class="state">加载中...</div>
    <el-empty v-else-if="items.length === 0" description="购物车还是空的">
      <el-button type="primary" @click="router.push('/')">去逛逛</el-button>
    </el-empty>

    <template v-else>
      <div class="cart-list">
        <div v-for="item in items" :key="item.cartId" class="cart-item">
          <img :src="item.cover" class="cover" @click="router.push(`/book/${item.id}`)" />

          <div class="info">
            <h3 class="title" @click="router.push(`/book/${item.id}`)">{{ item.title }}</h3>
            <p class="author">{{ item.author }}</p>
          </div>

          <div class="price">¥{{ Number(item.price).toFixed(2) }}</div>

          <el-input-number
            :model-value="item.quantity"
            :min="1"
            :max="item.stock"
            size="small"
            @change="(val: number) => changeQuantity(item, val)"
          />

          <div class="subtotal">¥{{ (Number(item.price) * item.quantity).toFixed(2) }}</div>

          <el-button link type="danger" @click="removeItem(item)">
            <el-icon><Delete /></el-icon>
          </el-button>
        </div>
      </div>

      <div class="cart-footer">
        <div class="total">
          合计：<span class="total-price">¥{{ total }}</span>
        </div>
        <el-button type="primary" size="large" @click="goCheckout">
          去结算
        </el-button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.cart-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 88px 24px 60px;
  min-height: 100vh;
  background: #f7f8fa;
}

.cart-header {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 20px;
}

.cart-header h2 {
  font-size: 22px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.count {
  font-size: 14px;
  color: #9ca3af;
}

.state {
  text-align: center;
  padding: 80px 0;
  color: #9ca3af;
}

.cart-list {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px 24px;
  border-bottom: 1px solid #f0f2f5;
}

.cart-item:last-child {
  border-bottom: none;
}

.cover {
  width: 72px;
  height: 96px;
  object-fit: cover;
  border-radius: 6px;
  cursor: pointer;
  flex-shrink: 0;
}

.info {
  flex: 1;
  min-width: 0;
}

.title {
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 6px;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.title:hover {
  color: #667eea;
}

.author {
  font-size: 13px;
  color: #9ca3af;
  margin: 0;
}

.price {
  width: 90px;
  font-size: 15px;
  color: #4b5563;
  text-align: center;
}

.subtotal {
  width: 100px;
  font-size: 16px;
  font-weight: 700;
  color: #ef4444;
  text-align: center;
}

.cart-footer {
  margin-top: 20px;
  background: #fff;
  border-radius: 12px;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.total {
  font-size: 15px;
  color: #4b5563;
}

.total-price {
  font-size: 24px;
  font-weight: 700;
  color: #ef4444;
  margin-left: 8px;
}
</style>