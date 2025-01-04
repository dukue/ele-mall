<template>
  <div class="language-container">
    <el-card class="language-card">
      <!-- 添加语言按钮 -->
      <div class="header-actions">
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>
          {{ t('language.addLanguage') }}
        </el-button>
      </div>

      <!-- 语言列表表格 -->
      <el-table :data="languageList" border stripe>
        <el-table-column type="index" label="#" width="60" />
        <el-table-column prop="code" :label="t('language.code')" width="120" />
        <el-table-column prop="name" :label="t('language.name')" width="180" />
        <el-table-column prop="isDefault" :label="t('language.isDefault')" width="120">
          <template #default="scope">
            <el-tag :type="scope.row.isDefault ? 'success' : 'info'">
              {{ scope.row.isDefault ? t('common.yes') : t('common.no') }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="isActive" :label="t('language.isActive')" width="120">
          <template #default="scope">
            <el-switch
              v-model="scope.row.isDefault"
              disabled
              @change="(val) => handleStatusChange(scope.row, val)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="createTime" :label="t('common.createTime')" width="180">
          <template #default="scope">
            {{ formatDateTime(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column :label="t('common.operation')" width="200">
          <template #default="scope">
            <el-button 
              type="primary" 
              size="small"
              :disabled="scope.row.isDefault"
              @click="handleEdit(scope.row)"
            >
              <el-icon><Edit /></el-icon>
              {{ t('common.edit') }}
            </el-button>
            <el-button 
              type="danger" 
              size="small"
              :disabled="scope.row.isDefault"
              @click="handleDelete(scope.row)"
            >
              <el-icon><Delete /></el-icon>
              {{ t('common.delete') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加/编辑语言对话框 -->
    <el-dialog
      :title="isEdit ? t('language.editLanguage') : t('language.addLanguage')"
      v-model="dialogVisible"
      width="500px"
    >
      <el-form
        ref="languageFormRef"
        :model="languageForm"
        :rules="languageRules"
        label-width="100px"
      >
        <el-form-item :label="t('language.code')" prop="code" v-if="!isEdit">
          <el-input v-model="languageForm.code" />
        </el-form-item>
        <el-form-item :label="t('language.name')" prop="name">
          <el-input v-model="languageForm.name" />
        </el-form-item>
        <el-form-item :label="t('language.isDefault')" prop="isDefault">
          <el-switch v-model="languageForm.isDefault" />
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
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'
import request from '@/utils/request'
import eventBus from '@/utils/eventBus'

const { t } = useI18n()

// 语言列表数据
const languageList = ref([])

// 对话框相关
const dialogVisible = ref(false)
const isEdit = ref(false)
const languageFormRef = ref(null)

// 表单数据
const languageForm = ref({
  code: '',
  name: '',
  isDefault: false,
})

// 表单验证规则
const languageRules = {
  code: [
    { required: true, message: t('validation.required', { field: t('language.code') }), trigger: 'blur' },
    { pattern: /^[a-z]{2}$/, message: t('language.codeFormatTip'), trigger: 'blur' }
  ],
  name: [
    { required: true, message: t('validation.required', { field: t('language.name') }), trigger: 'blur' }
  ]
}

// 获取语言列表
const getLanguageList = async () => {
  try {
    const { code, data, message } = await request.get('/i18n/languages')
    if (code === 200) {
      languageList.value = data || []
    } else {
      ElMessage.error(message || t('language.getFailed'))
    }
  } catch (error) {
    console.error('获取语言列表失败:', error)
    ElMessage.error(t('language.getFailed'))
  }
}

// 处理添加语言
const handleAdd = () => {
  isEdit.value = false
  languageForm.value = {
    code: '',
    name: '',
    isDefault: false,
  }
  dialogVisible.value = true
}

// 处理编辑语言
const handleEdit = (row) => {
  isEdit.value = true
  languageForm.value = {
    id: row.id,
    code: row.code,
    name: row.name,
    isDefault: row.isDefault
  }
  dialogVisible.value = true
}

// 处理删除语言
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      t('language.deleteConfirm'),
      t('common.confirm'),
      {
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
        type: 'warning'
      }
    )

    const { code, message } = await request.delete(`/i18n/languages/${row.id}`)
    if (code === 200) {
      ElMessage.success(t('language.deleteSuccess'))
      getLanguageList()
      eventBus.emit('languages-updated')
    } else {
      ElMessage.error(message || t('language.deleteFailed'))
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除语言失败:', error)
      ElMessage.error(t('language.deleteFailed'))
    }
  }
}

// 处理状态变更
const handleStatusChange = async (row, newStatus) => {
  try {
    const { code, message } = await request.put(`/i18n/languages/${row.id}`, {
      name: row.name,
      isDefault: newStatus
    })
    
    if (code === 200) {
      ElMessage.success(t('language.statusUpdateSuccess'))
      getLanguageList()
    } else {
      row.isDefault = !newStatus
      ElMessage.error(message || t('language.statusUpdateFailed'))
    }
  } catch (error) {
    console.error('更新语言状态失败:', error)
    row.isDefault = !newStatus
    ElMessage.error(t('language.statusUpdateFailed'))
  }
}

// 处理表单提交
const handleSubmit = async () => {
  if (!languageFormRef.value) return

  try {
    await languageFormRef.value.validate()
    
    if (isEdit.value) {
      // 编辑语言
      const { code, message } = await request.put(`/i18n/languages/${languageForm.value.id}`, {
        name: languageForm.value.name,
        isDefault: languageForm.value.isDefault
      })
      if (code === 200) {
        ElMessage.success(t('language.editSuccess'))
        dialogVisible.value = false
        getLanguageList()
        eventBus.emit('languages-updated')
      } else {
        ElMessage.error(message || t('language.editFailed'))
      }
    } else {
      // 添加语言
      const { code, message } = await request.post('/i18n/languages', {
        code: languageForm.value.code,
        name: languageForm.value.name,
        isDefault: languageForm.value.isDefault
      })
      if (code === 200) {
        ElMessage.success(t('language.addSuccess'))
        dialogVisible.value = false
        getLanguageList()
        eventBus.emit('languages-updated')
      } else {
        ElMessage.error(message || t('language.addFailed'))
      }
    }
  } catch (error) {
    console.error('保存语言失败:', error)
    ElMessage.error(isEdit.value ? t('language.editFailed') : t('language.addFailed'))
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

// 刷新语言列表
const refreshLanguages = () => {
  getLanguageList()
}

// 初始化
onMounted(() => {
  getLanguageList()
  eventBus.on('languages-updated', refreshLanguages)
})

onUnmounted(() => {
  eventBus.off('languages-updated', refreshLanguages)
})
</script>

<style scoped>
.language-container {
  padding: 20px;
}

.language-card {
  min-height: calc(100vh - 180px);
}

.header-actions {
  margin-bottom: 20px;
}

:deep(.el-card__body) {
  padding: 20px;
}

.operation-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
}
</style> 