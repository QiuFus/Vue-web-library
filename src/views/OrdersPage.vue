<script setup lang="ts">
import OrderList from './profile/OrderList.vue'
</script>

<template>
  <div class="orders-page">
    <div class="container">
      <OrderList />
    </div>
  </div>
</template>

<style scoped>
.orders-page {
  min-height: 100vh;
  background: #f7f8fa;
  padding-top: 64px;   
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px 60px;
  background: #fff;
  border-radius: 12px;
  margin-top: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}
</style>