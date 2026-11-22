<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import request from '@/api/request'
import BookCard from '@/components/book/BookCard.vue'
import type { Book } from '@/types/book'

const router = useRouter()
const books = ref<Book[]>([])
const loading = ref(false)

async function fetchFavorites() {
  loading.value = true
  try {
    const res = await request.get('/api/user/favorites')
    if (res.data.code === 200) {
      books.value = res.data.data
    }
  } catch (err: any) {
    ElMessage.error(err.response?.data?.msg || '获取收藏失败')
  } finally {
    loading.value = false
  }
}

function goDetail(id: number) {
  router.push(`/book/${id}`)
}

function handleFavChange(id: number, favorited: boolean) {
  if (!favorited) {
    books.value = books.value.filter(b => b.id !== id)
  }
}

onMounted(fetchFavorites)
</script>

<template>
  <div class="favorite-list">
    <h2 class="title">我的收藏</h2>

    <div v-if="loading" class="state">加载中...</div>

    <el-empty v-else-if="books.length === 0" description="还没有收藏任何书">
      <el-icon :size="48" color="#c0c4cc"><Star /></el-icon>
    </el-empty>

    <div v-else class="book-grid">
      <BookCard
        v-for="book in books"
        :key="book.id"
        :book="book"
        @click="goDetail"
        @favorite-change="handleFavChange"
      />
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

.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 20px;
}
</style>