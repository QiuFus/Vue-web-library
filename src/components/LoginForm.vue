<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import request from '../api/request'
import { useUserStore } from '../stores/user'

const emit = defineEmits<{ (e: 'switch'): void }>()

const router = useRouter()
const userStore = useUserStore()
const formRef = ref<FormInstance>()
const loading = ref(false)

const loginForm = ref({
  username: '',
  password: ''
})

const rules: FormRules = {
  username: [
    {
      required: true,
      trigger: ['blur'],
      validator(rule, value: string, callback) {
        if (!value || !value.trim()) return callback(new Error('用户名不能为空'))
        if (!/^[a-zA-Z0-9]{4,16}$/.test(value)) return callback(new Error('用户名只能是长度为4-16位的字母和数字'))
        callback()
      }
    }
  ],
  password: [
    {
      required: true,
      trigger: ['blur'],
      validator(rule, value: string, callback) {
        if (!value) return callback(new Error('密码不能为空'))
        if (value.length < 6 || value.length > 20) return callback(new Error('密码长度需为6-20位'))
        if (!/[a-zA-Z]/.test(value) || !/[0-9]/.test(value)) return callback(new Error('密码需同时包含字母和数字'))
        callback()
      }
    }
  ]
}

function gotoHome(){
  router.push('/')
}

async function handleLogin() {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
  } catch {
    return
  }

  loading.value = true
  try {
    const res = await request.post('/api/login', loginForm.value)
    if (res.data.code === 200) {
      userStore.setLogin({
        token: res.data.token,
        user: res.data.user,
      })      
      ElMessage.success('登录成功')
      setTimeout(gotoHome,500)
      
    } else {
      ElMessage.error(res.data.msg || '登录失败')
    }
  } catch (err: any) {
    ElMessage.error(err.response?.data?.msg || '网络错误，请稍后重试')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="form-card">
    <div class="brand">
      <div class="logo">网上书城</div>
      <h1 class="title">登录</h1>
      <p class="subtitle">登录后继续你的阅读之旅</p>
    </div>

    <el-form ref="formRef" :model="loginForm" :rules="rules" label-position="top" size="large">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="loginForm.username" placeholder="请输入用户名" clearable />
      </el-form-item>

      <el-form-item label="密码" prop="password">
        <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" show-password
          @keydown.enter="handleLogin" />
      </el-form-item>

      <el-button type="primary" size="large" :loading="loading" class="submit-btn" @click="handleLogin">
        登 录
      </el-button>
    </el-form>

    <div class="footer">
      还没有账号？
      <a class="link" @click="emit('switch')">立即注册</a>
    </div>
  </div>
</template>

<style scoped>
.form-card {
  width: 420px;
  padding: 36px 32px;
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(8px) saturate(160%);
  -webkit-backdrop-filter: blur(8px) saturate(160%);
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(34, 35, 52, 0.12);
}

.brand {
  text-align: center;
  margin-bottom: 28px;
}

.logo {
  font-size: 40px;
  margin-bottom: 8px;
  color: #66c2ea;
}

.title {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 6px;
  color: #1f2937;
}

.subtitle {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.submit-btn {
  width: 100%;
  margin-top: 8px;
  border-radius: 10px;
  font-weight: 500;
  letter-spacing: 2px;
}

.footer {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: #6b7280;
}

.link {
  color: #667eea;
  font-weight: 500;
  cursor: pointer;
}

.link:hover {
  text-decoration: underline;
}
</style>