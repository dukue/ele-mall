<template>
  <div class="warehouse-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>{{ t('warehouse.title') }}</span>
          <el-button type="primary" @click="handleAdd">
            {{ t('common.add') }}
          </el-button>
        </div>
      </template>

      <el-table :data="warehouseList" border stripe v-loading="loading">
        <el-table-column prop="code" label="仓库编码" width="120" />
        <el-table-column prop="name" label="仓库名称" />
        <el-table-column prop="location" label="位置" />
        <el-table-column prop="country" label="国家" width="100" />
        <el-table-column prop="contact" label="联系人" width="120" />
        <el-table-column prop="phone" label="联系电话" width="150" />
        <el-table-column prop="isActive" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.isActive ? 'success' : 'warning'">
              {{ scope.row.isActive ? t('warehouse.active') : t('warehouse.inactive') }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="t('common.operation')" width="200" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleEdit(scope.row)">
              {{ t('common.edit') }}
            </el-button>
            <el-button type="danger" size="small" @click="handleDelete(scope.row)">
              {{ t('common.delete') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加/编辑对话框 -->
    <el-dialog
      :title="isEdit ? t('warehouse.edit') : t('warehouse.add')"
      v-model="dialogVisible"
      width="500px"
    >
      <el-form
        ref="formRef"
        :model="warehouseForm"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item :label="t('warehouse.code')" prop="code" v-if="!isEdit">
          <el-input v-model="warehouseForm.code" />
        </el-form-item>
        <el-form-item :label="t('warehouse.name')" prop="name">
          <el-input v-model="warehouseForm.name" />
        </el-form-item>
        <el-form-item :label="t('warehouse.location')" prop="location">
          <el-input v-model="warehouseForm.location" />
        </el-form-item>
        <el-form-item :label="t('warehouse.country')" prop="country">
          <el-input v-model="warehouseForm.country" />
        </el-form-item>
        <el-form-item :label="t('warehouse.contact')" prop="contact">
          <el-input v-model="warehouseForm.contact" />
        </el-form-item>
        <el-form-item :label="t('warehouse.phone')" prop="phone">
          <el-input v-model="warehouseForm.phone" />
        </el-form-item>
        <el-form-item :label="t('warehouse.status')" prop="isActive">
          <el-switch v-model="warehouseForm.isActive" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">{{ t('common.cancel') }}</el-button>
          <el-button type="primary" @click="handleSubmit">
            {{ t('common.confirm') }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import request from '@/utils/request'
import { ElMessage, ElMessageBox } from 'element-plus'

const { t } = useI18n()
const loading = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref(null)
const warehouseList = ref([])

// 表单数据
const warehouseForm = ref({
  code: '',
  name: '',
  location: '',
  country: '',
  contact: '',
  phone: '',
  isActive: true
})

// 表单验证规则
const rules = {
  code: [
    { required: true, message: t('validation.required', { field: t('warehouse.code') }), trigger: 'blur' },
    { min: 2, max: 20, message: t('validation.length', { min: 2, max: 20 }), trigger: 'blur' }
  ],
  name: [
    { required: true, message: t('validation.required', { field: t('warehouse.name') }), trigger: 'blur' }
  ],
  location: [
    { required: true, message: t('validation.required', { field: t('warehouse.location') }), trigger: 'blur' }
  ],
  country: [
    { required: true, message: t('validation.required', { field: t('warehouse.country') }), trigger: 'blur' }
  ],
  contact: [
    { required: true, message: t('validation.required', { field: t('warehouse.contact') }), trigger: 'blur' }
  ],
  phone: [
    { required: true, message: t('validation.required', { field: t('warehouse.phone') }), trigger: 'blur' }
  ]
}

// 获取仓库列表
const getWarehouseList = async () => {
  loading.value = true
  try {
    const { code, data, message } = await request.get('/warehouses')
    if (code === 200) {
      warehouseList.value = data
    } else {
      ElMessage.error(message || t('warehouse.listFailed'))
    }
  } catch (error) {
    console.error('获取仓库列表失败:', error)
    ElMessage.error(t('warehouse.listFailed'))
  } finally {
    loading.value = false
  }
}

// 处理添加
const handleAdd = () => {
  isEdit.value = false
  warehouseForm.value = {
    code: '',
    name: '',
    location: '',
    country: '',
    contact: '',
    phone: '',
    isActive: true
  }
  dialogVisible.value = true
}

// 处理编辑
const handleEdit = (row) => {
  isEdit.value = true
  warehouseForm.value = { ...row }
  dialogVisible.value = true
}

// 处理提交
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    let response
    if (isEdit.value) {
      response = await request.put(`/warehouses/${warehouseForm.value.id}`, warehouseForm.value)
    } else {
      response = await request.post('/warehouses', warehouseForm.value)
    }
    const { code, message } = response
    
    if (code === 200) {
      ElMessage.success(t(isEdit.value ? 'warehouse.updateSuccess' : 'warehouse.addSuccess'))
      dialogVisible.value = false
      getWarehouseList()
    } else {
      ElMessage.error(message || t(isEdit.value ? 'warehouse.updateFailed' : 'warehouse.addFailed'))
    }
  } catch (error) {
    console.error('保存仓库失败:', error)
    ElMessage.error(t(isEdit.value ? 'warehouse.updateFailed' : 'warehouse.addFailed'))
  }
}

// 处理删除
const handleDelete = (row) => {
  ElMessageBox.confirm(
    t('warehouse.deleteConfirm', { name: row.name }),
    t('common.warning'),
    {
      confirmButtonText: t('common.confirm'),
      cancelButtonText: t('common.cancel'),
      type: 'warning',
    }
  ).then(async () => {
    try {
      const { code, message } = await request.delete(`/warehouses/${row.id}`)
      if (code === 200) {
        ElMessage.success(t('warehouse.deleteSuccess'))
        getWarehouseList()
      } else {
        ElMessage.error(message || t('warehouse.deleteFailed'))
      }
    } catch (error) {
      console.error('删除仓库失败:', error)
      ElMessage.error(t('warehouse.deleteFailed'))
    }
  }).catch(() => {
    ElMessage.info(t('common.deleteCancel'))
  })
}

onMounted(() => {
  getWarehouseList()
})
</script>

<style scoped>
.warehouse-container {
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