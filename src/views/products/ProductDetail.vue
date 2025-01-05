<template>
  <div class="product-detail">
    <el-tabs v-model="activeTab">
      <el-tab-pane :label="t('product.basicInfo')" name="basic">
        <el-card v-loading="loading">
          <el-form
            ref="formRef"
            :model="productForm"
            :rules="rules"
            label-width="120px"
          >
            <!-- 基本信息 -->
            <el-form-item :label="t('product.price')" prop="price">
              <el-input-number 
                v-model="productForm.price" 
                :min="0" 
                :precision="2"
              />
            </el-form-item>
            
            <el-form-item :label="t('product.weight')" prop="weight">
              <el-input-number 
                v-model="productForm.weight" 
                :min="0" 
                :precision="2"
              />
            </el-form-item>

            <el-form-item :label="t('product.status')" prop="status">
              <el-switch v-model="productForm.status" />
            </el-form-item>

            <el-form-item :label="t('product.category')" prop="categoryId">
              <el-select 
                v-model="productForm.categoryId"
                :placeholder="t('product.selectCategory')"
              >
                <el-option
                  v-for="item in categories"
                  :key="item.id"
                  :label="getCategoryName(item)"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>

            <!-- 多语言信息 -->
            <el-tabs v-model="activeLang">
              <el-tab-pane 
                v-for="lang in supportedLanguages" 
                :key="lang.code"
                :label="lang.name"
                :name="lang.code"
              >
                <el-form-item :label="t('product.name')" :prop="`translations.${lang.code}.name`">
                  <el-input v-model="productForm.translations[lang.code].name" />
                </el-form-item>
                
                <el-form-item :label="t('product.description')" :prop="`translations.${lang.code}.description`">
                  <el-input
                    v-model="productForm.translations[lang.code].description"
                    type="textarea"
                    :rows="4"
                  />
                </el-form-item>

                <!-- 规格信息 -->
                <el-form-item :label="t('product.specifications')">
                  <el-card shadow="never">
                    <!-- 现有规格列表 -->
                    <template v-for="(value, key) in productForm.translations[lang.code].specifications" :key="key">
                      <el-row :gutter="20" class="mb-2">
                        <el-col :span="8">
                          <el-input 
                            v-model="specKeys[key]" 
                            :placeholder="t('product.specNameLabel')"
                            @change="updateSpecKey(key, $event, lang.code)"
                          />
                        </el-col>
                        <el-col :span="12">
                          <el-input 
                            v-model="productForm.translations[lang.code].specifications[key]" 
                            :placeholder="t('product.specValueLabel')"
                          />
                        </el-col>
                        <el-col :span="4">
                          <el-button type="danger" link @click="removeSpec(key, lang.code)">
                            <el-icon><Delete /></el-icon>
                          </el-button>
                        </el-col>
                      </el-row>
                    </template>

                    <!-- 添加规格按钮 -->
                    <el-button 
                      type="primary" 
                      link 
                      class="add-spec-btn"
                      @click="addSpec(lang.code)"
                    >
                      <el-icon><Plus /></el-icon>
                      {{ t('product.addSpecification') }}
                    </el-button>
                  </el-card>
                </el-form-item>
              </el-tab-pane>
            </el-tabs>

            <el-form-item>
              <el-button type="primary" @click="handleSubmit">
                {{ t('common.save') }}
              </el-button>
              <el-button @click="$router.back()">
                {{ t('common.cancel') }}
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>
      
      <el-tab-pane :label="t('product.inventory')" name="inventory">
        <router-view v-if="activeTab === 'inventory'" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'
import { Delete, Plus } from '@element-plus/icons-vue'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const activeTab = ref('basic')
const activeLang = ref('zh')
const loading = ref(false)
const formRef = ref(null)

// 支持的语言列表
const supportedLanguages = [
  { code: 'zh', name: '中文' },
  { code: 'en', name: 'English' },
  { code: 'ja', name: '日本語' }
]

// 表单数据
const productForm = ref({
  price: 0,
  weight: 0,
  status: true,
  categoryId: null,
  translations: {
    zh: { name: '', description: '', specifications: {} },
    en: { name: '', description: '', specifications: {} },
    ja: { name: '', description: '', specifications: {} }
  }
})

// 表单验证规则
const rules = {
  price: [
    { required: true, message: t('validation.required', { field: t('product.price') }), trigger: 'blur' },
    { type: 'number', min: 0, message: t('validation.min', { field: t('product.price'), min: 0 }), trigger: 'blur' }
  ],
  weight: [
    { required: true, message: t('validation.required', { field: t('product.weight') }), trigger: 'blur' }
  ],
  categoryId: [
    { required: true, message: t('validation.required', { field: t('product.category') }), trigger: 'change' }
  ]
}

// 规格键临时存储
const specKeys = ref({})

// 添加规格
const addSpec = (langCode) => {
  const newKey = `spec_${Date.now()}`
  productForm.value.translations[langCode].specifications = {
    ...productForm.value.translations[langCode].specifications,
    [newKey]: ''
  }
}

// 移除规格
const removeSpec = (key, langCode) => {
  const specs = productForm.value.translations[langCode].specifications
  const newSpecs = { ...specs }
  delete newSpecs[key]
  productForm.value.translations[langCode].specifications = newSpecs
}

