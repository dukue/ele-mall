<template>
  <el-dialog
    :title="isEdit ? t('product.editProduct') : t('product.addProduct')"
    v-model="dialogVisible"
    width="70%"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="120px"
    >
      <el-tabs v-model="activeTab">
        <!-- 基本信息 -->
        <el-tab-pane :label="t('product.basicInfo')" name="basic">
          <el-form-item :label="t('product.price')" prop="price">
            <el-input-number v-model="formData.price" :precision="2" :min="0" />
          </el-form-item>
          <el-form-item :label="t('product.weight')" prop="weight">
            <el-input-number v-model="formData.weight" :precision="2" :min="0" />
          </el-form-item>
          <el-form-item :label="t('product.category')" prop="categoryId">
            <el-select 
              v-model="formData.categoryId" 
              :placeholder="t('product.selectCategory')"
              :loading="categoriesLoading"
            >
              <el-option
                v-for="item in categories"
                :key="item.id"
                :label="item.translations?.[currentLang]?.name || item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="t('product.status')" prop="status">
            <el-switch v-model="formData.status" />
          </el-form-item>
        </el-tab-pane>

        <!-- 多语言信息 -->
        <template v-if="isLanguagesLoaded">
          <el-tab-pane 
            v-for="lang in languages" 
            :key="lang.code"
            :label="lang.name"
            :name="lang.code"
          >
            <el-form-item :label="t('product.name')" :prop="`translations.${lang.code}.name`">
              <el-input v-model="formData.translations[lang.code].name" />
            </el-form-item>
            <el-form-item :label="t('product.description')" :prop="`translations.${lang.code}.description`">
              <el-input
                v-model="formData.translations[lang.code].description"
                type="textarea"
                :rows="3"
              />
            </el-form-item>
            <el-form-item :label="t('product.specifications')">
              <el-card>
                <template #header>
                  <div class="specifications-header">
                    <span>{{ t('product.specifications') }}</span>
                    <el-button type="primary" link @click="addSpecification(lang.code)">
                      {{ t('product.addSpecification') }}
                    </el-button>
                  </div>
                </template>
                <div
                  v-for="(_, key) in formData.translations[lang.code].specifications"
                  :key="key"
                  class="specification-item"
                >
                  <el-input v-model="specKeys[lang.code][key]" :placeholder="t('product.specName')">
                    <template #prepend>{{ t('product.specNameLabel') }}</template>
                  </el-input>
                  <el-input
                    v-model="formData.translations[lang.code].specifications[key]"
                    :placeholder="t('product.specValue')"
                  >
                    <template #prepend>{{ t('product.specValueLabel') }}</template>
                  </el-input>
                  <el-button type="danger" link @click="removeSpecification(lang.code, key)">
                    {{ t('common.delete') }}
                  </el-button>
                </div>
              </el-card>
            </el-form-item>
          </el-tab-pane>
        </template>
      </el-tabs>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ t('common.cancel') }}</el-button>
        <el-button type="primary" @click="handleSubmit">{{ t('common.confirm') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch, defineProps, defineEmits, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'

const { t, locale } = useI18n()

const props = defineProps({
  visible: Boolean,
  isEdit: Boolean,
  editData: Object
})

const emit = defineEmits(['update:visible', 'success'])

// 表单数据
const formData = reactive({
  price: 0,
  weight: 0,
  status: true,
  categoryId: undefined,
  translations: {
    zh: { name: '', description: '', specifications: {} },
    en: { name: '', description: '', specifications: {} },
    ja: { name: '', description: '', specifications: {} }
  }
})

// 支持的语言列表
const languages = ref([])

// 添加语言加载状态标志
const isLanguagesLoaded = ref(false)

// 获取支持的语言列表
const getLanguages = async () => {
  try {
    const { code, data } = await request.get('/i18n/languages')
    if (code === 200) {
      languages.value = data || []
      // 初始化每种语言的翻译数据
      languages.value.forEach(lang => {
        if (!formData.translations[lang.code]) {
          formData.translations[lang.code] = {
            name: '',
            description: '',
            specifications: {}
          }
          specKeys[lang.code] = {}
        }
      })
      isLanguagesLoaded.value = true
    }
  } catch (error) {
    console.error('获取语言列表失败:', error)
    ElMessage.error(t('common.getFailed'))
  }
}

// 当前激活的语言标签
const activeTab = ref('basic')

// 规格参数的key
const specKeys = reactive({})

// 修改初始化translations的方法
const initTranslations = () => {
  // 保留现有的translations数据
  const existingTranslations = { ...formData.translations }
  // 重置translations
  formData.translations = {}
  languages.value.forEach(lang => {
    formData.translations[lang.code] = {
      // 如果有现有数据就使用现有数据，否则使用空值
      ...existingTranslations[lang.code] || {
        name: '',
        description: '',
        specifications: {}
      }
    }
    specKeys[lang.code] = {}
  })
}

// 表单验证规则
const rules = {
  price: [
    { required: true, message: t('validation.required', { field: t('product.price') }), trigger: 'blur' },
    { type: 'number', min: 0, message: t('validation.min', { field: t('product.price'), min: 0 }), trigger: 'blur' }
  ],
  weight: [
    { required: true, message: t('validation.required', { field: t('product.weight') }), trigger: 'blur' },
    { type: 'number', min: 0, message: t('validation.min', { field: t('product.weight'), min: 0 }), trigger: 'blur' }
  ],
  categoryId: [
    { required: true, message: t('validation.required', { field: t('product.category') }), trigger: 'change' }
  ]
}

// 添加规格
const addSpecification = (langCode) => {
  const key = `spec_${Date.now()}`
  specKeys[langCode][key] = ''
  formData.translations[langCode].specifications[key] = ''
}

// 删除规格
const removeSpecification = (langCode, key) => {
  delete specKeys[langCode][key]
  delete formData.translations[langCode].specifications[key]
}

// 提交表单
const handleSubmit = async () => {
  try {
    // 检查是否至少有一种语言的商品名称不为空
    const hasValidTranslation = Object.values(formData.translations).some(
      trans => trans.name.trim() !== ''
    )

    if (!hasValidTranslation) {
      ElMessage.error(t('product.atLeastOneName'))
      return
    }

    // 过滤掉空的翻译内容，并处理规格参数
    const filteredTranslations = {}
    Object.entries(formData.translations).forEach(([langCode, translation]) => {
      if (translation.name.trim()) {
        // 处理规格参数，使用规格名称作为键
        const processedSpecs = {}
        Object.entries(translation.specifications).forEach(([key, value]) => {
          const specName = specKeys[langCode][key]
          if (specName && value) {
            processedSpecs[specName] = value
          }
        })

        filteredTranslations[langCode] = {
          name: translation.name.trim(),
          description: translation.description.trim(),
          specifications: processedSpecs
        }
      }
    })

    const submitData = {
      price: formData.price,
      weight: formData.weight,
      status: formData.status,
      categoryId: formData.categoryId,
      translations: filteredTranslations
    }

    if (props.isEdit) {
      const { code, message } = await request.put(`/products/${props.editData.id}`, submitData)
      if (code !== 200) {
        throw new Error(message || t('product.updateFailed'))
      }
      ElMessage.success(t('product.editSuccess'))
    } else {
      const { code, message } = await request.post('/products', submitData)
      if (code !== 200) {
        throw new Error(message || t('product.addFailed'))
      }
      ElMessage.success(t('product.addSuccess'))
    }

    emit('success')
    dialogVisible.value = false
  } catch (error) {
    console.error('保存失败:', error)
    ElMessage.error(t('product.saveFailed'))
  }
}

// 监听visible变化
const dialogVisible = ref(false)
watch(() => props.visible, async (val) => {
  dialogVisible.value = val
  if (val) {
    isLanguagesLoaded.value = false
    await getLanguages()
    // 当对话框打开时，重新获取分类列表
    getCategories()
    // 如果是编辑模式，需要初始化表单数据
    if (props.isEdit && props.editData) {
      initFormData()
    } else {
      // 如果是添加模式，重置表单数据
      await resetFormData()
    }
  }
})
watch(dialogVisible, (val) => {
  emit('update:visible', val)
})

// 在组件挂载时获取分类列表
onMounted(() => {
  getCategories()
})

// 在组件中添加分类列表相关的状态
const categories = ref([])
const categoriesLoading = ref(false)

// 添加当前语言的计算属性
const currentLang = computed(() => locale.value.split('-')[0])

// 修改获取分类列表方法
const getCategories = async () => {
  categoriesLoading.value = true
  try {
    const { code, data, message } = await request.get('/categories', {
      params: {
        lang: currentLang.value
      }
    })
    if (code === 200) {
      categories.value = data || []
    } else {
      console.error('获取分类列表数据格式错误:', { code, data, message })
      ElMessage.error(message || t('product.getCategoriesFailed'))
    }
  } catch (error) {
    console.error('获取分类列表失败:', error)
    ElMessage.error(t('product.getCategoriesFailed'))
  } finally {
    categoriesLoading.value = false
  }
}

// 添加语言变化监听
watch(() => locale.value, () => {
  getCategories() // 语言改变时重新获取分类列表
})

// 修改初始化表单数据的方法
const initFormData = () => {
  if (!props.editData) return

  // 基本信息
  formData.price = Number(props.editData.price)
  formData.weight = Number(props.editData.weight)
  formData.status = props.editData.status
  formData.categoryId = props.editData.category?.id

  // 重置所有语言的翻译数据
  languages.value.forEach(lang => {
    formData.translations[lang.code] = {
      name: '',
      description: '',
      specifications: {}
    }
    specKeys[lang.code] = {}
  })

  // 设置翻译数据
  Object.entries(props.editData.translations || {}).forEach(([langCode, translation]) => {
    if (formData.translations[langCode]) {
      formData.translations[langCode].name = translation.name || ''
      formData.translations[langCode].description = translation.description || ''
      
      // 处理规格参数
      if (translation.specifications) {
        Object.entries(translation.specifications).forEach(([name, value], index) => {
          const key = `spec_${index}`
          specKeys[langCode][key] = name
          formData.translations[langCode].specifications[key] = value
        })
      }
    }
  })
}

// 添加重置表单数据的方法
const resetFormData = async () => {
  formData.price = 0
  formData.weight = 0
  formData.status = true
  formData.categoryId = undefined

  // 重置多语言数据
  await getLanguages()
  initTranslations()
}
</script>

<style scoped>
.specifications-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.specification-item {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}
.specification-item .el-input {
  flex: 1;
}
</style> 