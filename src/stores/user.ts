import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const token = ref<string>(localStorage.getItem('token') || '')
  const userInfo = ref<{
    role: string
    username: string
    nickname: string
    avatarUrl?: string
  } | null>(null)

  const isLoggedIn = computed(() => !!token.value)
  const nickname = computed(() => userInfo.value?.nickname || '')
  const avatarUrl = computed(() => userInfo.value?.avatarUrl || '')
  const role = computed(() => userInfo.value?.role || '')

  function setLogin(data: { token: string; user: typeof userInfo.value }) {
    token.value = data.token
    userInfo.value = data.user
    localStorage.setItem('token', data.token)
    localStorage.setItem('userInfo', JSON.stringify(data.user))
  }

  function setUserInfo(info: typeof userInfo.value) {
    userInfo.value = info
  }

  function setNickname(nickname: string) {
    if (userInfo.value) userInfo.value.nickname = nickname
  }

  function setAvatarUrl(avatarUrl: string) {
    if (userInfo.value) userInfo.value.avatarUrl = avatarUrl
  }

  function logout() {
    token.value = ''
    userInfo.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
  }

  return {
    token,
    userInfo,
    isLoggedIn,
    nickname,
    avatarUrl,
    role,
    setLogin,
    setUserInfo,
    setNickname,
    setAvatarUrl,
    logout,
  }
})