// 更新规格键
const updateSpecKey = (oldKey, newKey, langCode) => {
  if (newKey === oldKey) return
  
  const specs = productForm.value.translations[langCode].specifications
  const value = specs[oldKey]
  const newSpecs = { ...specs }
  delete newSpecs[oldKey]
  newSpecs[newKey] = value
  productForm.value.translations[langCode].specifications = newSpecs
}

// 在获取商品详情时初始化 specKeys
const initSpecKeys = (translations) => {
  const keys = {}
  Object.keys(translations).forEach(lang => {
    const specs = translations[lang]?.specifications || {}
    Object.keys(specs).forEach(key => {
      keys[key] = key
    })
  })
  specKeys.value = keys
}

// 获取商品详情
const getProductDetail = async () => {
  try {
    loading.value = true
    const { code, data } = await request.get(`/products/${route.params.id}`)
    if (code === 200) {
      // 初始化默认的翻译结构
      const defaultTranslations = {
        zh: { name: '', description: '', specifications: {} },
        en: { name: '', description: '', specifications: {} },
        ja: { name: '', description: '', specifications: {} }
      }

      productForm.value = {
        price: Number(data.price),
        weight: Number(data.weight),
        status: data.status,
        categoryId: data.category?.id,
        translations: {
          ...defaultTranslations,
          ...data.translations
        }
      }

      // 确保每个语言都有完整的数据结构
      supportedLanguages.forEach(({ code }) => {
        if (!productForm.value.translations[code]) {
          productForm.value.translations[code] = defaultTranslations[code]
        } else {
          // 确保每个语言都有 specifications 对象
          productForm.value.translations[code].specifications = 
            productForm.value.translations[code].specifications || {}
        }
      })

      initSpecKeys(data.translations || {})
    }
  } catch (error) {
    console.error('获取商品详情失败:', error)
    ElMessage.error(t('product.getDetailFailed'))
  } finally {
    loading.value = false
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    // 处理表单数据，只保留有内容的语言
    const formData = {
      ...productForm.value,
      translations: {}
    }
    
    // 遍历所有语言
    Object.entries(productForm.value.translations).forEach(([lang, translation]) => {
      // 检查该语言是否有内容
      const hasContent = translation.name.trim() || 
                        translation.description.trim() || 
                        Object.keys(translation.specifications).length > 0
      
      // 如果有内容，则保留该语言的数据
      if (hasContent) {
        formData.translations[lang] = {
          name: translation.name.trim(),
          description: translation.description.trim(),
          specifications: {}
        }
        
        // 只保留有值的规格
        Object.entries(translation.specifications).forEach(([key, value]) => {
          if (value.trim()) {
            formData.translations[lang].specifications[key] = value.trim()
          }
        })
      }
    })
    
    // 确保至少有一种语言的信息
    if (Object.keys(formData.translations).length === 0) {
      ElMessage.warning(t('product.atLeastOneName'))
      return
    }

    const { code, message } = await request.put(`/products/${route.params.id}`, formData)
    
    if (code === 200) {
      ElMessage.success(t('product.editSuccess'))
      router.push('/products')
    } else {
      ElMessage.error(message || t('product.editFailed'))
    }
  } catch (error) {
    console.error('更新商品失败:', error)
    ElMessage.error(t('product.editFailed'))
  }
}

// 监听标签页变化
watch(activeTab, (newTab) => {
  if (newTab === 'inventory') {
    router.push({
      name: 'ProductInventory',
      params: { id: route.params.id }
    })
  }
})

const categories = ref([])
const currentLang = ref('zh')

// 获取分类列表
const getCategories = async () => {
  try {
    const { code, data } = await request.get('/categories', {
      params: {
        lang: currentLang.value
      }
    })
    if (code === 200) {
      categories.value = data || []
    }
  } catch (error) {
    console.error('获取分类列表失败:', error)
    ElMessage.error(t('product.getCategoriesFailed'))
  }
}

// 获取分类名称
const getCategoryName = (category) => {
  if (!category) return ''
  return category.name || t('product.unknownCategory')
}

// 监听语言变化重新获取分类列表
watch(currentLang, () => {
  getCategories()
})

// 初始化
onMounted(() => {
  if (route.params.id) {
    getProductDetail()
    getCategories()
  }
  if (route.name === 'ProductInventory') {
    activeTab.value = 'inventory'
  }
})
</script>

<style scoped>
.product-detail {
  padding: 20px;
}

:deep(.el-tabs__content) {
  padding: 20px 0;
}

.mb-2 {
  margin-bottom: 8px;
}

.add-spec-btn {
  margin-top: 10px;
  width: 100%;
}

:deep(.el-card__body) {
  padding: 15px;
}

.mb-2 {
  margin-bottom: 12px;
}

/* 确保规格卡片有足够的高度和滚动条 */
:deep(.el-card) {
  max-height: 560px;
  overflow-y: auto;
}

/* 美化滚动条 */
:deep(.el-card)::-webkit-scrollbar {
  width: 6px;
}

:deep(.el-card)::-webkit-scrollbar-thumb {
  background-color: #909399;
  border-radius: 3px;
}

:deep(.el-card)::-webkit-scrollbar-track {
  background-color: #f5f7fa;
}
</style> 