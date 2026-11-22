<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import {useRouter} from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import request from '@/api/request'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const router=useRouter()

const loading = ref(false)
const saving = ref(false)
const uploadingAvatar = ref(false)

const profile = ref({
  username: '',
  nickname: '',
  avatarUrl: '',
  role: '',
  createdAt: '',
})

const editing = ref(false)
const editForm = ref({ nickname: '' })

const fileInput = ref<HTMLInputElement | null>(null)

async function fetchProfile() {
  loading.value = true
  try {
    const res = await request.get('/api/user/profile')
    if (res.data.code === 200) {
      profile.value = res.data.data
      editForm.value.nickname = res.data.data.nickname
      // 同步 store
      userStore.setUserInfo({
        role: res.data.data.role,
        username: res.data.data.username,
        nickname: res.data.data.nickname,
        avatarUrl: res.data.data.avatarUrl,
      })
    }
  } catch (err: any) {
    ElMessage.error(err.response?.data?.msg || '获取个人信息失败')
  } finally {
    loading.value = false
  }
}

function triggerAvatarUpload() {
  fileInput.value?.click()
}

async function handleAvatarChange(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  // 前端基础校验
  if (!file.type.startsWith('image/')) {
    ElMessage.warning('只能上传图片')
    input.value = ''
    return
  }
  if (file.size > 10 * 1024 * 1024) {
    ElMessage.warning('图片不能超过 10MB')
    input.value = ''
    return
  }

  uploadingAvatar.value = true
  const formData = new FormData()
  formData.append('file', file)

  try {
    const res = await request.post('/api/user/avatar', formData)
    if (res.data.code === 200) {
      const newUrl = res.data.data.avatarUrl
      profile.value.avatarUrl = newUrl
      userStore.setAvatarUrl(newUrl)
      ElMessage.success('头像更新成功')
    } else {
      ElMessage.error(res.data.msg || '上传失败')
    }
  } catch (err: any) {
    ElMessage.error(err.response?.data?.msg || '上传失败')
  } finally {
    uploadingAvatar.value = false
    input.value = ''
  }
}

function startEdit() {
  editForm.value.nickname = profile.value.nickname
  editing.value = true
}

function cancelEdit() {
  editing.value = false
}

async function saveNickname() {
  const nickname = editForm.value.nickname.trim()
  if (!nickname) {
    ElMessage.warning('昵称不能为空')
    return
  }
  if (nickname.length > 20) {
    ElMessage.warning('昵称不能超过 20 字')
    return
  }

  saving.value = true
  try {
    const res = await request.put('/api/user/profile', { nickname })
    if (res.data.code === 200) {
      profile.value.nickname = nickname
      editing.value = false
      // 同步 store
      userStore.setNickname(nickname)
      ElMessage.success('修改成功')
    } else {
      ElMessage.error(res.data.msg || '修改失败')
    }
  } catch (err: any) {
    ElMessage.error(err.response?.data?.msg || '网络错误')
  } finally {
    saving.value = false
  }
}

