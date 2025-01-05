<template>
  <el-card class="logistics-card">
    <template #header>
      <div class="card-header">
        <span>{{ t('statistics.logistics.title') }}</span>
      </div>
    </template>

    <el-tabs v-model="activeTab">
      <!-- 物流成本统计 -->
      <el-tab-pane :label="t('statistics.logistics.cost')" name="cost">
        <el-table
          v-loading="loading.cost"
          :data="costData"
          border
          :cell-style="{ textAlign: 'center' }"
          :header-cell-style="{ textAlign: 'center', backgroundColor: '#f5f7fa' }"
          style="width: 100%"
        >
          <el-table-column
            prop="country"
            :label="t('order.tracking.destinationCountry')"
            width="180"
          />
          <el-table-column
            prop="carrier"
            :label="t('order.tracking.carrier')"
            width="180"
          />
          <el-table-column
            prop="shipmentCount"
            :label="t('statistics.logistics.shipmentCount')"
            width="120"
          />
          <el-table-column
            prop="avgCost"
            :label="t('statistics.logistics.avgCost')"
            width="150"
          >
            <template #default="{ row }">
              <span :class="{ 'high-cost': row.avgCost > 500 }">
                ¥ {{ formatNumber(row.avgCost) }}
              </span>
            </template>
          </el-table-column>
        </el-table>
        <div class="table-footer">
          <el-alert
            v-if="costData.length === 0"
            :title="t('statistics.noData')"
            type="info"
            :closable="false"
            center
          />
        </div>
      </el-tab-pane>

      <!-- 物流时效统计 -->
      <el-tab-pane :label="t('statistics.logistics.time')" name="time">
        <div v-loading="loading.time" class="chart-container">
          <line-chart :data="timeData" />
        </div>
      </el-tab-pane>

      <!-- 承运商绩效 -->
      <el-tab-pane :label="t('statistics.logistics.performance')" name="performance">
        <el-table
          v-loading="loading.performance"
          :data="performanceData"
          border
          :cell-style="{ textAlign: 'center' }"
          :header-cell-style="{ textAlign: 'center', backgroundColor: '#f5f7fa' }"
          style="width: 100%"
        >
          <el-table-column
            prop="carrier"
            :label="t('order.tracking.carrier')"
            width="180"
          />
          <el-table-column
            prop="totalShipments"
            :label="t('statistics.logistics.totalShipments')"
            width="120"
          />
          <el-table-column
            prop="deliveryRate"
            :label="t('statistics.logistics.deliveryRate')"
            width="120"
          >
            <template #default="{ row }">
              <span :class="{ 'text-success': row.deliveryRate >= 90 }">
                {{ formatPercent(row.deliveryRate) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="exceptionRate"
            :label="t('statistics.logistics.exceptionRate')"
            width="120"
          >
            <template #default="{ row }">
              <span :class="getExceptionClass(row.exceptionRate)">
                {{ formatPercent(row.exceptionRate) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="returnRate"
            :label="t('statistics.logistics.returnRate')"
            width="120"
          >
            <template #default="{ row }">
              <span :class="getReturnClass(row.returnRate)">
                {{ formatPercent(row.returnRate) }}
              </span>
            </template>
          </el-table-column>
        </el-table>
        <div class="table-footer">
          <el-alert
            v-if="performanceData.length === 0"
            :title="t('statistics.noData')"
            type="info"
            :closable="false"
            center
          />
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'
import LineChart from './LineChart.vue'

const { t } = useI18n()
const activeTab = ref('cost')

const loading = ref({
  cost: false,
  time: false,
  performance: false
})

const costData = ref([])
const timeData = ref({})
const performanceData = ref([])

// 获取物流成本数据
const getCostData = async () => {
  loading.value.cost = true
  try {
    const { code, data } = await request.get('/statistics/logistics/cost')
    console.log('物流成本原始数据:', data)
    if (code === 200) {
      // 处理数据，确保数值格式正确
      costData.value = data.map(item => ({
        ...item,
        shipmentCount: Number(item.shipmentCount || 0),
        avgCost: Number(item.avgCost || 0)
      }))
      console.log('处理后的物流成本数据:', costData.value)
    }
  } catch (error) {
    console.error('获取物流成本数据失败:', error)
    ElMessage.error(t('statistics.getDataFailed'))
  } finally {
    loading.value.cost = false
  }
}

// 获取物流时效数据
const getTimeData = async () => {
  loading.value.time = true
  try {
    const { code, data } = await request.get('/statistics/logistics/time')
    if (code === 200) {
      timeData.value = data
    }
  } catch (error) {
    console.error('获取物流时效数据失败:', error)
    ElMessage.error(t('statistics.getDataFailed'))
  } finally {
    loading.value.time = false
  }
}

// 获取承运商绩效数据
const getPerformanceData = async () => {
  loading.value.performance = true
  try {
    const { code, data } = await request.get('/statistics/logistics/carrier-performance')
    console.log('承运商绩效原始数据:', data)
    if (code === 200) {
      performanceData.value = data.map(item => ({
        ...item,
        deliveryRate: Number(item.deliveryRate || 0),
        exceptionRate: Number(item.exceptionRate || 0),
        returnRate: Number(item.returnRate || 0),
        totalShipments: Number(item.totalShipments || 0)
      }))
      console.log('处理后的承运商绩效数据:', performanceData.value)
    }
  } catch (error) {
    console.error('获取承运商绩效数据失败:', error)
    ElMessage.error(t('statistics.getDataFailed'))
  } finally {
    loading.value.performance = false
  }
}

// 格式化数字
const formatNumber = (num) => {
  return Number(num).toFixed(2)
}

// 格式化百分比
const formatPercent = (value) => {
  return `${(Number(value) || 0).toFixed(1)}%`
}

// 获取异常率样式
const getExceptionClass = (rate) => {
  rate = Number(rate) || 0
  if (rate >= 5) return 'text-danger'
  if (rate >= 3) return 'text-warning'
  return 'text-success'
}

// 获取退回率样式
const getReturnClass = (rate) => {
  rate = Number(rate) || 0
  if (rate >= 3) return 'text-danger'
  if (rate >= 1) return 'text-warning'
  return 'text-success'
}

// 监听标签页切换
watch(activeTab, (tab) => {
  switch (tab) {
    case 'cost':
      if (!costData.value.length) getCostData()
      break
    case 'time':
      if (!timeData.value.xAxis) getTimeData()
      break
    case 'performance':
      if (!performanceData.value.length) getPerformanceData()
      break
  }
})

onMounted(() => {
  getCostData()
})
</script>

<style scoped>
.logistics-card {
  margin-bottom: 20px;
}

.chart-container {
  position: relative;
  width: 100%;
  height: 350px;
}

.el-tabs__content {
  overflow: visible;
}

.el-table {
  width: 100% !important;
  margin: 20px 0;
}

.text-success {
  color: #67c23a;
}

.text-warning {
  color: #e6a23c;
}

.text-danger {
  color: #f56c6c;
}

.table-footer {
  margin-top: 20px;
  text-align: center;
}

/* 优化表格在小屏幕上的显示 */
@media screen and (max-width: 768px) {
  .el-table {
    width: 100%;
    overflow-x: auto;
  }
}

/* 高成本警告样式 */
.high-cost {
  color: #f56c6c;
  font-weight: bold;
}

/* 确保表格内容垂直居中 */
:deep(.el-table .cell) {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 优化表格在容器中的位置 */
.el-tab-pane {
  padding: 10px 0;
}
</style> 