<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  intro?: string
  catalog?: string
}>()

const activeTab = ref('intro')
</script>

<template>
  <section class="book-intro">
    <el-tabs v-model="activeTab">
      <el-tab-pane label="内容简介" name="intro">
        <p class="intro-text">{{ props.intro || '暂无简介' }}</p>
      </el-tab-pane>
      <el-tab-pane label="目录" name="catalog">
        <pre class="catalog-text">{{ props.catalog || '暂无目录' }}</pre>
      </el-tab-pane>
    </el-tabs>
  </section>
</template>

<style scoped>
.book-intro {
  background: #fff;
  border-radius: 16px;
  padding: 24px 32px;
  margin-top: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.intro-text {
  font-size: 15px;
  line-height: 1.9;
  color: #374151;
  white-space: pre-wrap;   /* 保留换行 */
  margin: 0;
}

.catalog-text {
  font-size: 14px;
  line-height: 2;
  color: #4b5563;
  white-space: pre-wrap;
  font-family: inherit;     /* 用正文字体，不用等宽 */
  margin: 0;
}
</style>