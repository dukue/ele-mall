<template>
  <div class="inventory-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>{{ t('inventory.title') }}</span>
        </div>
      </template>

      <el-table :data="inventoryList" border stripe v-loading="loading">
        <el-table-column prop="Warehouse.code" label="仓库编码" width="120" />
        <el-table-column prop="Warehouse.name" label="仓库名称" />
        <el-table-column prop="Warehouse.location" label="仓库位置" />
        <el-table-column prop="Warehouse.country" label="国家" width="100" />
        <el-table-column prop="quantity" label="当前库存" width="120" />
        <el-table-column prop="safetyStock" label="安全库存" width="120" />
        <el-table-column prop="reservedQuantity" label="预留数量" width="120" />
        <el-table-column label="库存状态" width="120">
          <template #default="scope">
            <el-tag :type="getStockStatusType(scope.row)">
              {{ getStockStatusText(scope.row) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="t('common.operation')" width="120" fixed="right">
          <template #default="scope">
            <el-button 
              type="primary" 
              size="small" 
              @click="handleTransfer(scope.row)"
              :disabled="scope.row.quantity <= scope.row.reservedQuantity"
            >
              {{ t('inventory.transfer') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 库存调拨对话框 -->
    <el-dialog
      :title="t('inventory.transferTitle')"
      v-model="dialogVisible"
      width="500px"
    >
      <el-form
        ref="formRef"
        :model="transferForm"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item :label="t('inventory.fromWarehouse')" prop="fromWarehouseId">
          <el-input :value="selectedWarehouse?.name" disabled />
        </el-form-item>
        <el-form-item :label="t('inventory.toWarehouse')" prop="toWarehouseId">
          <el-select v-model="transferForm.toWarehouseId" style="width: 100%">
            <el-option
              v-for="item in availableWarehouses"
              :key="item.warehouseId"
              :label="item.Warehouse.name"
              :value="item.warehouseId"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('inventory.quantity')" prop="quantity">
          <el-input-number 
            v-model="transferForm.quantity" 
            :min="1" 
            :max="maxTransferQuantity"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item :label="t('inventory.reason')" prop="reason">
          <el-input 
            v-model="transferForm.reason"
            type="textarea"
            :rows="3"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">{{ t('common.cancel') }}</el-button>
          <el-button type="primary" @click="handleSubmitTransfer">
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
import { useRoute } from 'vue-router'
import request from '@/utils/request'
import { ElMessage } from 'element-plus'

const { t } = useI18n()
const route = useRoute()
const loading = ref(false)
const dialogVisible = ref(false)
const inventoryList = ref([])
const selectedWarehouse = ref(null)
const formRef = ref(null)

const transferForm = ref({
  fromWarehouseId: null,
  toWarehouseId: null,
  quantity: 1,
  reason: ''
})

// 计算可用的目标仓库列表（排除当前选中的仓库）
const availableWarehouses = computed(() => {
  return inventoryList.value.filter(item => item.warehouseId !== selectedWarehouse.value?.warehouseId)
})

// 计算最大可调拨数量
const maxTransferQuantity = computed(() => {
  if (!selectedWarehouse.value) return 0
  return selectedWarehouse.value.quantity - selectedWarehouse.value.reservedQuantity
})

// 表单验证规则
const rules = {
  toWarehouseId: [
    { required: true, message: t('validation.required', { field: t('inventory.toWarehouse') }), trigger: 'change' }
  ],
  quantity: [
    { required: true, message: t('validation.required', { field: t('inventory.quantity') }), trigger: 'blur' },
    { type: 'number', min: 1, message: t('validation.min', { field: t('inventory.quantity'), min: 1 }), trigger: 'blur' }
  ],
  reason: [
    { required: true, message: t('validation.required', { field: t('inventory.reason') }), trigger: 'blur' }
  ]
}

// 获取库存状态类型
const getStockStatusType = (row) => {
  const availableStock = row.quantity - row.reservedQuantity
  if (availableStock <= 0) return 'danger'
  if (availableStock <= row.safetyStock) return 'warning'
  return 'success'
}

// 获取库存状态文本
const getStockStatusText = (row) => {
  const availableStock = row.quantity - row.reservedQuantity
  if (availableStock <= 0) return t('inventory.outOfStock')
  if (availableStock <= row.safetyStock) return t('inventory.lowStock')
  return t('inventory.sufficient')
}

// 获取商品库存列表
const getInventoryList = async () => {
  loading.value = true
  try {
    const productId = route.params.id
    const { code, data, message } = await request.get(`/products/${productId}/inventory`)
    if (code === 200) {
      inventoryList.value = data
    } else {
      ElMessage.error(message || t('inventory.getFailed'))
    }
  } catch (error) {
    console.error('获取商品库存失败:', error)
    ElMessage.error(t('inventory.getFailed'))
  } finally {
    loading.value = false
  }
}

// 处理库存调拨
const handleTransfer = (row) => {
  selectedWarehouse.value = row
  transferForm.value = {
    fromWarehouseId: row.warehouseId,
    toWarehouseId: null,
    quantity: 1,
    reason: ''
  }
  dialogVisible.value = true
}

// 提交库存调拨
const handleSubmitTransfer = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    const productId = route.params.id
    const { code, message } = await request.put(
      `/products/${productId}/inventory/transfer`,
      transferForm.value
    )

    if (code === 200) {
      ElMessage.success(t('inventory.transferSuccess'))
      dialogVisible.value = false
      getInventoryList()
    } else {
      ElMessage.error(message || t('inventory.transferFailed'))
    }
  } catch (error) {
    console.error('库存调拨失败:', error)
    ElMessage.error(t('inventory.transferFailed'))
  }
}

// 初始化
onMounted(() => {
  getInventoryList()
})
</script>

<style scoped>
.inventory-container {
  padding: 20px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style> 