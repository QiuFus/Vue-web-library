<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import request from '@/api/request'
import type { Book } from '@/types/book'

const props = defineProps<{ book: Book }>()
const emit = defineEmits<{
  (e: 'click', id: number): void
  (e: 'favorite-change', id: number, favorited: boolean): void
}>()

const favorited = ref(props.book.isFavorited)
const favCount = ref(props.book.favoriteCount) 
const favLoading = ref(false)

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
      const newState = res.data.data.favorited
      favorited.value = newState
      favCount.value += newState ? 1 : -1
      ElMessage.success(res.data.msg)
      emit('favorite-change', props.book.id, favorited.value)
    }
  } catch (err: any) {
    ElMessage.error(err.response?.data?.msg || '操作失败')
  } finally {
    favLoading.value = false
  }
}
</script>

<template>
  <div class="book-card" @click="emit('click', props.book.id)">
    <div class="cover-wrap">
      <img :src="props.book.cover" :alt="props.book.title" class="cover" />

      <button class="fav-btn" :disabled="favLoading" @click.stop="toggleFavorite">
        <el-icon :color="favorited ? '#fadb14' : '#fff'" :size="16">
          <StarFilled v-if="favorited" />
          <Star v-else />
        </el-icon>
        <span class="fav-count">{{ favCount }}</span>
      </button>

      <span v-if="props.book.category" class="category">{{ props.book.category }}</span>
      <span v-if="props.book.stock === 0" class="sold-out">缺货</span>
    </div>

    <div class="info">
      <h3 class="title">{{ props.book.title }}</h3>
      <p class="author">{{ props.book.author }}</p>
      <div class="price-row">
        <span class="price">¥{{ Number(props.book.price).toFixed(2) }}</span>
        <span class="stock">库存 {{ props.book.stock }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>

.book-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.book-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 28px rgba(102, 126, 234, 0.18);
}

.cover-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 3 / 4;
  overflow: hidden;
  background: #f0f2f5;
}

.cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.4s ease;
}

.book-card:hover .cover {
  transform: scale(1.06);
}

.fav-btn {
  position: absolute;
  top: 10px;
  right: 10px;

  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;              
  border: none;
  border-radius: 14px;            
  background: rgba(0, 0, 0, 0.35);
  cursor: pointer;
  transition: all 0.25s ease;
}

.fav-btn:hover {
  background: rgba(0, 0, 0, 0.55);
  transform: scale(1.05);
}

.fav-count {
  font-size: 12px;
  color: #fff;
  font-weight: 500;
  min-width: 12px;             
  text-align: center;
}

.category {
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 2px 10px;
  font-size: 12px;
  color: #fff;
  background: rgba(102, 126, 234, 0.9);
  border-radius: 10px;
}

.sold-out {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  padding: 2px 10px;
  font-size: 12px;
  color: #fff;
  background: rgba(239, 68, 68, 0.9);
  border-radius: 10px;
}

.info {
  padding: 14px 16px 18px;
}

.title {
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 6px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.author {
  font-size: 13px;
  color: #9ca3af;
  margin: 0 0 10px;
}

.price-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.price {
  font-size: 17px;
  font-weight: 700;
  color: #ef4444;
}

.stock {
  font-size: 12px;
  color: #9ca3af;
}
</style>