<script setup lang="ts">
import { ref } from 'vue'
import LoginForm from '@/components/LoginForm.vue'
import RegisterForm from '@/components/RegisterForm.vue'


const mode = ref<'login' | 'register'>('login')
</script>

<template>
  <div class="auth-page">
    <img src="../components/icons/login_background.jpeg" alt="background" style="position: absolute; width: 100%; height: auto;" />

    <div class="card-wrapper">
        <component :is="mode === 'login' ? LoginForm : RegisterForm" @switch="mode = mode === 'login' ? 'register' : 'login'" />
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  min-height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fafafa;
  overflow: hidden;
}

.card-wrapper {
  position: relative;
  z-index: 10;
}
</style>