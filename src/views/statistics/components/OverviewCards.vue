<template>
  <el-row :gutter="20" class="overview-cards">
    <el-col :span="6">
      <el-card shadow="hover">
        <template #header>
          <div class="card-header">
            <el-icon><Money /></el-icon>
            <span>{{ t('statistics.totalSales') }}</span>
          </div>
        </template>
        <div class="card-value">¥ {{ formatNumber(data.totalSales) }}</div>
        <div class="card-trend" :class="getTrendClass(data.trends?.sales)">
          {{ formatTrend(data.trends?.sales) }}
        </div>
      </el-card>
    </el-col>

    <el-col :span="6">
      <el-card shadow="hover">
        <template #header>
          <div class="card-header">
            <el-icon><Tickets /></el-icon>
            <span>{{ t('statistics.totalOrders') }}</span>
          </div>
        </template>
        <div class="card-value">{{ formatNumber(data.totalOrders) }}</div>
        <div class="card-trend" :class="getTrendClass(data.trends?.orders)">
          {{ formatTrend(data.trends?.orders) }}
        </div>
      </el-card>
    </el-col>

    <el-col :span="6">
      <el-card shadow="hover">
        <template #header>
          <div class="card-header">
            <el-icon><Goods /></el-icon>
            <span>{{ t('statistics.totalProducts') }}</span>
          </div>
        </template>
        <div class="card-value">{{ formatNumber(data.totalProducts) }}</div>
        <div class="card-trend" :class="getTrendClass(data.trends?.products)">
          {{ formatTrend(data.trends?.products) }}
        </div>
      </el-card>
    </el-col>

    <el-col :span="6">
      <el-card shadow="hover">
        <template #header>
          <div class="card-header">
            <el-icon><User /></el-icon>
            <span>{{ t('statistics.totalUsers') }}</span>
          </div>
        </template>
        <div class="card-value">{{ formatNumber(data.totalUsers) }}</div>
        <div class="card-trend" :class="getTrendClass(data.trends?.users)">
          {{ formatTrend(data.trends?.users) }}
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup>
import { Money, Tickets, Goods, User } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})

// 格式化数字
const formatNumber = (num) => {
  if (!num) return '0'
  return num.toLocaleString()
}

// 格式化趋势
const formatTrend = (value) => {
  if (!value) return '0%'
  return `${value > 0 ? '+' : ''}${value}%`
}

// 获取趋势样式类
const getTrendClass = (value) => {
  if (!value) return ''
  return value > 0 ? 'trend-up' : 'trend-down'
}
</script>

<style scoped>
.overview-cards {
  margin-bottom: 20px;
  display: flex;
  flex-wrap: wrap;
}

.el-col {
  margin-bottom: 20px;
}

.comparison-card {
  height: 100%;
  min-height: 180px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-value {
  font-size: 24px;
  font-weight: bold;
  margin: 10px 0;
}

.card-trend {
  font-size: 14px;
}

.trend-up {
  color: #67c23a;
}

.trend-down {
  color: #f56c6c;
}
</style> 