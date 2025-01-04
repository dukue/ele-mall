<template>
  <div class="order-container">
    <el-card class="order-card">
      <!-- 搜索和筛选区域 -->
      <div class="search-box">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input
              v-model="queryInfo.query"
              :placeholder="t('order.searchPlaceholder')"
              clearable
              @clear="handleSearchClear"
            >
              <template #append>
                <el-button @click="getOrderList">
                  <el-icon><Search /></el-icon>
                </el-button>
              </template>
            </el-input>
          </el-col>
          <el-col :span="6">
            <el-select 
              v-model="queryInfo.status" 
              :placeholder="t('order.statusFilter')"
              clearable
              @change="handleStatusChange"
            >
              <el-option
                v-for="item in orderStatuses"
                :key="item.value"
                :label="t(item.label)"
                :value="item.value"
              >
                <el-tag 
                  :type="getOrderStatusType(item.value)"
                  size="small"
                  class="status-tag"
                >
                  {{ t(item.label) }}
                </el-tag>
              </el-option>
            </el-select>
          </el-col>
        </el-row>
      </div>

      <!-- 订单列表表格 -->
      <el-table 
        :data="orderList" 
        border 
        stripe
        height="calc(100vh - 360px)"
      >
        <el-table-column type="index" label="#" width="60" />
        <el-table-column prop="orderNo" :label="t('order.orderNo')" width="180" />
        <el-table-column prop="receiver" :label="t('order.recipient')" width="120" />
        <el-table-column :label="t('order.totalAmount')" width="120">
          <template #default="scope">
            ¥{{ formatAmount(scope.row.totalAmount) }}
          </template>
        </el-table-column>
        <el-table-column :label="t('order.payMethod')" width="120">
          <template #default="scope">
            {{ getLocalizedPayMethod(scope.row.payMethod) }}
          </template>
        </el-table-column>
        <el-table-column :label="t('order.status')" width="100">
          <template #default="scope">
            <el-tag :type="getOrderStatusType(scope.row.status)">
              {{ getLocalizedStatus(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" :label="t('order.createTime')" width="180">
          <template #default="scope">
            {{ formatDateTime(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column :label="t('common.operation')" width="200" fixed="right">
          <template #default="scope">
            <div class="operation-buttons">
              <el-button 
                type="primary" 
                size="small"
                @click="showOrderDetail(scope.row)"
              >
                <el-icon><View /></el-icon>
                {{ t('common.view') }}
              </el-button>
              <el-dropdown 
                v-if="canUpdateStatus(scope.row.status)"
                @command="(command) => handleStatusUpdate(scope.row, command)"
                trigger="click"
              >
                <el-button type="success" size="small">
                  <el-icon><Setting /></el-icon>
                  {{ t('common.status') }}
                  <el-icon class="el-icon--right"><ArrowDown /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item 
                      v-for="status in availableStatuses(scope.row.status)"
                      :key="status.value"
                      :command="status.value"
                    >
                      {{ t(`order.statusMap.${status.value}`) }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="queryInfo.pagenum"
          v-model:page-size="queryInfo.pagesize"
          :page-sizes="[10, 20, 30, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 订单详情对话框 -->
    <el-dialog
      :title="t('order.orderDetail')"
      v-model="detailDialogVisible"
      width="70%"
    >
      <OrderDetail
        v-if="detailDialogVisible"
        :order-data="currentOrder"
        @update="refreshOrderDetail"
      />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, View, Setting, ArrowDown } from '@element-plus/icons-vue'
import request from '@/utils/request'
import OrderDetail from './components/OrderDetail.vue'

const { t } = useI18n()

// 查询参数
const queryInfo = ref({
  query: '',
  pagenum: 1,
  pagesize: 10,
  status: ''
})

// 订单状态选项
const orderStatuses = [
  { value: 'pending', label: 'order.statusMap.pending' },
  { value: 'processing', label: 'order.statusMap.processing' },
  { value: 'completed', label: 'order.statusMap.completed' },
  { value: 'cancelled', label: 'order.statusMap.cancelled' }
]

// 数据列表
const orderList = ref([])
const total = ref(0)
const detailDialogVisible = ref(false)
const currentOrder = ref(null)

// 格式化金额
const formatAmount = (amount) => {
  return amount ? Number(amount).toFixed(2) : '0.00'
}

// 获取本地化的支付方式文本
const getLocalizedPayMethod = (method) => {
  if (!method) return ''
  return t(`order.payMethodMap.${method}`)
}

// 获取本地化的状态文本
const getLocalizedStatus = (status) => {
  if (!status) return ''
  return t(`order.statusMap.${status}`)
}

// 获取订单列表
const getOrderList = async () => {
  try {
    const params = Object.fromEntries(
      Object.entries({
        ...queryInfo.value,
        status: queryInfo.value.status || undefined,
        query: queryInfo.value.query.trim() || undefined
      }).filter(([, value]) => value !== undefined)
    )

    const { code, data, message } = await request.get('/orders', { params })
    if (code === 200 && data) {
      orderList.value = (data.orders || []).map(order => ({
        id: order.id,
        orderNo: order.orderNo || '',
        receiver: order.receiver || '',
        totalAmount: order.totalAmount || '0.00',
        payMethod: order.payMethod || '',
        status: order.status || 'pending',
        createTime: order.createTime || '',
        updateTime: order.updateTime || ''
      }))
      total.value = data.total || 0
    } else {
      ElMessage.error(message || t('order.listFailed'))
    }
  } catch (error) {
    console.error('获取订单列表失败:', error)
    ElMessage.error(t('order.listFailed'))
    orderList.value = []
    total.value = 0
  }
}

// 获取订单状态对应的类型
const getOrderStatusType = (status) => {
  const statusMap = {
    pending: 'warning',
    processing: 'primary',
    completed: 'success',
    cancelled: 'danger'
  }
  return statusMap[status] || 'info'
}

// 查看订单详情
const showOrderDetail = async (order) => {
  if (!order?.id) return
  
  try {
    const [orderRes, customsRes] = await Promise.all([
      request.get(`/orders/${order.id}`),
      request.get(`/orders/${order.id}/customs`)
    ])

    if (orderRes.code === 200 && orderRes.data) {
      currentOrder.value = {
        ...orderRes.data,
        customs: customsRes.code === 200 ? customsRes.data : null
      }
      detailDialogVisible.value = true
    } else {
      ElMessage.error(t('order.getDetailFailed'))
    }
  } catch (error) {
    console.error('获取订单详情失败:', error)
    ElMessage.error(t('order.getDetailFailed'))
  }
}

// 刷新订单详情
const refreshOrderDetail = async () => {
  if (!currentOrder.value?.id) return
  
  try {
    // 并行请求订单详情和清关状态
    const [orderRes, customsRes] = await Promise.all([
      request.get(`/orders/${currentOrder.value.id}`),
      request.get(`/orders/${currentOrder.value.id}/customs`)
    ])

    if (orderRes.code === 200 && orderRes.data) {
      // 合并订单数据和清关数据
      currentOrder.value = {
        ...orderRes.data,
        customs: customsRes.code === 200 ? customsRes.data : null
      }
    }
  } catch (error) {
    console.error('刷新订单详情失败:', error)
  }
}

// 格式化日期时间
const formatDateTime = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
}

// 分页处理
const handleSizeChange = (newSize) => {
  queryInfo.value.pagesize = newSize
  queryInfo.value.pagenum = 1
  getOrderList()
}

const handleCurrentChange = (newPage) => {
  queryInfo.value.pagenum = newPage
  getOrderList()
}

// 判断是否可以更新状态
const canUpdateStatus = (status) => {
  return ['pending', 'processing'].includes(status)
}

// 获取可用的状态选项
const availableStatuses = (currentStatus) => {
  const statusFlow = {
    pending: ['processing', 'cancelled'],
    processing: ['completed', 'cancelled']
  }
  return (statusFlow[currentStatus] || []).map(value => ({ value }))
}

// 处理状态更新
const handleStatusUpdate = async (order, newStatus) => {
  if (!order?.id) return
  
  try {
    const confirmResult = await ElMessageBox.confirm(
      t('order.confirmUpdateStatus', { status: t(`order.statusMap.${newStatus}`) }),
      t('common.confirm'),
      {
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
        type: 'warning'
      }
    )

    if (confirmResult === 'confirm') {
      const { code, message } = await request.put(`/orders/${order.id}/status`, {
        status: newStatus
      })
      if (code === 200) {
        ElMessage.success(t('order.updateStatusSuccess'))
        getOrderList() // 刷新列表
      } else {
        ElMessage.error(message || t('order.updateStatusFailed'))
      }
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('更新订单状态失败:', error)
      ElMessage.error(t('order.updateStatusFailed'))
    }
  }
}

// 状态筛选变化处理
const handleStatusChange = () => {
  queryInfo.value.pagenum = 1  // 重置页码
  getOrderList()
}

// 搜索框清空处理
const handleSearchClear = () => {
  queryInfo.value.pagenum = 1  // 重置页码
  getOrderList()
}

onMounted(() => {
  getOrderList()
})
</script>

<style scoped>
.order-container {
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.order-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.search-box {
  margin-bottom: 15px;
  .el-select {
    width: 100%;
  }
}

.el-card :deep(.el-card__body) {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 15px 20px;
}

.pagination-container {
  margin-top: 15px;
  display: flex;
  justify-content: flex-end;
  padding: 10px 0;
}

.operation-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.operation-buttons .el-button {
  padding: 8px 12px;
  min-width: 80px;
}

.el-table :deep(.el-table__fixed-right) {
  height: 100%;
  right: 0;
  background-color: #fff;
}

/* 表格样式优化 */
.el-table :deep(.el-table__row) {
  height: 50px;
}

.el-table :deep(tbody tr:hover) {
  background-color: #f5f7fa !important;
}

:deep(.status-tag) {
  width: 100%;
  text-align: center;
  margin-right: 0;
}

:deep(.el-select-dropdown__item) {
  padding: 0 10px;
}

:deep(.el-select-dropdown__item.selected) {
  font-weight: normal;
  .status-tag {
    font-weight: bold;
  }
}
</style> 