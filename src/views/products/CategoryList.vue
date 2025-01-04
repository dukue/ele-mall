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
import { ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'
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
  }
})

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
        lang: currentLang // 添加语言参数
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
    }
  }
  dialogVisible.value = true
}

// 修改处理编辑分类
const handleEdit = (row) => {
  isEdit.value = true
  categoryForm.value = {
    id: row.id,
    translations: row.translations || {
      zh: { name: row.name || '', description: row.description || '' },
      en: { name: '', description: '' },
      ja: { name: '', description: '' }
    }
  }
  dialogVisible.value = true
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

// 修改表单提交
const handleSubmit = async () => {
  if (!categoryFormRef.value) return

  try {
    await categoryFormRef.value.validate()
    // 获取当前语言代码并转换为数据库支持的格式
    const currentLang = getLanguageCode(locale.value)
    
    if (isEdit.value) {
      // 编辑分类
      const { code, message } = await request.put(`/categories/${categoryForm.value.id}`, {
        name: categoryForm.value.name,
        description: categoryForm.value.description,
        lang: currentLang
      })
      if (code === 200) {
        ElMessage.success(t('category.editSuccess'))
        dialogVisible.value = false
        getCategoryList()
      } else {
        ElMessage.error(message || t('category.editFailed'))
      }
    } else {
      // 添加分类
      const { code, message } = await request.post('/categories', {
        name: categoryForm.value.name,
        description: categoryForm.value.description,
        lang: currentLang
      })
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
}

.category-card {
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

:deep(.el-tabs__content) {
  padding: 20px 0;
}
</style> 