<template>
  <div class="welcome-container">
    <el-card>
      <template #header>
        <div class="welcome-header">
          <el-icon><House /></el-icon>
          <span>{{ t('common.welcome') }}</span>
        </div>
      </template>
      
      <div class="welcome-content">
        <h1>{{ t('common.systemTitle') }}</h1>
        <el-row :gutter="20" class="statistics">
          <!-- 商品总数 -->
          <el-col :span="6">
            <el-card shadow="hover">
              <template #header>
                <div class="stat-header">
                  <el-icon><Goods /></el-icon>
                  <span>{{ t('statistics.totalProducts') }}</span>
                </div>
              </template>
              <div class="stat-number">{{ overviewData.totalProducts || 0 }}</div>
            </el-card>
          </el-col>
          
          <!-- 用户总数 -->
          <el-col :span="6">
            <el-card shadow="hover">
              <template #header>
                <div class="stat-header">
                  <el-icon><User /></el-icon>
                  <span>{{ t('statistics.totalUsers') }}</span>
                </div>
              </template>
              <div class="stat-number">{{ overviewData.totalUsers || 0 }}</div>
            </el-card>
          </el-col>
          
          <!-- 订单总数 -->
          <el-col :span="6">
            <el-card shadow="hover">
              <template #header>
                <div class="stat-header">
                  <el-icon><List /></el-icon>
                  <span>{{ t('statistics.totalOrders') }}</span>
                </div>
              </template>
              <div class="stat-number">{{ overviewData.totalOrders || 0 }}</div>
            </el-card>
          </el-col>
          
          <!-- 总销售额 -->
          <el-col :span="6">
            <el-card shadow="hover">
              <template #header>
                <div class="stat-header">
                  <el-icon><Money /></el-icon>
                  <span>{{ t('statistics.totalSales') }}</span>
                </div>
              </template>
              <div class="stat-number">¥ {{ formatNumber(overviewData.totalSales) }}</div>
            </el-card>
          </el-col>
        </el-row>

        <!-- 销售趋势图 -->
        <el-card class="trend-card">
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
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { House, User, Goods, List, Money } from '@element-plus/icons-vue'
import request from '@/utils/request'
import LineChart from '@/views/statistics/components/LineChart.vue'

const { t } = useI18n()
const timeRange = ref('week')
const overviewData = ref({})
const salesData = ref({})

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

// 获取销售趋势数据
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

// 格式化数字
const formatNumber = (num) => {
  if (!num) return '0.00'
  return Number(num).toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

// 监听时间范围变化
watch(timeRange, () => {
  getSalesData()
})

onMounted(() => {
  getOverviewData()
  getSalesData()
})
</script>

<style scoped>
.welcome-container {
  padding: 20px;
  height: 100%;
  overflow-y: auto;
}

.welcome-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
}

.welcome-content {
  h1 {
    text-align: center;
    margin-bottom: 30px;
    color: var(--el-text-color-primary);
  }
}

.statistics {
  margin-bottom: 30px;
}

.stat-header {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--el-text-color-regular);
}

.stat-number {
  font-size: 24px;
  font-weight: bold;
  color: var(--el-color-primary);
  text-align: center;
  margin-top: 10px;
}

.trend-card {
  margin-top: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-wrapper {
  height: 350px;
  margin-top: 20px;
}
</style> 