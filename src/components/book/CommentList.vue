<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import request from '@/api/request'
import CommentItem from './CommentItem.vue'
import type { Comment } from '@/types/book'

const props = defineProps<{ bookId: number }>()

const comments = ref<Comment[]>([])
const loading = ref(false)
const submitting = ref(false)
const content = ref('')
const rating = ref(5)

const activeTab = ref('all')
const counts = ref({ total: 0, good: 0, mid: 0, bad: 0 })

async function fetchComments() {
  loading.value = true
  try {
    const params = activeTab.value === 'all' ? {} : { type: activeTab.value }
    const res = await request.get(`/api/books/${props.bookId}/comments`, { params })
    if (res.data.code === 200) {
      comments.value = res.data.data
      counts.value = res.data.counts
    }
  } catch (err: any) {
    ElMessage.error(err.response?.data?.msg || '获取评论失败')
  } finally {
    loading.value = false
  }
}

function handleTabChange() {
  fetchComments()
}

async function handleSubmit() {
  const text = content.value.trim()
  if (!text) {
    ElMessage.warning('请输入评论内容')
    return
  }

  submitting.value = true
  try {
    const res = await request.post(`/api/books/${props.bookId}/comments`, {
      content: text,
      rating: rating.value,
    })
    if (res.data.code === 200) {
      comments.value.unshift(res.data.data)
      content.value = ''
      rating.value = 5
      ElMessage.success('评论成功')
      fetchComments()
    } else {
      ElMessage.error(res.data.msg || '评论失败')
    }
  } catch (err: any) {
    ElMessage.error(err.response?.data?.msg || '网络错误')
  } finally {
    submitting.value = false
  }
}

onMounted(fetchComments)
</script>

<template>
  <section class="comment-list">
    <div class="header">
      <h2 class="title">读者评论</h2>
      <span class="count">{{ comments.length }} 条</span>
    </div>

    <!-- 发布区 -->
    <div class="publish">

      <!-- 评分 -->
      <div class="rate-row">
        <span class="rate-label">评分：</span>
        <el-rate v-model="rating" />
      </div>

      <el-input v-model="content" type="textarea" :rows="3" maxlength="500" show-word-limit placeholder="写下你的想法..." />
      <div class="publish-actions">
        <el-button type="primary" :loading="submitting" @click="handleSubmit">
          发表评论
        </el-button>
      </div>
    </div>

    <!-- Tab -->
    <el-tabs v-model="activeTab" @tab-change="handleTabChange">
      <el-tab-pane :label="`全部 (${counts.total})`" name="all" />
      <el-tab-pane :label="`好评 (${counts.good || 0})`" name="good" />
      <el-tab-pane :label="`中评 (${counts.mid || 0})`" name="mid" />
      <el-tab-pane :label="`差评 (${counts.bad || 0})`" name="bad" />
    </el-tabs>

    <!-- 列表区 -->
    <div v-if="loading" class="state">加载中...</div>
    <div v-else-if="comments.length === 0" class="state">暂无评论，来抢沙发吧</div>
    <div v-else class="list">
      <CommentItem v-for="c in comments" :key="c.id" :comment="c" />
    </div>
  </section>
</template>

<style scoped>
.rate-row {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.rate-label {
  font-size: 14px;
  color: #4b5563;
  margin-right: 8px;
}

.comment-list {
  background: #fff;
  border-radius: 16px;
  padding: 24px 32px;
  margin-top: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.header {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 20px;
}

.title {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.count {
  font-size: 14px;
  color: #9ca3af;
}

.publish {
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #f0f2f5;
}

.publish-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}

.state {
  text-align: center;
  padding: 40px 0;
  color: #9ca3af;
  font-size: 14px;
}

.list {
  display: flex;
  flex-direction: column;
}
</style>