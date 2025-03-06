<template>
  <div class="category-container">
    <el-card class="category-card">
      <!-- 添加分类按钮 -->
      <div class="header-actions">
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>
          {{ t('category.addCategory') }}
        </el-button>
      </div>

      <!-- 分类列表表格 -->
      <el-table :data="categoryList" border stripe>
        <el-table-column type="index" label="#" width="60" />
        <el-table-column prop="name" :label="t('category.name')" />
        <el-table-column prop="productCount" :label="t('category.productCount')" width="120" />
        <el-table-column prop="createTime" :label="t('common.createTime')" width="180">
          <template #default="scope">
            {{ formatDateTime(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="image" :label="t('category.image')" width="120">
          <template #default="scope">
            <el-image
              v-if="scope.row.image"
              :src="scope.row.image.startsWith('/') ? 
                `${request.defaults.baseURL}/${scope.row.image.slice(1)}` : 
                `${request.defaults.baseURL}/${scope.row.image}`"
              fit="cover"
              style="width: 80px; height: 80px"
            >
              <template #error>
                <el-icon><Picture /></el-icon>
              </template>
            </el-image>
            <el-icon v-else><Picture /></el-icon>
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
            <el-button 
              type="danger" 
              size="small"
              @click="handleDelete(scope.row)"
            >
              <el-icon><Delete /></el-icon>
              {{ t('common.delete') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加/编辑分类对话框 -->
    <el-dialog
      :title="isEdit ? t('category.editCategory') : t('category.addCategory')"
      v-model="dialogVisible"
      width="50%"
    >
      <el-form
        ref="categoryFormRef"
        :model="categoryForm"
        :rules="categoryRules"
        label-width="100px"
      >
        <el-tabs v-model="activeTab">
          <el-tab-pane 
            v-for="lang in languages" 
            :key="lang.code"
            :label="lang.name"
            :name="lang.code"
          >
            <el-form-item 
              :label="t('category.name')" 
              :prop="`translations.${lang.code}.name`"
            >
              <el-input v-model="categoryForm.translations[lang.code].name" />
            </el-form-item>
            <el-form-item 
              :label="t('category.description')" 
              :prop="`translations.${lang.code}.description`"
            >
              <el-input
                v-model="categoryForm.translations[lang.code].description"
                type="textarea"
                :rows="3"
              />
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
        <el-form-item :label="t('category.image')">
          <el-upload
            class="category-image-upload"
            :action="`${request.defaults.baseURL}/temp-upload`"
            :headers="uploadHeaders"
            :show-file-list="false"
            :before-upload="beforeImageUpload"
            :on-success="handleImageSuccess"
            :on-error="handleUploadError"
            accept="image/jpeg,image/png,image/jpg,image/gif"
          >
            <img 
              v-if="categoryForm.tempImage || categoryForm.image" 
              :src="getImageUrl(categoryForm.tempImage || categoryForm.image)" 
              class="uploaded-image"
            >
            <el-icon v-else class="upload-icon"><Plus /></el-icon>
            <div class="upload-text">{{ t('category.uploadImage') }}</div>
          </el-upload>
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
import { ref, onMounted, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Edit, Delete, Picture } from '@element-plus/icons-vue'
import request from '@/utils/request'

const { t } = useI18n()
const { locale } = useI18n()

// 分类列表数据
const categoryList = ref([])

// 对话框相关
const dialogVisible = ref(false)
const isEdit = ref(false)
const categoryFormRef = ref(null)

// 支持的语言列表
const languages = ref([
  { code: 'zh', name: '中文' },
  { code: 'en', name: 'English' },
  { code: 'ja', name: '日本語' }
])

// 当前激活的语言标签
const activeTab = ref('zh')

// 修改表单数据结构
const categoryForm = ref({
  translations: {
    zh: { name: '', description: '' },
    en: { name: '', description: '' },
    ja: { name: '', description: '' }
  },
  image: '',      // 已有图片路径
  tempImage: ''   // 临时上传的图片URL
})

// 添加上传相关方法
const uploadHeaders = computed(() => ({
  Authorization: `Bearer ${sessionStorage.getItem('token')}`
}))

const beforeImageUpload = (file) => {
  const isImage = /^image\/(jpeg|png|jpg|gif)$/.test(file.type)
  const isLt5M = file.size / 1024 / 1024 < 5

  if (!isImage) {
    ElMessage.error(t('category.imageTypeError'))
    return false
  }
  if (!isLt5M) {
    ElMessage.error(t('category.imageSizeError'))
    return false
  }
  return true
}

const handleImageSuccess = (response) => {
  if (response.code === 200) {
    // 移除路径开头的斜杠，避免双斜杠
    const imagePath = response.data.path.startsWith('/') ? response.data.path.slice(1) : response.data.path
    categoryForm.value.tempImage = `${request.defaults.baseURL}/${imagePath}`
    ElMessage.success(t('category.uploadSuccess'))
  } else {
    ElMessage.error(response.message || t('category.uploadFailed'))
  }
}

const handleUploadError = () => {
  ElMessage.error(t('category.uploadFailed'))
}

// 自定义验证函数：检查是否至少有一个语言的名称不为空
const validateTranslations = (rule, value, callback) => {
  const hasName = Object.values(categoryForm.value.translations).some(
    translation => translation.name.trim() !== ''
  )
  if (!hasName) {
    callback(new Error(t('category.atLeastOneName')))
  } else {
    callback()
  }
}

// 修改表单验证规则
const categoryRules = {
  'translations.zh.name': [
    { min: 2, max: 20, message: t('category.nameLengthTip'), trigger: 'blur' }
  ],
  'translations.en.name': [
    { min: 2, max: 20, message: t('category.nameLengthTip'), trigger: 'blur' }
  ],
  'translations.ja.name': [
    { min: 2, max: 20, message: t('category.nameLengthTip'), trigger: 'blur' }
  ],
  translations: [
    { validator: validateTranslations, trigger: 'submit' }
  ]
}

// 语言代码映射
const getLanguageCode = (locale) => {
  const langMap = {
    'zh-CN': 'zh',
    'en-US': 'en',
    'ja-JP': 'ja'
  }
  return langMap[locale] || 'en'
}

// 获取分类列表
const getCategoryList = async () => {
  try {
    // 获取当前语言代码并转换为数据库支持的格式
    const currentLang = getLanguageCode(locale.value)
    const { code, data, message } = await request.get('/categories', {
      params: {
        lang: currentLang, // 当前显示语言
        withTranslations: false // 列表不需要所有翻译数据
      }
    })
    if (code === 200) {
      categoryList.value = data || []
    } else {
      ElMessage.error(message || t('category.getFailed'))
    }
  } catch (error) {
    console.error('获取分类列表失败:', error)
    ElMessage.error(t('category.getFailed'))
  }
}

// 监听语言变化，重新获取分类列表
watch(() => locale.value, () => {
  getCategoryList()
})

// 修改处理添加分类
const handleAdd = () => {
  isEdit.value = false
  categoryForm.value = {
    translations: {
      zh: { name: '', description: '' },
      en: { name: '', description: '' },
      ja: { name: '', description: '' }
    },
    image: '',
    tempImage: ''
  }
  dialogVisible.value = true
}

// 添加一个工具函数来处理图片 URL
const getImageUrl = (path) => {
  if (!path) return ''
  if (path.startsWith('http')) return path // 如果已经是完整URL则直接返回
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  return `${request.defaults.baseURL}/${cleanPath}`
}

// 修改获取分类详情的方法
const getCategoryDetail = async (id) => {
  try {
    const { code, data } = await request.get(`/categories/${id}`)
    if (code === 200 && data) {
      // 设置表单数据
      categoryForm.value = {
        id: data.id,
        image: data.image,
        tempImage: data.image ? getImageUrl(data.image) : '', // 使用工具函数处理图片URL
        translations: {
          zh: { name: '', description: '' },
          en: { name: '', description: '' },
          ja: { name: '', description: '' },
          ...data.translations
        }
      }
    } else {
      ElMessage.error(t('category.getFailed'))
    }
  } catch (error) {
    console.error('获取分类详情失败:', error)
    ElMessage.error(t('category.getFailed'))
  }
}

// 修改编辑方法
const handleEdit = async (row) => {
  isEdit.value = true
  dialogVisible.value = true
  // 获取分类详情，包含所有语言的翻译
  await getCategoryDetail(row.id)
}

// 处理删除分类
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      t('category.deleteConfirm'),
      t('common.confirm'),
      {
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
        type: 'warning'
      }
    )

    const { code, message } = await request.delete(`/categories/${row.id}`)
    if (code === 200) {
      ElMessage.success(t('category.deleteSuccess'))
      getCategoryList()
    } else {
      ElMessage.error(message || t('category.deleteFailed'))
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除分类失败:', error)
      ElMessage.error(t('category.deleteFailed'))
    }
  }
}

// 修改表单提交方法
const handleSubmit = async () => {
  if (!categoryFormRef.value) return

  try {
    await categoryFormRef.value.validate()
    
    // 创建 FormData 对象
    const formData = new FormData()
    
    // 过滤掉空的翻译数据
    const filteredTranslations = {}
    Object.entries(categoryForm.value.translations).forEach(([lang, translation]) => {
      if (translation.name.trim()) {
        filteredTranslations[lang] = translation
      }
    })
    
    // 添加翻译数据
    formData.append('translations', JSON.stringify(filteredTranslations))
    
    // 如果有临时图片，需要重新获取文件并以 'image' 字段名提交
    if (categoryForm.value.tempImage) {
      try {
        const response = await fetch(categoryForm.value.tempImage)
        const blob = await response.blob()
        formData.append('image', blob, 'category-image.jpg')  // 使用 'image' 作为字段名
      } catch (error) {
        console.error('获取图片文件失败:', error)
        ElMessage.error(t('category.uploadFailed'))
        return
      }
    }

    if (isEdit.value) {
      const { code, message } = await request.put(
        `/categories/${categoryForm.value.id}`, 
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      )
      if (code === 200) {
        ElMessage.success(t('category.editSuccess'))
        dialogVisible.value = false
        getCategoryList()
      } else {
        ElMessage.error(message || t('category.editFailed'))
      }
    } else {
      const { code, message } = await request.post(
        '/categories', 
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      )
      if (code === 200) {
        ElMessage.success(t('category.addSuccess'))
        dialogVisible.value = false
        getCategoryList()
      } else {
        ElMessage.error(message || t('category.addFailed'))
      }
    }
  } catch (error) {
    console.error('保存分类失败:', error)
    ElMessage.error(isEdit.value ? t('category.editFailed') : t('category.addFailed'))
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
  getCategoryList()
})
</script>

<style scoped>
.category-container {
  padding: 20px;
  height: 100%;  /* 使用100%高度 */
  box-sizing: border-box;
  overflow: auto;  /* 添加滚动 */
}

.category-card {
  height: 100%;  /* 改为100%高度 */
}

/* 确保表格容器可以滚动 */
:deep(.el-card__body) {
  padding: 20px;
  height: calc(100% - 40px);  /* 减去padding的高度 */
  overflow: auto;  /* 添加滚动 */
}

.header-actions {
  margin-bottom: 20px;
}

.operation-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
}

:deep(.el-tabs__content) {
  padding: 20px 0;
}

.category-image-upload {
  text-align: center;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 180px;
  height: 180px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.category-image-upload:hover {
  border-color: #409eff;
}

.upload-icon {
  font-size: 28px;
  color: #8c939d;
}

.upload-text {
  color: #8c939d;
  margin-top: 8px;
  font-size: 12px;
}

.uploaded-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.el-image {
  border-radius: 4px;
  overflow: hidden;
}
</style> 