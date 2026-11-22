<script setup lang="ts">
import AppCarousel from '../components/home/AppCarousel.vue'
import BookShelf from '../components/book/BookShelf.vue';
import AppFooter from '@/components/layout/AppFooter.vue';

</script>

<template>
  <div class="home-page">

    <main class="home-main">
      <AppCarousel />
      <BookShelf />
      <AppFooter/>
    </main>
  </div>
</template>

<style scoped>
.home-page {
  min-height: 100vh;
  background: #f7f8fa;
}

.home-main {
  width: 100%;
}
</style>