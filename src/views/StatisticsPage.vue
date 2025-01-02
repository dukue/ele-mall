<template>
  <div class="statistics-container">
    <!-- 概览数据卡片 -->
    <el-row :gutter="20">
      <el-col :span="6" v-for="(item, index) in overviewData" :key="index">
        <el-card shadow="hover" :body-style="{ padding: '20px' }">
          <div class="data-overview">
            <div class="icon-wrapper" :style="{ background: item.color }">
              <el-icon><component :is="item.icon" /></el-icon>
            </div>
            <div class="data-info">
              <div class="data-title">{{ item.title }}</div>
              <div class="data-value">{{ item.value }}</div>
              <div class="data-compare">
                较上月
                <span :class="item.trend >= 0 ? 'up' : 'down'">
                  {{ Math.abs(item.trend) }}%
                  <el-icon>
                    <component :is="item.trend >= 0 ? 'ArrowUp' : 'ArrowDown'" />
                  </el-icon>
                </span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="chart-row">
      <!-- 销售趋势图 -->
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="chart-header">
              <span>销售趋势</span>
              <el-radio-group v-model="salesTimeRange" size="small" @change="getSalesData">
                <el-radio-button label="week">本周</el-radio-button>
                <el-radio-button label="month">本月</el-radio-button>
                <el-radio-button label="year">本年</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div ref="salesChartRef" class="chart"></div>
        </el-card>
      </el-col>

      <!-- 商品分类占比图 -->
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="chart-header">
              <span>商品分类占比</span>
            </div>
          </template>
          <div ref="categoryChartRef" class="chart"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 支付方式分布 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :span="24">
        <el-card>
          <template #header>
            <div class="chart-header">
              <span>支付方式分布</span>
            </div>
          </template>
          <div ref="paymentChartRef" class="chart"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { Shop, User, Tickets, Money } from '@element-plus/icons-vue'
import request from '@/utils/request'

// 图表实例
let salesChart = null
let categoryChart = null
let paymentChart = null

// 图表容器引用
const salesChartRef = ref(null)
const categoryChartRef = ref(null)
const paymentChartRef = ref(null)

// 销售时间范围
const salesTimeRange = ref('month')

// 概览数据
const overviewData = ref([])

// 获取概览数据
const getOverviewData = async () => {
  try {
    const data = await request.get('/statistics/overview')
    overviewData.value = [
      {
        title: '总销售额',
        value: `¥${data.totalSales.toLocaleString()}`,
        trend: data.trends.sales,
        icon: Money,
        color: '#409EFF'
      },
      {
        title: '总订单数',
        value: data.totalOrders.toLocaleString(),
        trend: data.trends.orders,
        icon: Tickets,
        color: '#67C23A'
      },
      {
        title: '商品总数',
        value: data.totalProducts.toLocaleString(),
        trend: data.trends.products,
        icon: Shop,
        color: '#E6A23C'
      },
      {
        title: '用户总数',
        value: data.totalUsers.toLocaleString(),
        trend: data.trends.users,
        icon: User,
        color: '#F56C6C'
      }
    ]
  } catch (error) {
    console.error('获取概览数据失败:', error)
  }
}

// 初始化销售趋势图
const initSalesChart = () => {
  salesChart = echarts.init(salesChartRef.value)
  getSalesData()
}

// 获取销售数据
const getSalesData = async () => {
  try {
    const data = await request.get('/statistics/sales', {
      params: { range: salesTimeRange.value }
    })
    
    const option = {
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: data.xAxis
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: data.series,
        type: 'line',
        smooth: true,
        areaStyle: {}
      }]
    }
    salesChart.setOption(option)
  } catch (error) {
    console.error('获取销售数据失败:', error)
  }
}

// 初始化商品分类占比图
const initCategoryChart = async () => {
  try {
    const data = await request.get('/statistics/categories')
    categoryChart = echarts.init(categoryChartRef.value)
    const option = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          type: 'pie',
          radius: '50%',
          data: data,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    }
    categoryChart.setOption(option)
  } catch (error) {
    console.error('获取商品分类数据失败:', error)
  }
}

// 初始化支付方式分布图
const initPaymentChart = async () => {
  try {
    const data = await request.get('/statistics/payments')
    paymentChart = echarts.init(paymentChartRef.value)
    const option = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '20',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: data
        }
      ]
    }
    paymentChart.setOption(option)
  } catch (error) {
    console.error('获取支付方式数据失败:', error)
  }
}

// 监听窗口大小变化，重绘图表
const handleResize = () => {
  salesChart?.resize()
  categoryChart?.resize()
  paymentChart?.resize()
}

onMounted(() => {
  // 获取数据
  getOverviewData()
  
  // 初始化所有图表
  initSalesChart()
  initCategoryChart()
  initPaymentChart()
  
  // 添加窗口大小变化监听
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  // 销毁图表实例
  salesChart?.dispose()
  categoryChart?.dispose()
  paymentChart?.dispose()
  
  // 移除窗口大小变化监听
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.statistics-container {
  padding: 20px;
}

.chart-row {
  margin-top: 20px;
}

.data-overview {
  display: flex;
  align-items: center;
}

.icon-wrapper {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
}

.icon-wrapper :deep(.el-icon) {
  font-size: 30px;
  color: #fff;
}

.data-info {
  flex: 1;
}

.data-title {
  font-size: 14px;
  color: #909399;
}

.data-value {
  font-size: 24px;
  font-weight: bold;
  margin: 5px 0;
}

.data-compare {
  font-size: 12px;
  color: #909399;
}

.data-compare .up {
  color: #67C23A;
}

.data-compare .down {
  color: #F56C6C;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart {
  height: 300px;
}
</style> 