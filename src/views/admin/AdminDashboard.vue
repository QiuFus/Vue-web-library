<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import request from '@/api/request'
import { ElMessage } from 'element-plus'

const pieRef = ref<HTMLElement | null>(null)
const barRef = ref<HTMLElement | null>(null)
const interactRef = ref<HTMLElement | null>(null)

let pieChart: echarts.ECharts | null = null
let barChart: echarts.ECharts | null = null
let interactChart: echarts.ECharts | null = null

// 1. 分类销量占比（饼图）
async function loadPie() {
  try {
    const res = await request.get('/api/admin/stats/category-sales')
    if (res.data.code !== 200) return
    const data = res.data.data.map((r: any) => ({ name: r.category || '未分类', value: r.total_sales }))
    
    pieChart = echarts.init(pieRef.value!)
    pieChart.setOption({
      title: { text: '图书分类销量占比', left: 'center' },
      tooltip: { trigger: 'item', formatter: '{a} <br/>{b}: {c}本 ({d}%)' },
      legend: { bottom: '5%', left: 'center' },
      series: [{
        name: '销量',
        type: 'pie',
        radius: ['40%', '70%'], // 环形饼图更好看
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
        label: { show: false, position: 'center' },
        emphasis: {
          label: { show: true, fontSize: 20, fontWeight: 'bold' }
        },
        labelLine: { show: false },
        data
      }]
    })
  } catch (err: any) {
    ElMessage.error('获取分类销量失败')
  }
}

// 2. 库存告急 Top 5（横向柱状图）
async function loadBar() {
  try {
    const res = await request.get('/api/admin/stats/low-stock')
    if (res.data.code !== 200) return
    const rows = res.data.data
    
    // 横向柱状图需要把数据翻转，让最少的在最上面
    const reversedRows = rows.reverse()
    const titles = reversedRows.map((r: any) => r.title)
    const stocks = reversedRows.map((r: any) => r.stock)

    barChart = echarts.init(barRef.value!)
    barChart.setOption({
      title: { text: '库存告急 Top 5', left: 'center' },
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'value' },
      yAxis: { type: 'category', data: titles },
      series: [{
        name: '剩余库存',
        type: 'bar',
        data: stocks.map((val: number) => ({
          value: val,
          itemStyle: { color: val <= 5 ? '#f56c6c' : '#e6a23c' } // 库存低于5本变红，否则橙色
        })),
        barWidth: '50%',
        label: { show: true, position: 'right' }
      }]
    })
  } catch (err: any) {
    ElMessage.error('获取库存数据失败')
  }
}

// 3. 分类互动总量（双柱状图）
async function loadInteract() {
  try {
    const res = await request.get('/api/admin/stats/category-interaction')
    if (res.data.code !== 200) return
    const rows = res.data.data

    const categories = rows.map((r: any) => r.category)
    const favs = rows.map((r: any) => r.total_favorites)
    const comments = rows.map((r: any) => r.total_comments)

    interactChart = echarts.init(interactRef.value!)
    interactChart.setOption({
      title: { text: '各分类用户互动对比', left: 'center' },
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      legend: { top: 30 },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: categories },
      yAxis: { type: 'value' },
      series: [
        { name: '收藏量', type: 'bar', data: favs, itemStyle: { color: '#fadb14' } }, // 黄色代表收藏
        { name: '评论量', type: 'bar', data: comments, itemStyle: { color: '#409eff' } } // 蓝色代表评论
      ]
    })
  } catch (err: any) {
    ElMessage.error('获取互动数据失败')
  }
}

onMounted(async () => {
  await Promise.all([loadPie(), loadBar(), loadInteract()])
})

onUnmounted(() => {
  pieChart?.dispose()
  barChart?.dispose()
  interactChart?.dispose()
})
</script>

<template>
  <div class="dashboard">
    <h2>数据统计看板</h2>
    <div class="charts">
      <!-- 第一排：饼图和库存图 -->
      <div class="chart-row">
        <div ref="pieRef" class="chart-box half" />
        <div ref="barRef" class="chart-box half" />
      </div>
      <!-- 第二排：互动图 -->
      <div class="chart-row">
        <div ref="interactRef" class="chart-box full" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  padding: 20px;
}
.dashboard h2 {
  font-size: 20px;
  color: #1f2937;
  margin: 0 0 20px;
}
.charts {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.chart-row {
  display: flex;
  gap: 20px;
}
.chart-box {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  height: 380px;
}
.half {
  flex: 1;
  width: 50%;
}
.full {
  width: 100%;
}
</style>