function formatDate(str: string) {
  if (!str) return ''
  const d = new Date(str)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// 修改密码
const pwdDialogVisible = ref(false)
const pwdFormRef = ref<FormInstance>()
const pwdSaving = ref(false)
const pwdForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const pwdRules: FormRules = {
  oldPassword: [
    { required: true, message: '请输入原密码', trigger: 'blur' },
  ],
  newPassword: [
    {
      required: true,
      trigger: 'blur',
      validator: (rule, value, callback) => {
        if (!value) return callback(new Error('请输入新密码'))
        if (value.length < 6 || value.length > 20) {
          return callback(new Error('密码长度需为 6-20 位'))
        }
        callback()
      },
    },
  ],
  confirmPassword: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== pwdForm.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
}

function openPwdDialog() {
  pwdForm.oldPassword = ''
  pwdForm.newPassword = ''
  pwdForm.confirmPassword = ''
  pwdDialogVisible.value = true
}

async function submitPwdChange() {
  if (!pwdFormRef.value) return
  try {
    await pwdFormRef.value.validate()
  } catch {
    return
  }

  pwdSaving.value = true
  try {
    const res = await request.put('/api/user/password', {
      oldPassword: pwdForm.oldPassword,
      newPassword: pwdForm.newPassword,
    })
    if (res.data.code === 200) {
      ElMessage.success('密码修改成功，请重新登录')
      pwdDialogVisible.value = false
      // 密码改了，token 可能失效，退出登录
      setTimeout(() => {
        userStore.logout()
        window.location.replace('/auth')
      }, 800)
    } else {
      ElMessage.error(res.data.msg || '修改失败')
    }
  } catch (err: any) {
    ElMessage.error(err.response?.data?.msg || '网络错误')
  } finally {
    pwdSaving.value = false
  }
}

const logoutDialogVisible = ref(false)
const logoutFormRef = ref<FormInstance>()
const logoutSaving = ref(false)
const logoutForm = reactive({
  password: '',
})

const logoutRules: FormRules = {
  password: [{ required: true, message: '请输入登录密码以确认退出', trigger: 'blur' }],
}

function openLogoutDialog() {
  logoutForm.password = ''
  logoutDialogVisible.value = true
}

async function submitLogout() {
  if (!logoutFormRef.value) return
  try {
    await logoutFormRef.value.validate()
  } catch {
    return
  }

  logoutSaving.value = true
  try {
    const res = await request.post('/api/user/logout', {
      password: logoutForm.password,
    })
    if (res.data.code === 200) {
      ElMessage.success('已安全退出')
      logoutDialogVisible.value = false
      userStore.logout()
      router.replace('/auth')
    } else {
      ElMessage.error(res.data.msg || '退出失败')
    }
  } catch (err: any) {
    ElMessage.error(err.response?.data?.msg || '网络错误')
  } finally {
    logoutSaving.value = false
  }
}

onMounted(fetchProfile)
</script>

<template>
  <div class="profile-info">
    <h2 class="title">个人信息</h2>

    <div v-if="loading" class="state">加载中...</div>

    <div v-else class="info-body">
      <!-- 头像区 -->
      <div class="avatar-section">
        <div class="avatar-wrap" @click="triggerAvatarUpload">
          <el-avatar :size="96" :src="profile.avatarUrl">
            {{ profile.nickname?.charAt(0) || '用' }}
          </el-avatar>
          <div class="avatar-mask" v-loading="uploadingAvatar">
            <el-icon>
              <Camera />
            </el-icon>
          </div>
        </div>
        <p class="hint">点击更换头像</p>
        <input ref="fileInput" type="file" accept="image/*" style="display: none" @change="handleAvatarChange" />
      </div>

      <!-- 信息列表 -->
      <el-descriptions :column="1" border class="desc">
        <el-descriptions-item label="用户名">
          {{ profile.username }}
        </el-descriptions-item>

        <el-descriptions-item label="昵称">
          <template v-if="!editing">
            <span>{{ profile.nickname }}</span>
            <el-button link type="primary" class="edit-btn" @click="startEdit">
              修改
            </el-button>
          </template>

          <template v-else>
            <el-input v-model="editForm.nickname" maxlength="20" style="width: 240px; margin-right: 8px;" />
            <el-button type="primary" size="small" :loading="saving" @click="saveNickname">
              保存
            </el-button>
            <el-button size="small" @click="cancelEdit">取消</el-button>
          </template>
        </el-descriptions-item>

        <el-descriptions-item label="角色">
          <el-tag :type="profile.role === '管理员' ? 'danger' : 'info'">
            {{ profile.role }}
          </el-tag>
        </el-descriptions-item>

        <el-descriptions-item label="注册时间">
          {{ formatDate(profile.createdAt) }}
        </el-descriptions-item>
      </el-descriptions>

      <div class="pwd-section">
        <el-button type="primary" plain @click="openPwdDialog">
          修改密码
        </el-button>
        <el-button type="danger" plain @click="openLogoutDialog" style="margin-left: 12px;">
          退出登录
        </el-button>
      </div>

      <!-- 修改密码弹窗 -->
      <el-dialog v-model="pwdDialogVisible" title="修改密码" width="420px">
        <el-form ref="pwdFormRef" :model="pwdForm" :rules="pwdRules" label-width="90px">
          <el-form-item label="原密码" prop="oldPassword">
            <el-input v-model="pwdForm.oldPassword" type="password" show-password placeholder="请输入原密码" />
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword">
            <el-input v-model="pwdForm.newPassword" type="password" show-password placeholder="6-20 位" />
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input v-model="pwdForm.confirmPassword" type="password" show-password placeholder="再次输入新密码" />
          </el-form-item>
        </el-form>

        <template #footer>
          <el-button @click="pwdDialogVisible = false">取消</el-button>
          <el-button type="primary" :loading="pwdSaving" @click="submitPwdChange">
            确认修改
          </el-button>
        </template>
      </el-dialog>

      <!-- 退出登录弹窗 -->
      <el-dialog v-model="logoutDialogVisible" title="退出登录" width="400px">
        <p class="logout-tip">为了保护您的账号安全，退出前请输入登录密码：</p>
        <el-form ref="logoutFormRef" :model="logoutForm" :rules="logoutRules" label-width="0">
          <el-form-item prop="password">
            <el-input v-model="logoutForm.password" type="password" show-password placeholder="请输入登录密码" />
          </el-form-item>
        </el-form>

        <template #footer>
          <el-button @click="logoutDialogVisible = false">取消</el-button>
          <el-button type="danger" :loading="logoutSaving" @click="submitLogout">
            确认退出
          </el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<style scoped>
.pwd-section {
  margin-top: 24px;
}

.title {
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 24px;
}

.state {
  text-align: center;
  padding: 60px 0;
  color: #9ca3af;
}

.avatar-section {
  text-align: center;
  margin-bottom: 28px;
}

.avatar-wrap {
  position: relative;
  display: inline-block;
  cursor: pointer;
  border-radius: 50%;
  overflow: hidden;
}

.avatar-mask {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  opacity: 0;
  transition: opacity 0.25s ease;
}

.avatar-wrap:hover .avatar-mask {
  opacity: 1;
}

.hint {
  font-size: 12px;
  color: #9ca3af;
  margin: 8px 0 0;
}

.desc {
  max-width: 600px;
}

.edit-btn {
  margin-left: 10px;
}

.pwd-section {
  margin-top: 24px;
}

.logout-tip {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 16px;
}
</style>