<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import request from '@/api/request'
import BookInfo from '@/components/book/BookInfo.vue'
import BookIntro from '@/components/book/BookIntro.vue'
import CommentList from '@/components/book/CommentList.vue'
import type { BookDetail } from '@/types/book'

const route = useRoute()
const book = ref<BookDetail | null>(null)
const loading = ref(false)

async function fetchDetail() {
  loading.value = true
  try {
    const res = await request.get(`/api/books/${route.params.id}`)
    if (res.data.code === 200) {
      book.value = res.data.data
    } else {
      ElMessage.error(res.data.msg || '获取图书失败')
    }
  } catch (err: any) {
    ElMessage.error(err.response?.data?.msg || '网络错误')
  } finally {
    loading.value = false
  }
}

onMounted(fetchDetail)
</script>

<template>
  <div class="book-detail-page">
    <div v-if="loading" class="state">加载中...</div>
    <div v-else-if="!book" class="state">图书不存在</div>
    <div v-else class="detail-content">
      <BookInfo :book="book" />
      <BookIntro :intro="book.intro" :catalog="book.catalog" />
      <CommentList :book-id="book.id" />
    </div>
  </div>
</template>

<style scoped>
.book-detail-page {
  min-height: 100vh;
  background: #f7f8fa;
  padding-top: 64px;      
}

.detail-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px 60px;
}

.state {
  text-align: center;
  padding: 120px 0;
  color: #9ca3af;
}
</style>