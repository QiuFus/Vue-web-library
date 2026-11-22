<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '@/api/request'

interface Notice {
  id: number
  title: string
  content: string
  type: string
  createdAt: string
}

const notices = ref<Notice[]>([])
const loading = ref(false)
const dialogVisible = ref(false)
const saving = ref(false)

const form = reactive({
  title: '',
  content: '',
  type: 'info',
})

const typeOptions = [
  { label: '普通 (蓝)', value: 'primary' },
  { label: '成功 (绿)', value: 'success' },
  { label: '警告 (黄)', value: 'warning' },
  { label: '重要 (红)', value: 'danger' },
  { label: '消息 (灰)', value: 'info' },
]

async function fetchNotices() {
  loading.value = true
  try {
    const res = await request.get('/api/notices')
    if (res.data.code === 200) {
      notices.value = res.data.data
    }
  } catch (err: any) {
    ElMessage.error(err.response?.data?.msg || '获取公告失败')
  } finally {
    loading.value = false
  }
}

function openAdd() {
  form.title = ''
  form.content = ''
  form.type = 'info'
  dialogVisible.value = true
}

async function handleSave() {
  if (!form.title.trim() || !form.content.trim()) {
    ElMessage.warning('标题和内容不能为空')
    return
  }

  saving.value = true
  try {
    const res = await request.post('/api/admin/notices', form)
    if (res.data.code === 200) {
      ElMessage.success('发布成功')
      dialogVisible.value = false
      fetchNotices()
    } else {
      ElMessage.error(res.data.msg || '发布失败')
    }
  } catch (err: any) {
    ElMessage.error(err.response?.data?.msg || '发布失败')
  } finally {
    saving.value = false
  }
}

async function handleDelete(notice: Notice) {
  try {
    await ElMessageBox.confirm(`确定删除公告《${notice.title}》吗？`, '提示', { type: 'warning' })
  } catch {
    return
  }

  try {
    const res = await request.delete(`/api/admin/notices/${notice.id}`)
    if (res.data.code === 200) {
      ElMessage.success('删除成功')
      fetchNotices()
    }
  } catch (err: any) {
    ElMessage.error(err.response?.data?.msg || '删除失败')
  }
}

function formatTime(str: string) {
  const d = new Date(str)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

onMounted(fetchNotices)
</script>

<template>
  <div class="notice-manage">
    <div class="header">
      <h2>公告管理</h2>
      <el-button type="primary" @click="openAdd">
        <el-icon><Plus /></el-icon> 发布公告
      </el-button>
    </div>

    <el-table :data="notices" v-loading="loading" stripe>
      <el-table-column prop="title" label="标题" min-width="200" />
      <el-table-column label="类型" width="120">
        <template #default="{ row }">
          <el-tag :type="row.type === 'primary' ? '' : row.type" size="small">
            {{ row.type }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="发布时间" width="180">
        <template #default="{ row }">{{ formatTime(row.createdAt) }}</template>
      </el-table-column>
      <el-table-column label="操作" width="120" fixed="right">
        <template #default="{ row }">
          <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" title="发布公告" width="520px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="标题" required>
          <el-input v-model="form.title" maxlength="100" show-word-limit />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="form.type" style="width: 100%;">
            <el-option v-for="opt in typeOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="内容" required>
          <el-input v-model="form.content" type="textarea" :rows="4" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="handleSave">发布</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.notice-manage {
  background: #fff; border-radius: 12px; padding: 24px 28px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.header {
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;
}
.header h2 { font-size: 20px; font-weight: 700; color: #1f2937; margin: 0; }
</style>