<template>
  <div class="add-product">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>{{ t('product.addProduct') }}</span>
        </div>
      </template>

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
          <el-select v-model="productForm.categoryId">
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

        <!-- 初始库存设置 -->
        <el-form-item :label="t('inventory.title')">
          <el-card shadow="never">
            <template v-for="(item, index) in productForm.initialInventory" :key="index">
              <el-row :gutter="20" class="mb-2">
                <el-col :span="8">
                  <el-select 
                    v-model="item.warehouseId"
                    :placeholder="t('inventory.selectWarehouse')"
                  >
                    <el-option
                      v-for="warehouse in warehouses"
                      :key="warehouse.id"
                      :label="warehouse.name"
                      :value="warehouse.id"
                    />
                  </el-select>
                </el-col>
                <el-col :span="6">
                  <el-input-number
                    v-model="item.quantity"
                    :min="0"
                    :placeholder="t('inventory.quantity')"
                  />
                </el-col>
                <el-col :span="6">
                  <el-input-number
                    v-model="item.safetyStock"
                    :min="0"
                    :placeholder="t('inventory.safetyStock')"
                  />
                </el-col>
                <el-col :span="4">
                  <el-button type="danger" link @click="removeInventory(index)">
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </el-col>
              </el-row>
            </template>
            
            <el-button 
              type="primary" 
              link 
              class="add-inventory-btn"
              @click="addInventory"
            >
              <el-icon><Plus /></el-icon>
              {{ t('inventory.add') }}
            </el-button>
          </el-card>
        </el-form-item>

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
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { Delete, Plus } from '@element-plus/icons-vue'
import request from '@/utils/request'

const { t } = useI18n()
const router = useRouter()

const activeLang = ref('zh')
const formRef = ref(null)
const categories = ref([])
const currentLang = ref('zh')
const warehouses = ref([])

// 支持的语言列表
const supportedLanguages = [
  { code: 'zh', name: '中文' },
  { code: 'en', name: 'English' },
  { code: 'ja', name: '日本語' }
]

// 可以将默认翻译结构提取为一个常量，方便复用
const DEFAULT_TRANSLATIONS = {
  zh: { name: '', description: '', specifications: {} },
  en: { name: '', description: '', specifications: {} },
  ja: { name: '', description: '', specifications: {} }
}

// 表单数据
const productForm = ref({
  price: 0,
  weight: 0,
  status: true,
  categoryId: null,
  translations: { ...DEFAULT_TRANSLATIONS },
  initialInventory: []  // 添加初始库存数组
})

// 规格键临时存储
const specKeys = ref({})

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
  ],
  'translations.zh.name': [
    { required: true, message: t('product.atLeastOneName'), trigger: 'blur' }
  ],
  initialInventory: {
    validator: (rule, value, callback) => {
      if (value.length === 0) {
        callback()
        return
      }
      
      const invalid = value.some(item => {
        return !item.warehouseId || item.quantity < 0 || item.safetyStock < 0
      })
      
      if (invalid) {
        callback(new Error(t('inventory.invalidData')))
      } else {
        callback()
      }
    },
    trigger: 'change'
  }
}

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

// 监听语言变化重新获取分类列表
watch(currentLang, () => {
  getCategories()
})

// 添加规格
const addSpec = (langCode) => {
  const newKey = `spec_${Date.now()}`
  productForm.value.translations[langCode].specifications = {
    ...productForm.value.translations[langCode].specifications,
    [newKey]: ''
  }
  specKeys.value[newKey] = ''
}

// 移除规格
const removeSpec = (key, langCode) => {
  const specs = productForm.value.translations[langCode].specifications
  const newSpecs = { ...specs }
  delete newSpecs[key]
  productForm.value.translations[langCode].specifications = newSpecs
  delete specKeys.value[key]
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
  
  specKeys.value[newKey] = newKey
  delete specKeys.value[oldKey]
}

// 获取仓库列表
const getWarehouses = async () => {
  try {
    const { code, data } = await request.get('/warehouses')
    if (code === 200) {
      warehouses.value = data || []
    }
  } catch (error) {
    console.error('获取仓库列表失败:', error)
    ElMessage.error(t('warehouse.listFailed'))
  }
}

// 添加库存记录
const addInventory = () => {
  productForm.value.initialInventory.push({
    warehouseId: null,
    quantity: 0,
    safetyStock: 0
  })
}

// 移除库存记录
const removeInventory = (index) => {
  productForm.value.initialInventory.splice(index, 1)
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

    const { code, message } = await request.post('/products', formData)
    
    if (code === 200) {
      ElMessage.success(t('product.addSuccess'))
      router.push('/products')
    } else {
      ElMessage.error(message || t('product.addFailed'))
    }
  } catch (error) {
    console.error('添加商品失败:', error)
    ElMessage.error(t('product.addFailed'))
  }
}

// 在组件挂载时初始化
onMounted(() => {
  getCategories()
  getWarehouses()
})

const getCategoryName = (category) => {
  if (!category) return ''
  // 直接返回 name，因为后端已经根据语言返回对应的翻译
  return category.name || t('product.unknownCategory')
}
</script>

<style scoped>
.add-product {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mb-2 {
  margin-bottom: 12px;
}

.add-spec-btn {
  margin-top: 10px;
  width: 100%;
}

:deep(.el-card__body) {
  padding: 15px;
}

/* 规格卡片样式 */
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

.add-inventory-btn {
  margin-top: 10px;
  width: 100%;
}
</style> 