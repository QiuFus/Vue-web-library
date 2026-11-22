<script setup lang="ts">
import { ref } from 'vue'


const banners = ref([
  { id: 1, url: 'https://t.alcy.cc/fj?random=20848', title: '新书上架' },
  { id: 2, url: 'https://t.alcy.cc/fj?random=66844', title: '限时折扣' },
  { id: 3, url: 'https://t.alcy.cc/fj?random=66321', title: '经典重读' },
])
</script>

<template>
  <div class="carousel">
    <el-carousel
      height="480px"
      direction="vertical"  
      :interval="4000"
      arrow="hover"
      indicator-position="none"
    >
      <el-carousel-item v-for="item in banners" :key="item.id">
        <div class="banner">
          <img :src="item.url" :alt="item.title" class="banner-img" />
          <div class="banner-title">{{ item.title }}</div>
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<style scoped>
.carousel {
  width: 100%;
}

.banner {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.banner-img {
  width: 100%;
  height: 100%;
  object-fit: cover;        
  display: block;
}

.banner-title {
  position: absolute;
  left: 80px;
  bottom: 80px;
  font-size: 36px;
  font-weight: 700;
  color: #fff;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  letter-spacing: 2px;
}
</style>