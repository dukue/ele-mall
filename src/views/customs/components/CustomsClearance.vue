<template>
  <div class="customs-clearance">
    <!-- 状态信息 -->
    <el-form 
      ref="formRef"
      :model="updateForm"
      :rules="rules"
      label-width="120px"
    >
      <el-form-item :label="t('customs.status')" prop="status">
        <el-select v-model="updateForm.status">
          <el-option
            v-for="status in statusOptions"
            :key="status"
            :label="t(`customs.statusTypes.${status}`)"
            :value="status"
          />
        </el-select>
      </el-form-item>
      
      <el-form-item :label="t('customs.declarationNo')" prop="declarationNo">
        <el-input v-model="updateForm.declarationNo" />
      </el-form-item>
      
      <el-form-item :label="t('customs.customsOffice')" prop="customsOffice">
        <el-input v-model="updateForm.customsOffice" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="handleUpdate">
          {{ t('customs.updateStatus') }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 文件列表 -->
    <div class="documents-section">
      <div class="section-header">
        <h3>{{ t('customs.documents') }}</h3>
        <el-button type="primary" @click="uploadDialogVisible = true">
          {{ t('customs.uploadDocument') }}
        </el-button>
      </div>

      <el-table :data="documents" border stripe>
        <el-table-column prop="name" :label="t('customs.documentName')" />
        <el-table-column prop="type" :label="t('customs.documentType')">
          <template #default="scope">
            {{ t(`customs.documentTypes.${scope.row.type}`) }}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" :label="t('common.createTime')" />
        <el-table-column :label="t('common.operation')" width="150">
          <template #default="scope">
            <el-button 
              type="primary" 
              link
              @click="handleDownload(scope.row)"
            >
              <el-icon><Download /></el-icon>
              {{ t('common.download') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 上传文件对话框 -->
    <el-dialog
      v-model="uploadDialogVisible"
      :title="t('customs.uploadDocument')"
      width="500px"
    >
      <el-form :model="uploadForm" :rules="uploadRules" ref="uploadFormRef" label-width="120px">
        <el-form-item :label="t('customs.documentType')" prop="type">
          <el-select v-model="uploadForm.type">
            <el-option
              v-for="type in documentTypes"
              :key="type"
              :label="t(`customs.documentTypes.${type}`)"
              :value="type"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item :label="t('customs.documentName')" prop="name">
          <el-input v-model="uploadForm.name" />
        </el-form-item>

        <el-form-item :label="t('common.file')" prop="file">
          <el-upload
            ref="uploadRef"
            :action="`${request.defaults.baseURL}/orders/${props.orderId}/customs/documents`"
            :headers="headers"
            :before-upload="handleBeforeUpload"
            :on-progress="handleProgress"
            :on-success="handleSuccess"
            :on-error="handleError"
            :data="uploadForm"
            :auto-upload="false"
            :limit="1"
            :accept="acceptFileTypes"
          >
            <template #trigger>
              <el-button type="primary">
                <el-icon><Upload /></el-icon>
                {{ t('common.selectFile') }}
              </el-button>
            </template>
            <template #tip>
              <p class="el-upload__tip">
                {{ t('customs.uploadTip') }}
              </p>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      
      <el-progress
        v-if="uploadProgress > 0 && uploadProgress < 100"
        :percentage="uploadProgress"
        :format="progressFormat"
      />
      
      <template #footer>
        <el-button @click="closeUploadDialog">
          {{ t('common.cancel') }}
        </el-button>
        <el-button 
          type="primary" 
          @click="handleUpload"
          :loading="uploading"
        >
          {{ t('common.confirm') }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Upload, Download } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'

const props = defineProps({
  orderId: {
    type: [String, Number],
    required: true
  }
})

const emit = defineEmits(['update'])

const { t } = useI18n()
const formRef = ref(null)
const uploadRef = ref(null)
const documents = ref([])
const customsData = ref(null)
const uploadDialogVisible = ref(false)

const updateForm = ref({
  status: '',
  declarationNo: '',
  customsOffice: ''
})

const uploadForm = ref({
  type: '',
  name: ''
})

const rules = {
  status: [{ required: true, message: t('validation.required', { field: t('customs.status') }), trigger: 'change' }]
}

const uploadFormRef = ref(null)
const uploadProgress = ref(0)
const uploading = ref(false)

// 上传表单验证规则
const uploadRules = {
  type: [
    { required: true, message: t('validation.required', { field: t('customs.documentType') }), trigger: 'change' }
  ],
  name: [
    { required: true, message: t('validation.required', { field: t('customs.documentName') }), trigger: 'blur' },
    { min: 2, max: 50, message: t('validation.length', { min: 2, max: 50 }), trigger: 'blur' }
  ]
}

// 允许上传的文件类型
const acceptFileTypes = '.pdf,.doc,.docx,.jpg,.jpeg,.png'

// 获取上传请求头
const headers = computed(() => ({
  Authorization: `Bearer ${sessionStorage.getItem('token')}`
}))

// 上传前验证
const handleBeforeUpload = (file) => {
  const isValidType = acceptFileTypes.split(',').some(type => 
    file.name.toLowerCase().endsWith(type.toLowerCase())
  )
  
  if (!isValidType) {
    ElMessage.error(t('customs.invalidFileType'))
    return false
  }
  
  const isLt10M = file.size / 1024 / 1024 < 10
  
  if (!isLt10M) {
    ElMessage.error(t('customs.fileSizeLimit'))
    return false
  }
  
  return true
}

// 处理上传进度
const handleProgress = (event) => {
  uploadProgress.value = Math.round(event.percent)
}

// 格式化进度显示
const progressFormat = (percentage) => {
  return percentage === 100 ? t('customs.uploadComplete') : `${percentage}%`
}

// 上传成功处理
const handleSuccess = (response) => {
  if (response.code === 200) {
    ElMessage.success(t('customs.uploadSuccess'))
    closeUploadDialog()
    getDocuments()
  } else {
    ElMessage.error(response.message || t('customs.uploadFailed'))
  }
  uploading.value = false
  uploadProgress.value = 0
}

// 上传失败处理
const handleError = () => {
  ElMessage.error(t('customs.uploadFailed'))
  uploading.value = false
  uploadProgress.value = 0
}

// 处理上传
const handleUpload = async () => {
  if (!uploadFormRef.value) return
  
  try {
    await uploadFormRef.value.validate()
    uploading.value = true
    uploadRef.value?.submit()
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

// 关闭上传对话框
const closeUploadDialog = () => {
  uploadDialogVisible.value = false
  uploadForm.value = {
    type: '',
    name: ''
  }
  uploadProgress.value = 0
  uploading.value = false
  if (uploadFormRef.value) {
    uploadFormRef.value.resetFields()
  }
  if (uploadRef.value) {
    uploadRef.value.clearFiles()
  }
}

// 获取清关状态
const getCustomsData = async () => {
  try {
    const { code, data } = await request.get(`/orders/${props.orderId}/customs`)
    if (code === 200) {
      customsData.value = data
      updateForm.value = {
        status: data.status,
        declarationNo: data.declarationNo,
        customsOffice: data.customsOffice
      }
    }
  } catch (error) {
    console.error('获取清关状态失败:', error)
  }
}

// 获取文件列表
const getDocuments = async () => {
  try {
    const { code, data } = await request.get(`/orders/${props.orderId}/customs/documents`)
    if (code === 200) {
      documents.value = data
    }
  } catch (error) {
    console.error('获取文件列表失败:', error)
  }
}

// 更新状态
const handleUpdate = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    const { code, message } = await request.put(`/orders/${props.orderId}/customs/status`, updateForm.value)
    
    if (code === 200) {
      ElMessage.success(t('customs.updateSuccess'))
      getCustomsData()
      emit('update')
    } else {
      ElMessage.error(message || t('customs.updateFailed'))
    }
  } catch (error) {
    console.error('更新清关状态失败:', error)
    ElMessage.error(t('customs.updateFailed'))
  }
}

const handleDownload = (file) => {
  try {
    // 使用原生下载方式
    const token = sessionStorage.getItem('token')
    const downloadUrl = `${request.defaults.baseURL}/customs/documents/${file.id}/download`
    
    // 使用 fetch API 发送带 Authorization header 的请求
    fetch(downloadUrl, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => response.blob())
    .then(blob => {
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = file.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    })
    .catch(error => {
      console.error('下载文件失败:', error)
      ElMessage.error(t('customs.downloadFailed'))
    })

  } catch (error) {
    console.error('下载文件失败:', error)
    ElMessage.error(t('customs.downloadFailed'))
  }
}

// 文件类型选项
const documentTypes = [
  'invoice',
  'packing_list',
  'declaration',
  'inspection_cert',
  'other'
]

// 状态选项
const statusOptions = [
  'pending',
  'submitted',
  'inspecting',
  'approved',
  'rejected',
  'completed'
]

onMounted(() => {
  getCustomsData()
  getDocuments()
})
</script>

<style scoped>
.customs-clearance {
  padding: 20px;
}

.documents-section {
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

.el-upload__tip {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
  line-height: 1.4;
}

:deep(.el-progress) {
  margin-top: 15px;
}

:deep(.el-upload) {
  width: 100%;
}

:deep(.el-upload-list) {
  margin-top: 10px;
}

.el-icon {
  margin-right: 4px;
  vertical-align: middle;
}

:deep(.el-button--link) {
  display: inline-flex;
  align-items: center;
  height: 28px;
  padding: 0 8px;
}
</style> 