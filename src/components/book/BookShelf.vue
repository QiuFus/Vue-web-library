<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import request from '../../api/request.ts'
import BookCard from './BookCard.vue'
import type { Book } from '../../types/book.ts'

const router = useRouter()

const books = ref<Book[]>([])
const loading = ref(false)

async function fetchBooks() {
  loading.value = true
  try {
    const res = await request.get('/api/books')
    if (res.data.code === 200) {
      books.value = res.data.data
    } else {
      ElMessage.error(res.data.msg || '获取书籍失败')
    }
  } catch (err: any) {
    ElMessage.error(err.response?.data?.msg || '网络错误')
  } finally {
    loading.value = false
  }
}

function handleBookClick(id: number) {
  router.push(`/book/${id}`)
}
function goMore() {
  router.push('/books')
}

onMounted(fetchBooks)
</script>

<template>
  <section class="book-shelf">
    <div class="shelf-header">
      <h2 class="shelf-title">书架</h2>
      <a class="more" @click="goMore">查看更多 →</a>
    </div>

    <div v-if="loading" class="state">加载中...</div>
    <div v-else-if="books.length === 0" class="state">暂无书籍</div>
    <div v-else class="book-grid">
      <BookCard
        v-for="book in books"
        :key="book.id"
        :book="book"
        @click="handleBookClick"
      />
    </div>
  </section>
</template>

<style scoped>
.book-shelf {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px 60px;
}

.shelf-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 24px;
}

.shelf-title {
  font-size: 22px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.more {
  font-size: 14px;
  color: #667eea;
  cursor: pointer;
}

.more:hover {
  text-decoration: underline;
}

.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 24px;
}

.state {
  text-align: center;
  padding: 60px 0;
  color: #9ca3af;
  font-size: 14px;
}
</style>