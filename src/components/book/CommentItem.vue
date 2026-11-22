<script setup lang="ts">
import type { Comment } from '@/types/book'
import { Pointer } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import  request  from '@/api/request';
import { ref } from 'vue';


const props = defineProps<{ comment: Comment }>()

// 本地点赞状态和数量
const hasLiked = ref(false)
const likeCount = ref(props.comment.likeCount)
const likeLoading = ref(false)

async function toggleLike() {
  const token = localStorage.getItem('token')
  if (!token) {
    ElMessage.warning('请先登录')
    return
  }

  likeLoading.value = true
  const newIsLike = !hasLiked.value

  try {
    const res = await request.post(`/api/comments/${props.comment.id}/like`, {
      isLike: newIsLike
    })
    if (res.data.code === 200) {
      hasLiked.value = newIsLike
      likeCount.value += newIsLike ? 1 : -1
    }
  } catch (err: any) {
    ElMessage.error(err.response?.data?.msg || '操作失败')
  } finally {
    likeLoading.value = false
  }
}

function formatTime(str: string) {
  const d = new Date(str)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
</script>

<template>
  <div class="comment-item">
    <div class="avatar">
      <img v-if="props.comment.avatarUrl" :src="props.comment.avatarUrl" alt="" />
      <span v-else>{{ props.comment.nickname?.charAt(0) || '用' }}</span>
    </div>

    <div class="body">
      <div class="top">
        <span class="nickname">{{ props.comment.nickname }}</span>
        <span class="time">{{ formatTime(props.comment.createdAt) }}</span>
      </div>

      <!-- 星级 -->
      <el-rate
        :model-value="props.comment.rating"
        disabled
        size="small"
        class="rating"
      />
      <p class="content">{{ props.comment.content }}</p>

      <div class="actions">
         <button 
          class="like-btn" 
          :class="{ 'is-liked': hasLiked }" 
          :disabled="likeLoading"
          @click="toggleLike"
        >
          <el-icon :size="16">
            <Pointer />
          </el-icon>
          <span>{{ likeCount }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.like-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border: none;
  border-radius: 14px;
  background: transparent;
  color: #9ca3af;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.like-btn:hover {
  color: #667eea;
  background: rgba(102, 126, 234, 0.08);
}

.like-btn.is-liked {
  color: #667eea;
  font-weight: 600;
}

.like-btn:active {
  transform: scale(0.95);
}

.rating {
  margin: 4px 0 6px;
}
.comment-item {
  display: flex;
  gap: 14px;
  padding: 18px 0;
  border-bottom: 1px solid #f0f2f5;
}

.comment-item:last-child {
  border-bottom: none;
}

.avatar {
  width: 42px;
  height: 42px;
  flex-shrink: 0;
  border-radius: 50%;
  overflow: hidden;
  background: #667eea;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 600;
  font-size: 16px;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.body {
  flex: 1;
}

.top {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 6px;
}

.nickname {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
}

.time {
  font-size: 12px;
  color: #9ca3af;
}

.content {
  font-size: 14px;
  line-height: 1.7;
  color: #374151;
  margin: 0 0 8px;
}

.actions {
  display: flex;
  align-items: center;
}

.like-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border: none;
  border-radius: 14px;
  background: transparent;
  color: #9ca3af;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.like-btn:hover {
  color: #667eea;
  background: rgba(102, 126, 234, 0.08);
}

.like-btn:active {
  transform: scale(0.90);
}
</style>