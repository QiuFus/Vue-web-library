<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref, onMounted, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import request from '@/api/request'

const router=useRouter()

interface AdminBook {
  id: number
  title: string
  cover: string
  author: string
  price: string | number
  stock: number
  category?: string
  description?: string
}

const books = ref<AdminBook[]>([])
const loading = ref(false)
const keyword = ref('')

// 弹窗
const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const saving = ref(false)
const formRef = ref<FormInstance>()

const form = reactive({
  id: 0,
  title: '',
  author: '',
  cover: '',
  price: 0,
  stock: 0,
  category: '',
  description: '',
})

const rules: FormRules = {
  title: [{ required: true, message: '请输入书名', trigger: 'blur' }],
  author: [{ required: true, message: '请输入作者', trigger: 'blur' }],
  price: [{ required: true, message: '请输入价格', trigger: 'blur' }],
}

async function fetchBooks() {
  loading.value = true
  try {
    const res = await request.get('/api/admin/books', {
      params: keyword.value ? { keyword: keyword.value } : {},
    })
    if (res.data.code === 200) {
      books.value = res.data.data
    }
  } catch (err: any) {
    ElMessage.error(err.response?.data?.msg || '获取图书失败')
  } finally {
    loading.value = false
  }
}

function openAdd() {
  dialogMode.value = 'add'
  form.id = 0
  form.title = ''
  form.author = ''
  form.cover = ''
  form.price = 0
  form.stock = 0
  form.category = ''
  form.description = ''
  dialogVisible.value = true
}

function openEdit(book: AdminBook) {
  dialogMode.value = 'edit'
  form.id = book.id
  form.title = book.title
  form.author = book.author
  form.cover = book.cover
  form.price = Number(book.price)
  form.stock = book.stock
  form.category = book.category || ''
  form.description = book.description || ''
  dialogVisible.value = true
}

async function handleSave() {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
  } catch {
    return
  }

  saving.value = true
  try {
    let res
    if (dialogMode.value === 'add') {
      res = await request.post('/api/admin/books', form)
    } else {
      res = await request.put(`/api/admin/books/${form.id}`, form)
    }
    if (res.data.code === 200) {
      ElMessage.success(dialogMode.value === 'add' ? '添加成功' : '修改成功')
      dialogVisible.value = false
      fetchBooks()
    } else {
      ElMessage.error(res.data.msg || '操作失败')
    }
  } catch (err: any) {
    ElMessage.error(err.response?.data?.msg || '操作失败')
  } finally {
    saving.value = false
  }
}

async function handleDelete(book: AdminBook) {
  try {
    await ElMessageBox.confirm(`确定删除《${book.title}》吗？`, '提示', { type: 'warning' })
  } catch {
    return
  }

  try {
    const res = await request.delete(`/api/admin/books/${book.id}`)
    if (res.data.code === 200) {
      ElMessage.success('删除成功')
      fetchBooks()
    } else {
      ElMessage.error(res.data.msg || '删除失败')
    }
  } catch (err: any) {
    ElMessage.error(err.response?.data?.msg || '删除失败（可能有订单关联）')
  }
}

onMounted(fetchBooks)
</script>

<template>
  <div class="book-manage">
    <div class="header">
      <h2>图书管理</h2>
      <div class="actions">
        <el-input
          v-model="keyword"
          placeholder="搜索书名/作者"
          clearable
          @clear="fetchBooks"
          style="width: 220px; margin-right: 12px;"
          @keyup.enter="fetchBooks"
        />
        <el-button @click="fetchBooks">搜索</el-button>
        <el-button type="primary" @click="openAdd">
          <el-icon><Plus /></el-icon>
          新增图书
        </el-button>
      </div>
    </div>

    <el-table :data="books" v-loading="loading" stripe>
      <el-table-column label="封面" width="80">
        <template #default="{ row }">
          <img :src="row.cover" class="table-cover" @click="router.push(`/book/${row.id}`)"/>
        </template>
      </el-table-column>  
      <el-table-column prop="title" label="书名" min-width="160" />
      <el-table-column prop="author" label="作者" width="120" />
      <el-table-column prop="category" label="分类" width="100" />
      <el-table-column label="价格" width="100">
        <template #default="{ row }">¥{{ Number(row.price).toFixed(2) }}</template>
      </el-table-column>
      <el-table-column prop="stock" label="库存" width="80" />
      <el-table-column label="操作" width="160" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
          <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      v-model="dialogVisible"
      :title="dialogMode === 'add' ? '新增图书' : '编辑图书'"
      width="520px"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="书名" prop="title">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="作者" prop="author">
          <el-input v-model="form.author" />
        </el-form-item>
        <el-form-item label="封面">
          <el-input v-model="form.cover" placeholder="图片 URL" />
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input-number v-model="form.price" :min="0" :precision="2" />
        </el-form-item>
        <el-form-item label="库存">
          <el-input-number v-model="form.stock" :min="0" />
        </el-form-item>
        <el-form-item label="分类">
          <el-input v-model="form.category" />
        </el-form-item>
        <el-form-item label="简介">
          <el-input v-model="form.description" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.book-manage {
  background: #fff;
  border-radius: 12px;
  padding: 24px 28px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header h2 {
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.actions {
  display: flex;
  align-items: center;
}

.table-cover {
  width: 44px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
}
</style>