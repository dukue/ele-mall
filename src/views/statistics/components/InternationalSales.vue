<template>
  <div class="international-sales">
    <el-row :gutter="20">
      <!-- 各国销售数据 -->
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>{{ t('statistics.international.byCountry') }}</span>
            </div>
          </template>
          <div class="chart-container">
            <pie-chart :data="countryData" />
          </div>
        </el-card>
      </el-col>

      <!-- 各币种销售数据 -->
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>{{ t('statistics.international.byCurrency') }}</span>
            </div>
          </template>
          <el-table
            :data="currencyData"
            border
            style="width: 100%"
          >
            <el-table-column
              prop="currency"
              :label="t('exchange.currency')"
              width="100"
            />
            <el-table-column
              prop="orderCount"
              :label="t('order.orderCount')"
              width="100"
            />
            <el-table-column
              prop="totalAmount"
              :label="t('order.amount')"
            >
              <template #default="{ row }">
                {{ row.currency }} {{ formatNumber(row.totalAmount) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="totalAmountCNY"
              :label="t('order.amountCNY')"
            >
              <template #default="{ row }">
                ¥ {{ formatNumber(row.totalAmountCNY) }}
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'
import PieChart from './PieChart.vue'

const { t } = useI18n()
const countryData = ref([])
const currencyData = ref([])

// 获取各国销售数据
const getCountrySales = async () => {
  try {
    const { code, data } = await request.get('/statistics/sales/by-country')
    if (code === 200) {
      // 转换数据格式为饼图所需格式
      countryData.value = data.map(item => ({
        name: `${item.countryName} (${item.orderCount}单)`,
        value: item.totalAmount,
        percentage: item.percentage,
        orderCount: item.orderCount,
        totalAmount: item.totalAmount
      }))
    }
  } catch (error) {
    console.error('获取各国销售数据失败:', error)
    ElMessage.error(t('statistics.getDataFailed'))
  }
}

// 获取各币种销售数据
const getCurrencySales = async () => {
  try {
    const { code, data } = await request.get('/statistics/sales/by-currency')
    if (code === 200) {
      currencyData.value = data
    }
  } catch (error) {
    console.error('获取各币种销售数据失败:', error)
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

onMounted(() => {
  getCountrySales()
  getCurrencySales()
})
</script>

<style scoped>
.international-sales {
  margin-top: 20px;
}

.chart-card {
  height: 100%;
  min-height: 400px;
}

.chart-container {
  height: 350px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style> 