<!-- eslint-disable no-undef, vue/no-setup-props-destructure -->
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

        <!-- 商品主图上传 -->
        <el-form-item :label="t('product.mainImage')" prop="mainImage">
          <el-upload
            class="product-image-upload"
            :action="`${request.defaults.baseURL}/temp-upload`"
            :headers="uploadHeaders"
            :show-file-list="false"
            :before-upload="beforeImageUpload"
            :on-success="handleMainImageSuccess"
            :on-error="handleUploadError"
            accept="image/jpeg,image/png,image/jpg"
          >
            <img v-if="productForm.tempMainImage" :src="productForm.tempMainImage" class="uploaded-image">
            <el-icon v-else class="upload-icon"><Plus /></el-icon>
            <div class="upload-text">{{ t('product.uploadMainImage') }}</div>
          </el-upload>
        </el-form-item>

        <!-- 商品图片集上传 -->
        <el-form-item :label="t('product.images')" prop="images">
          <el-upload
            class="product-images-upload"
            :action="`${request.defaults.baseURL}/temp-upload`"
            :headers="uploadHeaders"
            :on-success="handleImagesSuccess"
            :on-error="handleUploadError"
            :before-upload="beforeImageUpload"
            :multiple="true"
            :limit="5"
            list-type="picture-card"
            accept="image/jpeg,image/png,image/jpg"
            :file-list="fileList"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
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
                    :min="1"
                    :placeholder="t('inventory.quantity')"
                  />
                </el-col>
                <el-col :span="6">
                  <el-input-number
                    v-model="item.safetyStock"
                    :min="1"
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
/* eslint-disable */
import { ref, watch, onMounted, computed } from 'vue'
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
  mainImage: '', // 数据库中的主图路径
  images: [], // 数据库中的图片集路径
  tempMainImage: '', // 临时主图路径
  tempImages: [], // 临时图片集路径
  translations: { ...DEFAULT_TRANSLATIONS },
  initialInventory: []
})

// 规格键临时存储
const specKeys = ref({})

// 图片列表
const fileList = ref([])

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

// 上传相关
const uploadHeaders = computed(() => ({
  Authorization: `Bearer ${sessionStorage.getItem('token')}`
}))

// 上传前验证
const beforeImageUpload = (file) => {
  const isImage = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg'
  const isLt5M = file.size / 1024 / 1024 < 5

  if (!isImage) {
    ElMessage.error(t('product.imageTypeError'))
    return false
  }
  if (!isLt5M) {
    ElMessage.error(t('product.imageSizeError'))
    return false
  }
  return true
}

// 主图上传成功
const handleMainImageSuccess = (response) => {
  if (response.code === 200 && response.data) {
    const imageUrl = `${request.defaults.baseURL}/${response.data.path}`
    productForm.value.tempMainImage = imageUrl
    ElMessage.success(t('product.uploadSuccess'))
  } else {
    ElMessage.error(response.message || t('product.uploadFailed'))
  }
}

// 图片集上传成功
const handleImagesSuccess = (response) => {
  if (response.code === 200 && response.data) {
    const imageUrl = `${request.defaults.baseURL}/${response.data.path}`
    productForm.value.tempImages.push(imageUrl)
    fileList.value.push({
      name: response.data.filename,
      url: imageUrl
    })
    ElMessage.success(t('product.uploadSuccess'))
  } else {
    ElMessage.error(response.message || t('product.uploadFailed'))
  }
}

// 上传失败处理
const handleUploadError = (error) => {
  console.error('Upload error:', error)
  ElMessage.error(t('product.uploadFailed'))
}

