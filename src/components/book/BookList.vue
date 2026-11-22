<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import request from '@/api/request'
import BookCard from '@/components/book/BookCard.vue'
import type { Book } from '@/types/book'

const route = useRoute()
const router = useRouter()

const books = ref<Book[]>([])
const categories = ref<string[]>([])
const loading = ref(false)

const keyword = ref((route.query.keyword as string) || '')
const activeCategory = ref((route.query.category as string) || '')
const page = ref(Number(route.query.page) || 1)
const pageSize = 20
const total = ref(0)

async function fetchCategories() {
  try {
    const res = await request.get('/api/categories')
    if (res.data.code === 200) {
      categories.value = res.data.data
    }
  } catch {
    return
  }
}

async function fetchBooks() {
  loading.value = true
  try {
    const res = await request.get('/api/books', {
      params: {
        keyword: keyword.value || undefined,
        category: activeCategory.value || undefined,
        page: page.value,
        pageSize,
      },
    })
    if (res.data.code === 200) {
      books.value = res.data.data
      total.value = res.data.total
    }
  } catch (err: any) {
    ElMessage.error(err.response?.data?.msg || '获取图书失败')
  } finally {
    loading.value = false
  }
}

// 点分类
function handleCategoryChange(cat: string) {
  activeCategory.value = cat
  page.value = 1
  updateQuery()
}

// 搜索
function handleSearch() {
  page.value = 1
  updateQuery()
}

function handlePageChange(newPage: number) {
  page.value = newPage
  updateQuery()
}

// 更新 URL query，触发重新请求
function updateQuery() {
  router.push({
    path: '/books',
    query: {
      keyword: keyword.value || undefined,
      category: activeCategory.value || undefined,
      page: page.value > 1 ? page.value : undefined,
    },
  })
}

// 监听路由 query 变化，重新请求
watch(() => route.query, () => {
  keyword.value = (route.query.keyword as string) || ''
  activeCategory.value = (route.query.category as string) || ''
  page.value = Number(route.query.page) || 1
  fetchBooks()
}, { immediate: true })

function goDetail(id: number) {
  router.push(`/book/${id}`)
}

function goBack() {
    router.push('/')
}

onMounted(fetchCategories)
</script>

<template>
  <div class="book-list-page">

    <button class="back-btn" @click="goBack">
      <el-icon :size="18">
        <ArrowLeft />
      </el-icon>
      <span>返回首页</span>
    </button>

    <!-- 搜索区 -->
    <div class="search-bar">
      <el-input
        v-model="keyword"
        placeholder="搜索书名或作者"
        clearable
        size="large"
        @keyup.enter="handleSearch"
      >
        <template #append>
          <el-button @click="handleSearch">
            <el-icon><Search /></el-icon>
          </el-button>
        </template>
      </el-input>
    </div>

    <!-- 分类筛选 -->
    <div class="category-bar">
      <span
        class="category-item"
        :class="{ active: activeCategory === '' }"
        @click="handleCategoryChange('')"
      >
        全部
      </span>
      <span
        v-for="cat in categories"
        :key="cat"
        class="category-item"
        :class="{ active: activeCategory === cat }"
        @click="handleCategoryChange(cat)"
      >
        {{ cat }}
      </span>
    </div>

    <!-- 图书网格 -->
    <div v-if="loading" class="state">加载中...</div>
    <el-empty v-else-if="books.length === 0" description="没有找到相关图书" />
    <div v-else class="book-grid">
      <BookCard
        v-for="book in books"
        :key="book.id"
        :book="book"
        @click="goDetail"
      />
    </div>

    <!-- 分页 -->
    <div v-if="total > pageSize" class="pagination">
      <el-pagination
        layout="prev, pager, next"
        :total="total"
        :page-size="pageSize"
        :current-page="page"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<style scoped>

.book-list-page {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  padding: 88px 24px 60px;
  min-height: 100vh;
  background: #f7f8fa;
}

.back-btn {
  position: absolute;
  top: 80px;
  right: 16px;

  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 14px;

  border: 1px solid #e5e7eb;
  border-radius: 20px;
  background: #fff;
  color: #4b5563;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.25s ease;
}

.back-btn:hover {
  border-color: #667eea;
  color: #667eea;
  background: rgba(102, 126, 234, 0.06);
  transform: translateX(-2px);
}

.search-bar {
  margin-bottom: 20px;
  max-width: 500px;
}

.category-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 24px;
}

.category-item {
  padding: 6px 16px;
  border-radius: 16px;
  font-size: 14px;
  color: #4b5563;
  background: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
}

.category-item:hover {
  color: #667eea;
}

.category-item.active {
  color: #fff;
  background: #667eea;
}

.state {
  text-align: center;
  padding: 60px 0;
  color: #9ca3af;
}

.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 24px;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}
</style>