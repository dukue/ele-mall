<template>
  <div class="exchange-container">
    <el-card class="exchange-card">
      <!-- 添加汇率按钮 -->
      <div class="header-actions">
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>
          {{ t('exchange.addRate') }}
        </el-button>
      </div>

      <!-- 汇率列表表格 -->
      <el-table :data="rateList" border stripe>
        <el-table-column type="index" label="#" width="60" />
        <el-table-column prop="fromCurrency" :label="t('exchange.fromCurrency')" width="120" />
        <el-table-column prop="toCurrency" :label="t('exchange.toCurrency')" width="120" />
        <el-table-column prop="rate" :label="t('exchange.rate')" width="120">
          <template #default="scope">
            {{ Number(scope.row.rate).toFixed(4) }}
          </template>
        </el-table-column>
        <el-table-column prop="isActive" :label="t('exchange.isActive')" width="120">
          <template #default="scope">
            <el-switch
              v-model="scope.row.isActive"
              @change="(val) => handleStatusChange(scope.row, val)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" :label="t('common.updateTime')" width="180">
          <template #default="scope">
            {{ formatDateTime(scope.row.updateTime) }}
          </template>
        </el-table-column>
        <el-table-column :label="t('common.operation')" width="200">
          <template #default="scope">
            <el-button 
              type="primary" 
              size="small"
              @click="handleEdit(scope.row)"
            >
              <el-icon><Edit /></el-icon>
              {{ t('common.edit') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加/编辑汇率对话框 -->
    <el-dialog
      :title="isEdit ? t('exchange.editRate') : t('exchange.addRate')"
      v-model="dialogVisible"
      width="500px"
    >
      <el-form
        ref="rateFormRef"
        :model="rateForm"
        :rules="rateRules"
        label-width="120px"
      >
        <el-form-item :label="t('exchange.fromCurrency')" prop="fromCurrency" v-if="!isEdit">
          <el-select v-model="rateForm.fromCurrency" class="w-full">
            <el-option
              v-for="currency in currencies"
              :key="currency"
              :label="currency"
              :value="currency"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('exchange.toCurrency')" prop="toCurrency" v-if="!isEdit">
          <el-select v-model="rateForm.toCurrency" class="w-full">
            <el-option
              v-for="currency in availableToCurrencies"
              :key="currency"
              :label="currency"
              :value="currency"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('exchange.rate')" prop="rate">
          <el-input-number 
            v-model="rateForm.rate"
            :precision="4"
            :step="0.1"
            :min="0"
            class="w-full"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">
            {{ t('common.cancel') }}
          </el-button>
          <el-button type="primary" @click="handleSubmit">
            {{ t('common.confirm') }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { Plus, Edit } from '@element-plus/icons-vue'
import request from '@/utils/request'

const { t } = useI18n()

// 汇率列表数据
const rateList = ref([])

// 对话框相关
const dialogVisible = ref(false)
const isEdit = ref(false)
const rateFormRef = ref(null)

// 支持的货币列表
const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CNY', 'HKD']

// 可选的目标货币（排除已选的源货币）
const availableToCurrencies = computed(() => 
  currencies.filter(c => c !== rateForm.value.fromCurrency)
)

// 表单数据
const rateForm = ref({
  fromCurrency: '',
  toCurrency: '',
  rate: 1
})

// 表单验证规则
const rateRules = {
  fromCurrency: [
    { required: true, message: t('validation.required', { field: t('exchange.fromCurrency') }), trigger: 'change' }
  ],
  toCurrency: [
    { required: true, message: t('validation.required', { field: t('exchange.toCurrency') }), trigger: 'change' }
  ],
  rate: [
    { required: true, message: t('validation.required', { field: t('exchange.rate') }), trigger: 'blur' },
    { type: 'number', min: 0, message: t('validation.min', { field: t('exchange.rate'), min: 0 }), trigger: 'blur' }
  ]
}

// 获取汇率列表
const getRateList = async () => {
  try {
    const { code, data } = await request.get('/exchange/rates')
    if (code === 200) {
      rateList.value = data || []
    }
  } catch (error) {
    console.error('获取汇率列表失败:', error)
    ElMessage.error(t('exchange.getFailed'))
  }
}

// 处理添加按钮点击
const handleAdd = () => {
  isEdit.value = false
  rateForm.value = {
    fromCurrency: '',
    toCurrency: '',
    rate: 1
  }
  dialogVisible.value = true
}

// 处理编辑按钮点击
const handleEdit = (row) => {
  isEdit.value = true
  rateForm.value = {
    id: row.id,
    fromCurrency: row.fromCurrency,
    toCurrency: row.toCurrency,
    rate: Number(row.rate)
  }
  dialogVisible.value = true
}

// 处理状态变更
const handleStatusChange = async (row, newStatus) => {
  try {
    const { code, message } = await request.put(`/exchange/rates/${row.id}`, {
      isActive: newStatus
    })
    
    if (code === 200) {
      ElMessage.success(t('exchange.statusUpdateSuccess'))
      getRateList()
    } else {
      row.isActive = !newStatus
      ElMessage.error(message || t('exchange.statusUpdateFailed'))
    }
  } catch (error) {
    console.error('更新汇率状态失败:', error)
    row.isActive = !newStatus
    ElMessage.error(t('exchange.statusUpdateFailed'))
  }
}

// 处理表单提交
const handleSubmit = async () => {
  if (!rateFormRef.value) return

  try {
    await rateFormRef.value.validate()
    
    if (isEdit.value) {
      // 编辑汇率
      const { code, message } = await request.put(`/exchange/rates/${rateForm.value.id}`, {
        rate: rateForm.value.rate
      })
      if (code === 200) {
        ElMessage.success(t('exchange.editSuccess'))
        dialogVisible.value = false
        getRateList()
      } else {
        ElMessage.error(message || t('exchange.editFailed'))
      }
    } else {
      // 添加汇率
      const { code, message } = await request.post('/exchange/rates', {
        fromCurrency: rateForm.value.fromCurrency,
        toCurrency: rateForm.value.toCurrency,
        rate: rateForm.value.rate
      })
      if (code === 200) {
        ElMessage.success(t('exchange.addSuccess'))
        dialogVisible.value = false
        getRateList()
      } else {
        ElMessage.error(message || t('exchange.addFailed'))
      }
    }
  } catch (error) {
    console.error('保存汇率失败:', error)
    ElMessage.error(isEdit.value ? t('exchange.editFailed') : t('exchange.addFailed'))
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

// 初始化
onMounted(() => {
  getRateList()
})
</script>

<style scoped>
.exchange-container {
  padding: 20px;
}

.exchange-card {
  min-height: calc(100vh - 180px);
}

.header-actions {
  margin-bottom: 20px;
}

:deep(.el-card__body) {
  padding: 20px;
}

.w-full {
  width: 100%;
}

.operation-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
}
</style> 