// 上传商品图片
const uploadProductImages = async (productId) => {
  try {
    // 上传主图
    if (productForm.value.tempMainImage) {
      const mainImageFormData = new FormData()
      mainImageFormData.append('image', await fetch(productForm.value.tempMainImage).then(r => r.blob()))
      const { code, data } = await request.post(`/products/${productId}/image`, mainImageFormData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      if (code === 200) {
        productForm.value.mainImage = data.image
      }
    }

    // 上传图片集
    if (productForm.value.tempImages.length > 0) {
      const imagesFormData = new FormData()
      for (const tempImage of productForm.value.tempImages) {
        const imageBlob = await fetch(tempImage).then(r => r.blob())
        imagesFormData.append('images', imageBlob)
      }
      const { code, data } = await request.post(`/products/${productId}/images`, imagesFormData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      if (code === 200) {
        productForm.value.images = data.images
      }
    }
  } catch (error) {
    console.error('上传商品图片失败:', error)
    ElMessage.error(t('product.uploadFailed'))
    throw error
  }
}

// 获取商品详情
const getProductDetail = async (id) => {
  try {
    const { code, data } = await request.get(`/products/${id}`)
    if (code === 200 && data) {
      // 设置基本信息
      productForm.value.price = data.price
      productForm.value.weight = data.weight
      productForm.value.status = data.status
      productForm.value.categoryId = data.categoryId
      
      // 设置图片信息 - 注意这里使用 image 而不是 mainImage
      if (data.image) {
        productForm.value.mainImage = data.image
        productForm.value.tempMainImage = `${request.defaults.baseURL}/${data.image}`
      }
      
      if (data.images && data.images.length > 0) {
        productForm.value.images = data.images
        productForm.value.tempImages = data.images.map(img => `${request.defaults.baseURL}/${img}`)
        fileList.value = data.images.map(img => ({
          name: img.split('/').pop(),
          url: `${request.defaults.baseURL}/${img}`
        }))
      }

      // 设置翻译信息
      if (data.translations) {
        productForm.value.translations = {
          ...DEFAULT_TRANSLATIONS,
          ...data.translations
        }
      }

      // 设置库存信息
      if (data.initialInventory) {
        productForm.value.initialInventory = [...data.initialInventory]
      }
    }
  } catch (error) {
    console.error('获取商品详情失败:', error)
    ElMessage.error(t('product.getDetailFailed'))
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    const formData = {
      ...productForm.value,
      translations: {}
    }
    
    // 处理图片路径 - 确保使用正确的字段名
    formData.image = productForm.value.mainImage
    formData.images = productForm.value.images
    
    // 移除不需要的字段
    delete formData.tempMainImage
    delete formData.tempImages
    delete formData.mainImage  // 删除 mainImage，因为后端使用 image
    
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

    const id = router.currentRoute.value.params.id
    const { code, data, message } = id ? 
      await request.put(`/products/${id}`, formData) :
      await request.post('/products', formData)
    
    if (code === 200) {
      // 上传商品图片
      if (id) {
        await uploadProductImages(id)
      } else {
        await uploadProductImages(data.id)
      }
      
      ElMessage.success(id ? t('product.updateSuccess') : t('product.addSuccess'))
      router.push('/products')
    } else {
      ElMessage.error(message || (id ? t('product.updateFailed') : t('product.addFailed')))
    }
  } catch (error) {
    console.error(id ? '更新商品失败:' : '添加商品失败:', error)
    ElMessage.error(id ? t('product.updateFailed') : t('product.addFailed'))
  }
}

// 在组件挂载时初始化
onMounted(async () => {
  const id = router.currentRoute.value.params.id
  if (id) {
    await getProductDetail(id)
  }
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

/* 调整数字输入框的宽度 */
:deep(.el-input-number.el-input-number--default) {
  width: 160px !important;
}

/* 确保输入框之间有足够间距 */
.el-col {
  display: flex;
  align-items: center;
  gap: 12px;
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

/* 商品主图上传样式 */
.product-image-upload {
  width: 200px;
  height: 200px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: border-color 0.3s;
  margin-right: 20px;
}

.product-image-upload:hover {
  border-color: #409EFF;
}

.uploaded-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-icon {
  font-size: 28px;
  color: #8c939d;
  margin-bottom: 8px;
}

.upload-text {
  font-size: 14px;
  color: #606266;
  position: absolute;
  bottom: 10px;
  width: 100%;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 4px 0;
}

/* 商品图片集上传样式 */
.product-images-upload :deep(.el-upload--picture-card) {
  width: 150px;
  height: 150px;
  line-height: 150px;
}

.product-images-upload :deep(.el-upload-list--picture-card .el-upload-list__item) {
  width: 150px;
  height: 150px;
}

.product-images-upload :deep(.el-upload-list--picture-card) {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

/* 表单项样式调整 */
:deep(.el-form-item__content) {
  display: flex;
  align-items: flex-start;
}

:deep(.el-form-item__label) {
  padding-top: 8px;
}
</style> 