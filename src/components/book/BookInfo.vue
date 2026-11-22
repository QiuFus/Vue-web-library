<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import request from '@/api/request'
import type { BookDetail } from '@/types/book'

const props = defineProps<{ book: BookDetail }>()
const emit = defineEmits<{
  (e: 'buy', id: number): void
  (e: 'favorite-change', id: number, favorited: boolean): void
}>()

const router = useRouter()

const favorited = ref(props.book.isFavorited)
const favLoading = ref(false)

// 收藏/取消收藏
async function toggleFavorite() {
  const token = localStorage.getItem('token')
  if (!token) {
    ElMessage.warning('请先登录')
    return
  }

  favLoading.value = true
  try {
    const res = await request.post(`/api/books/${props.book.id}/favorite`)
    if (res.data.code === 200) {
      favorited.value = res.data.data.favorited
      ElMessage.success(res.data.msg)
      emit('favorite-change', props.book.id, favorited.value)
    }
  } catch (err: any) {
    ElMessage.error(err.response?.data?.msg || '操作失败')
  } finally {
    favLoading.value = false
  }
}

// 加入购物车
const addingToCart = ref(false)

async function addToCart() {
  const token = localStorage.getItem('token')
  if (!token) {
    ElMessage.warning('请先登录')
    return
  }
  if (props.book.stock === 0) {
    ElMessage.warning('该图书已缺货')
    return
  }

  addingToCart.value = true
  try {
    const res = await request.post('/api/cart', {
      bookId: props.book.id,
      quantity: 1,
    })
    if (res.data.code === 200) {
      ElMessage.success('已加入购物车')
    } else {
      ElMessage.error(res.data.msg || '加入失败')
    }
  } catch (err: any) {
    ElMessage.error(err.response?.data?.msg || '网络错误')
  } finally {
    addingToCart.value = false
  }
}

function goBack() {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}
</script>

<template>
  <section class="book-info">

    <button class="back-btn" @click="goBack">
      <el-icon :size="18">
        <ArrowLeft />
      </el-icon>
      <span>返回</span>
    </button>

    <div class="cover-wrap">
      <img :src="props.book.cover" :alt="props.book.title" class="cover" />
    </div>

    <div class="meta">
      <h1 class="title">{{ props.book.title }}</h1>
      <p class="author">作者：{{ props.book.author }}</p>

      <div class="tags">
        <span v-if="props.book.category" class="tag">{{ props.book.category }}</span>
        <span v-if="props.book.publisher" class="tag">{{ props.book.publisher }}</span>
        <span v-if="props.book.binding" class="tag">{{ props.book.binding }}</span>
      </div>

      <div class="price-box">
        <span class="price">¥{{ Number(props.book.price).toFixed(2) }}</span>
        <span class="stock">库存 {{ props.book.stock }} 件</span>
      </div>

      <div class="actions">
        <el-button type="primary" size="large" :loading="addingToCart" :disabled="props.book.stock === 0"
          @click="addToCart">
          {{ props.book.stock === 0 ? '已缺货' : '加入购物车' }}
        </el-button>

        <el-button size="large" :loading="favLoading" @click="toggleFavorite">
          <el-icon style="margin-right: 6px;">
            <StarFilled v-if="favorited" color="#fadb14" />
            <Star v-else />
          </el-icon>
          {{ favorited ? '已收藏' : '收藏' }}
        </el-button>
      </div>

      <ul class="specs">
        <li v-if="props.book.publisher"><span>出版社</span>{{ props.book.publisher }}</li>
        <li v-if="props.book.isbn"><span>ISBN</span>{{ props.book.isbn }}</li>
        <li v-if="props.book.pages"><span>页数</span>{{ props.book.pages }}</li>
        <li v-if="props.book.language"><span>语言</span>{{ props.book.language }}</li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.book-info {
  position: relative;
  display: flex;
  gap: 40px;
  background: #fff;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.back-btn {
  position: absolute;
  top: 16px;
  right: 16px;

  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 14px;

  border: 1px solid #e5e7eb;
  border-radius: 20px;
  background: #fff;
  color: #4b5563;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.25s ease;
}

.back-btn:hover {
  border-color: #667eea;
  color: #667eea;
  background: rgba(102, 126, 234, 0.06);
  transform: translateX(-2px);
}

.cover-wrap {
  width: 280px;
  flex-shrink: 0;
  aspect-ratio: 3 / 4;
  border-radius: 12px;
  overflow: hidden;
  background: #f0f2f5;
}

.cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.meta {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.title {
  font-size: 26px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 8px;
}

.author {
  font-size: 15px;
  color: #6b7280;
  margin: 0 0 16px;
}

.tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.tag {
  padding: 3px 12px;
  font-size: 13px;
  color: #667eea;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 12px;
}

.price-box {
  display: flex;
  align-items: baseline;
  gap: 16px;
  margin-bottom: 24px;
}

.price {
  font-size: 32px;
  font-weight: 700;
  color: #ef4444;
}

.stock {
  font-size: 14px;
  color: #9ca3af;
}

.actions {
  display: flex;
  gap: 12px;
  margin-bottom: 28px;
}

.specs {
  list-style: none;
  padding: 0;
  margin: 0;
  border-top: 1px solid #f0f2f5;
  padding-top: 20px;
}

.specs li {
  display: flex;
  font-size: 14px;
  color: #4b5563;
  margin-bottom: 10px;
}

.specs li span {
  width: 80px;
  color: #9ca3af;
}
</style>