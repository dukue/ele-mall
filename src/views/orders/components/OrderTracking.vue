<template>
  <div class="tracking-info">
    <!-- 物流基本信息 -->
    <el-descriptions :title="t('order.tracking.title')" :column="2" border>
      <el-descriptions-item :label="t('order.tracking.trackingNo')">
        {{ trackingData?.trackingNo }}
      </el-descriptions-item>
      <el-descriptions-item :label="t('order.tracking.carrier')">
        {{ trackingData?.carrier }}
      </el-descriptions-item>
      <el-descriptions-item :label="t('order.tracking.status')">
        <el-tag :type="getStatusType(trackingData?.status)">
          {{ t(`order.tracking.statusTypes.${trackingData?.status || 'pending'}`) }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item :label="t('order.tracking.estimatedDelivery')">
        {{ formatDateTime(trackingData?.estimatedDelivery) }}
      </el-descriptions-item>
      <el-descriptions-item :label="t('order.tracking.originCountry')">
        {{ trackingData?.originCountry }}
      </el-descriptions-item>
      <el-descriptions-item :label="t('order.tracking.destinationCountry')">
        {{ trackingData?.destinationCountry }}
      </el-descriptions-item>
    </el-descriptions>

    <!-- 物流历史 -->
    <div class="tracking-history">
      <div class="section-header">
        <h3>{{ t('order.tracking.history') }}</h3>
        <el-button 
          type="primary"
          @click="updateDialogVisible = true"
          v-if="trackingData?.trackingNo"
        >
          {{ t('order.tracking.updateStatus') }}
        </el-button>
        <el-button 
          type="primary"
          @click="createDialogVisible = true"
          v-else
        >
          {{ t('order.tracking.createTracking') }}
        </el-button>
      </div>

      <el-timeline>
        <el-timeline-item
          v-for="item in historyList"
          :key="item.id"
          :timestamp="formatDateTime(item.eventTime)"
          :type="getTimelineItemType(item.status)"
        >
          <h4>{{ t(`order.tracking.statusTypes.${item.status}`) }}</h4>
          <p>{{ item.location }}</p>
          <p>{{ item.details }}</p>
        </el-timeline-item>
      </el-timeline>
    </div>

    <!-- 创建物流对话框 -->
    <el-dialog
      v-model="createDialogVisible"
      :title="t('order.tracking.createTracking')"
      width="500px"
    >
      <el-form
        ref="createFormRef"
        :model="createForm"
        :rules="createRules"
        label-width="120px"
      >
        <el-form-item :label="t('order.tracking.trackingNo')" prop="trackingNo">
          <el-input v-model="createForm.trackingNo" />
        </el-form-item>
        <el-form-item :label="t('order.tracking.carrier')" prop="carrier">
          <el-input v-model="createForm.carrier" />
        </el-form-item>
        <el-form-item :label="t('order.tracking.estimatedDelivery')" prop="estimatedDelivery">
          <el-date-picker
            v-model="createForm.estimatedDelivery"
            type="datetime"
            :placeholder="t('order.tracking.estimatedDelivery')"
          />
        </el-form-item>
        <el-form-item :label="t('order.tracking.originCountry')" prop="originCountry">
          <el-input v-model="createForm.originCountry" />
        </el-form-item>
        <el-form-item :label="t('order.tracking.destinationCountry')" prop="destinationCountry">
          <el-input v-model="createForm.destinationCountry" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="createDialogVisible = false">
          {{ t('common.cancel') }}
        </el-button>
        <el-button type="primary" @click="handleCreate">
          {{ t('common.confirm') }}
        </el-button>
      </template>
    </el-dialog>

    <!-- 更新状态对话框 -->
    <el-dialog
      v-model="updateDialogVisible"
      :title="t('order.tracking.updateStatus')"
      width="500px"
    >
      <el-form
        ref="updateFormRef"
        :model="updateForm"
        :rules="updateRules"
        label-width="120px"
      >
        <el-form-item :label="t('order.tracking.status')" prop="status">
          <el-select v-model="updateForm.status">
            <el-option
              v-for="status in statusOptions"
              :key="status"
              :label="getLocalizedStatus(status)"
              :value="status"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('order.tracking.location')" prop="location">
          <el-input v-model="updateForm.location" />
        </el-form-item>
        <el-form-item :label="t('order.tracking.details')" prop="details">
          <el-input
            v-model="updateForm.details"
            type="textarea"
            :rows="3"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="updateDialogVisible = false">
          {{ t('common.cancel') }}
        </el-button>
        <el-button type="primary" @click="handleUpdate">
          {{ t('common.confirm') }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'

const props = defineProps({
  orderId: {
    type: [String, Number],
    required: true
  }
})

const { t } = useI18n()

// 数据
const trackingData = ref(null)
const historyList = ref([])

// 对话框
const createDialogVisible = ref(false)
const updateDialogVisible = ref(false)
const createFormRef = ref(null)
const updateFormRef = ref(null)

// 表单数据
const createForm = ref({
  trackingNo: '',
  carrier: '',
  estimatedDelivery: '',
  originCountry: '',
  destinationCountry: ''
})

const updateForm = ref({
  status: '',
  location: '',
  details: '',
  eventTime: new Date().toISOString()
})

// 状态选项
const statusOptions = [
  'in_transit',    // 运输中
  'customs',       // 清关中
  'arrived',       // 已到达
  'delivered',     // 已送达
  'exception',     // 异常
  'returned'       // 已退回
]

// 表单验证规则
const createRules = {
  trackingNo: [
    { required: true, message: t('validation.required', { field: t('order.tracking.trackingNo') }), trigger: 'blur' }
  ],
  carrier: [
    { required: true, message: t('validation.required', { field: t('order.tracking.carrier') }), trigger: 'blur' }
  ],
  estimatedDelivery: [
    { required: true, message: t('validation.required', { field: t('order.tracking.estimatedDelivery') }), trigger: 'change' }
  ],
  originCountry: [
    { required: true, message: t('validation.required', { field: t('order.tracking.originCountry') }), trigger: 'blur' }
  ],
  destinationCountry: [
    { required: true, message: t('validation.required', { field: t('order.tracking.destinationCountry') }), trigger: 'blur' }
  ]
}

const updateRules = {
  status: [
    { required: true, message: t('validation.required', { field: t('order.tracking.status') }), trigger: 'change' }
  ],
  location: [
    { required: true, message: t('validation.required', { field: t('order.tracking.location') }), trigger: 'blur' }
  ],
  details: [
    { required: true, message: t('validation.required', { field: t('order.tracking.details') }), trigger: 'blur' }
  ]
}

// 获取物流信息
const getTrackingInfo = async () => {
  try {
    const { code, data } = await request.get(`/orders/${props.orderId}/tracking`)
    if (code === 200) {
      trackingData.value = data
    }
  } catch (error) {
    console.error('获取物流信息失败:', error)
  }
}

// 获取物流历史
const getTrackingHistory = async () => {
  try {
    const { code, data } = await request.get(`/orders/${props.orderId}/tracking/history`)
    if (code === 200) {
      historyList.value = data
    }
  } catch (error) {
    console.error('获取物流历史失败:', error)
  }
}

// 创建物流信息
const handleCreate = async () => {
  if (!createFormRef.value) return
  
  try {
    await createFormRef.value.validate()
    const { code, message } = await request.post(`/orders/${props.orderId}/tracking`, createForm.value)
    
    if (code === 200) {
      ElMessage.success(t('order.tracking.createSuccess'))
      createDialogVisible.value = false
      getTrackingInfo()
      getTrackingHistory()
    } else {
      ElMessage.error(message || t('order.tracking.createFailed'))
    }
  } catch (error) {
    console.error('创建物流信息失败:', error)
    ElMessage.error(t('order.tracking.createFailed'))
  }
}

// 更新物流状态
const handleUpdate = async () => {
  if (!updateFormRef.value || !trackingData.value?.trackingNo) return
  
  try {
    await updateFormRef.value.validate()
    updateForm.value.eventTime = new Date().toISOString()
    
    const { code, message } = await request.put(
      `/orders/${props.orderId}/tracking/${trackingData.value.trackingNo}`,
      updateForm.value
    )
    
    if (code === 200) {
      ElMessage.success(t('order.tracking.updateSuccess'))
      updateDialogVisible.value = false
      getTrackingInfo()
      getTrackingHistory()
    } else {
      ElMessage.error(message || t('order.tracking.updateFailed'))
    }
  } catch (error) {
    console.error('更新物流状态失败:', error)
    ElMessage.error(t('order.tracking.updateFailed'))
  }
}

// 获取状态对应的类型
const getStatusType = (status) => {
  const typeMap = {
    pending: 'info',
    in_transit: 'primary',   // 改为 primary，表示进行中
    customs: 'warning',      // warning 表示需要注意
    arrived: 'success',      // success 表示积极状态
    delivered: 'success',
    exception: 'danger',     // danger 表示问题状态
    returned: 'danger'
  }
  return typeMap[status] || 'info'
}

// 获取时间线项目的类型（保持与状态类型一致）
const getTimelineItemType = (status) => {
  return getStatusType(status)
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

// 获取本地化的状态文本
const getLocalizedStatus = (status) => {
  if (!status) return ''
  return t(`order.tracking.statusTypes.${status}`)
}

onMounted(() => {
  getTrackingInfo()
  getTrackingHistory()
})
</script>

<style scoped>
.tracking-info {
  padding: 20px;
}

.tracking-history {
  margin-top: 30px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h3 {
  margin: 0;
}

:deep(.el-timeline) {
  padding-left: 20px;
}

:deep(.el-timeline-item__content) {
  h4 {
    margin: 0 0 8px;
    font-size: 14px;
  }
  p {
    margin: 4px 0;
    color: #666;
  }
}
</style> 