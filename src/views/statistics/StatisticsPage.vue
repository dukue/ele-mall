<template>
  <div class="statistics-container">
    <!-- 概览数据卡片 -->
    <overview-cards :data="overviewData" />
    
    <!-- 刷新按钮 -->
    <div class="refresh-container">
      <el-button 
        :icon="Refresh"
        circle
        @click="refreshData"
        :loading="loading"
      />
    </div>

    <!-- 销售趋势图表 -->
    <el-card class="chart-card">
      <template #header>
        <div class="card-header">
          <span>{{ t('statistics.salesTrend') }}</span>
          <el-radio-group v-model="timeRange" size="small">
            <el-radio-button label="week">{{ t('statistics.week') }}</el-radio-button>
            <el-radio-button label="month">{{ t('statistics.month') }}</el-radio-button>
            <el-radio-button label="year">{{ t('statistics.year') }}</el-radio-button>
          </el-radio-group>
        </div>
      </template>
      <div class="chart-wrapper">
        <line-chart :data="salesData" />
      </div>
    </el-card>

    <el-row :gutter="20">
      <!-- 商品分类统计 -->
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>{{ t('statistics.categoryDistribution') }}</span>
            </div>
          </template>
          <pie-chart :data="categoryData" />
        </el-card>
      </el-col>

      <!-- 支付方式统计 -->
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>{{ t('statistics.paymentMethods') }}</span>
            </div>
          </template>
          <pie-chart :data="paymentData" />
        </el-card>
      </el-col>
    </el-row>

    <!-- 物流数据统计 -->
    <logistics-statistics />

    <!-- 国际销售数据 -->
    <international-sales />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'
import OverviewCards from './components/OverviewCards.vue'
import LineChart from './components/LineChart.vue'
import PieChart from './components/PieChart.vue'
import LogisticsStatistics from './components/LogisticsStatistics.vue'
import InternationalSales from './components/InternationalSales.vue'
import { Refresh } from '@element-plus/icons-vue'

const { t } = useI18n()
const timeRange = ref('week')
const overviewData = ref({})
const salesData = ref({})
const categoryData = ref([])
const paymentData = ref([])
const loading = ref(false)

// 获取概览数据
const getOverviewData = async () => {
  try {
    const { code, data } = await request.get('/statistics/overview')
    if (code === 200) {
      overviewData.value = data
    }
  } catch (error) {
    console.error('获取概览数据失败:', error)
    ElMessage.error(t('statistics.getDataFailed'))
  }
}

// 获取销售数据
const getSalesData = async () => {
  try {
    const { code, data } = await request.get('/statistics/sales', {
      params: { range: timeRange.value }
    })
    if (code === 200) {
      salesData.value = data
    }
  } catch (error) {
    console.error('获取销售数据失败:', error)
    ElMessage.error(t('statistics.getDataFailed'))
  }
}

// 获取分类统计
const getCategoryData = async () => {
  try {
    const { code, data } = await request.get('/statistics/categories')
    console.log('分类统计原始数据:', data)
    if (code === 200) {
      // 计算总数
      const total = data.reduce((sum, item) => sum + item.value, 0)
      
      // 转换数据格式为饼图所需格式
      categoryData.value = data.map(item => ({
        name: item.name,
        value: item.value,
        percentage: ((item.value / total) * 100).toFixed(1),
        id: item.id
      }))
      console.log('转换后的分类数据:', categoryData.value)
    }
  } catch (error) {
    console.error('获取分类统计失败:', error)
    ElMessage.error(t('statistics.getDataFailed'))
  }
}

// 获取支付方式统计
const getPaymentData = async () => {
  try {
    const { code, data } = await request.get('/statistics/payments')
    console.log('支付方式原始数据:', data)
    if (code === 200) {
      // 计算总数
      const total = data.reduce((sum, item) => sum + item.value, 0)
      
      // 转换数据格式为饼图所需格式
      paymentData.value = data.map(item => ({
        name: item.name,
        value: item.value,
        percentage: ((item.value / total) * 100).toFixed(1),
        id: item.id
      }))
      console.log('转换后的支付方式数据:', paymentData.value)
    }
  } catch (error) {
    console.error('获取支付方式统计失败:', error)
    ElMessage.error(t('statistics.getDataFailed'))
  }
}

// 监听时间范围变化
watch(timeRange, () => {
  getSalesData()
})

// 刷新数据
const refreshData = async () => {
  if (loading.value) return
  loading.value = true
  try {
    await Promise.all([
      getOverviewData(),
      getSalesData(),
      getCategoryData(),
      getPaymentData()
    ])
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  getOverviewData()
  getSalesData()
  getCategoryData()
  getPaymentData()
})
</script>

<style scoped>
.statistics-container {
  padding: 20px;
  height: 100%;
  overflow-y: auto;
}

.chart-card {
  margin-bottom: 20px;
  min-height: 400px;
}

.chart-wrapper {
  height: 350px;
}

.chart-container {
  height: 350px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.refresh-container {
  position: fixed;
  right: 40px;
  bottom: 40px;
  z-index: 100;
}
</style> 