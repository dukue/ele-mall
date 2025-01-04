<template>
  <div class="order-detail">
    <el-tabs v-model="activeTab">
      <el-tab-pane :label="t('order.basicInfo')" name="basic">
        <!-- 基本信息 -->
        <el-descriptions :title="t('order.basicInfo')" :column="2" border>
          <el-descriptions-item :label="t('order.orderNo')">
            {{ orderData?.orderNo }}
          </el-descriptions-item>
          <el-descriptions-item :label="t('order.status')">
            <el-tag :type="getOrderStatusType(orderData?.status)">
              {{ getLocalizedStatus(orderData?.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item :label="t('order.totalAmount')">
            ¥{{ formatAmount(orderData?.totalAmount) }}
          </el-descriptions-item>
          <el-descriptions-item :label="t('order.payMethod')">
            {{ getLocalizedPayMethod(orderData?.payMethod) }}
          </el-descriptions-item>
          <el-descriptions-item :label="t('order.createTime')">
            {{ formatDateTime(orderData?.createTime) }}
          </el-descriptions-item>
          <el-descriptions-item :label="t('order.updateTime')">
            {{ formatDateTime(orderData?.updateTime) }}
          </el-descriptions-item>
          <el-descriptions-item :label="t('customs.status')">
            <el-tag :type="getCustomsStatusType(orderData.customs?.status)">
              {{ t(`customs.statusTypes.${orderData.customs?.status || 'pending'}`) }}
            </el-tag>
            <el-button 
              type="primary" 
              link
              class="ml-2"
              @click="handleCustoms"
            >
              {{ t('common.process') }}
            </el-button>
          </el-descriptions-item>
        </el-descriptions>

        <!-- 商品信息 -->
        <div class="products-info">
          <div class="section-title">{{ t('order.products') }}</div>
          <el-table :data="orderData?.products || []" border stripe>
            <el-table-column type="index" width="60" />
            <el-table-column :label="t('product.name')" min-width="200">
              <template #default="scope">
                <el-skeleton v-if="loadingProducts[scope.row.id]" animated />
                <span v-else>{{ productNames[scope.row.id] || `${t('product.name')}${scope.row.id}` }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="t('order.unitPrice')" width="120">
              <template #default="scope">
                ¥{{ formatAmount(scope.row?.price) }}
              </template>
            </el-table-column>
            <el-table-column :label="t('order.quantity')" prop="quantity" width="100" />
            <el-table-column :label="t('order.subtotal')" width="120">
              <template #default="scope">
                ¥{{ formatAmount(scope.row?.subtotal) }}
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 收货信息 -->
        <el-descriptions :title="t('order.shippingInfo')" :column="2" border>
          <el-descriptions-item :label="t('order.recipient')">
            {{ orderData?.receiver }}
          </el-descriptions-item>
          <el-descriptions-item :label="t('order.phone')">
            {{ orderData?.phone }}
          </el-descriptions-item>
          <el-descriptions-item :label="t('order.address')" :span="2">
            {{ orderData?.address }}
          </el-descriptions-item>
        </el-descriptions>

        <!-- 清关处理对话框 -->
        <el-dialog
          v-model="customsDialogVisible"
          :title="t('customs.status')"
          width="80%"
          destroy-on-close
        >
          <CustomsClearance 
            :order-id="orderData.id"
            @update="refreshOrderData"
          />
        </el-dialog>
      </el-tab-pane>
      <el-tab-pane :label="t('order.tracking.title')" name="tracking">
        <OrderTracking :order-id="orderData.id" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import request from '@/utils/request'
import CustomsClearance from '@/views/customs/components/CustomsClearance.vue'
import OrderTracking from './OrderTracking.vue'

const { t } = useI18n()

// eslint-disable-next-line no-undef
const props = defineProps({
  orderData: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update'])

// 商品名称缓存
const productNames = ref({})
const loadingProducts = ref({})
const customsDialogVisible = ref(false)
const activeTab = ref('basic')

// 刷新订单数据
const refreshOrderData = async () => {
  emit('update')  // 通知父组件更新订单列表
}

// 监听订单数据变化，获取商品名称
watch(() => props.orderData?.products, async (products) => {
  if (!products?.length) return
  
  for (const product of products) {
    if (!product.id || productNames.value[product.id]) continue
    loadingProducts.value[product.id] = true
    try {
      const { code, data } = await request.get(`/products/${product.id}`)
      if (code === 200 && data) {
        productNames.value[product.id] = data.name
      }
    } catch (error) {
      console.error('获取商品名称失败:', error)
    } finally {
      loadingProducts.value[product.id] = false
    }
  }
}, { immediate: true })

// 格式化金额
const formatAmount = (amount) => {
  const num = parseFloat(amount)
  return isNaN(num) ? '0.00' : num.toFixed(2)
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

// 获取订单状态对应的类型
const getOrderStatusType = (status) => {
  const statusMap = {
    pending: 'warning',
    processing: 'primary',
    shipped: 'success',
    delivered: 'success',
    cancelled: 'danger'
  }
  return statusMap[status] || 'info'
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

// 获取清关状态对应的标签类型
const getCustomsStatusType = (status) => {
  const typeMap = {
    pending: 'info',
    submitted: 'warning',
    inspecting: 'warning',
    approved: 'success',
    completed: 'success',
    rejected: 'danger'
  }
  return typeMap[status] || 'info'
}

// 处理清关
const handleCustoms = () => {
  customsDialogVisible.value = true
}
</script>

<style scoped>
.order-detail {
  padding: 20px;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  margin: 20px 0;
  padding-left: 10px;
  border-left: 4px solid #409EFF;
}

.products-info {
  margin: 20px 0;
}

:deep(.el-descriptions) {
  margin-bottom: 20px;
}

:deep(.el-descriptions__title) {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 15px;
}

:deep(.el-descriptions__label) {
  font-weight: bold;
}

.el-tag {
  font-weight: normal;
}

.ml-2 {
  margin-left: 8px;
}
</style> 