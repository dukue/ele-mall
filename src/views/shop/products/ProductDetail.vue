<template>
  <div class="page-container">
    <div class="product-detail-container">
      <el-card class="product-card" v-loading="loading">
        <div class="product-content">
          <div class="product-gallery">
            <div class="main-image">
              <img :src="currentImage" class="product-image" />
            </div>
            <div class="thumbnail-list">
              <div 
                v-for="(image, index) in product.images" 
                :key="index" 
                class="thumbnail-item"
                :class="{ active: currentImageIndex === index }"
                @click="setCurrentImage(index)"
              >
                <img :src="getImageUrl(image)" class="thumbnail-image" />
              </div>
            </div>
          </div>
          <div class="product-info">
            <h1 class="product-name">{{ product.name }}</h1>
            <div class="product-price">
              <span class="price-label">价格：</span>
              <span class="price-value">¥{{ typeof product.price === 'number' ? product.price.toFixed(2) : Number(product.price || 0).toFixed(2) }}</span>
            </div>
            <div class="product-stock">
              <span class="stock-label">库存：</span>
              <span class="stock-value">{{ product.stock }}</span>
            </div>
            <div class="product-quantity">
              <span class="quantity-label">数量：</span>
              <el-input-number
                v-model="quantity"
                :min="1"
                :max="product.stock"
                size="small">
              </el-input-number>
            </div>
            <div class="product-actions">
              <el-button type="primary" size="large" @click="addToCart" :loading="submitting">
                加入购物车
              </el-button>
              <el-button size="large" @click="buyNow" :loading="submitting">
                立即购买
              </el-button>
            </div>
          </div>
        </div>

        <div class="product-detail">
          <el-tabs v-model="activeTab">
            <el-tab-pane label="商品详情" name="detail">
              <div class="detail-content">
                <p>{{ product.description }}</p>
                <div v-if="product.details" v-html="product.details"></div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="规格参数" name="params">
              <el-table 
                :data="specificationsList" 
                border 
                stripe
                :height="tableHeight">
                <el-table-column prop="name" label="参数名"></el-table-column>
                <el-table-column prop="value" label="参数值"></el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="库存信息" name="stock">
              <el-table 
                :data="product.warehouses" 
                border 
                stripe
                :height="tableHeight">
                <el-table-column prop="name" label="仓库"></el-table-column>
                <el-table-column prop="stock" label="库存"></el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import request from '@/utils/request'
import { ref, onMounted, onBeforeUnmount, onUnmounted, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'

export default {
  name: 'ProductDetail',
  setup() {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    
    const loading = ref(false)
    const submitting = ref(false)
    const product = ref({})
    const quantity = ref(1)
    const activeTab = ref('detail')
    const currentImageIndex = ref(0)
    const baseURL = request.defaults.baseURL
    const tableHeight = ref(300)
    let resizeTimer = null

    const currentImage = computed(() => {
      const images = product.value?.images || []
      return images.length > 0 ? getImageUrl(images[currentImageIndex.value]) : ''
    })

    const specificationsList = computed(() => {
      const specs = product.value?.specifications || {}
      return Object.entries(specs).map(([name, value]) => ({
        name: formatSpecName(name),
        value
      }))
    })

    const getImageUrl = (path) => {
      return path ? `${baseURL}/${path}` : ''
    }

    const getProductDetail = async () => {
      loading.value = true
      try {
        const response = await store.dispatch('shop/product/getProductDetail', route.params.id)
        if (response) {
          const images = (response.images || []).map(image => image.replace(/^\/+/, ''))
          product.value = {
            ...response,
            images,
            price: Number(response.price || 0)
          }
        } else {
          throw new Error('Failed to get product details')
        }
      } catch (error) {
        console.error('Error fetching product:', error)
        ElMessage.error('获取商品详情失败')
      } finally {
        loading.value = false
      }
    }

    const handleResize = () => {
      if (resizeTimer) {
        clearTimeout(resizeTimer)
      }
      resizeTimer = setTimeout(() => {
        initTableHeight()
      }, 200)
    }

    const initTableHeight = () => {
      const minHeight = 300
      const maxHeight = window.innerHeight - 400
      tableHeight.value = Math.max(minHeight, Math.min(maxHeight, window.innerHeight * 0.4))
    }

    const formatSpecName = (name) => {
      const nameMap = {
        size: '尺码',
        color: '颜色',
        material: '材质'
      }
      return nameMap[name] || name
    }

    const setCurrentImage = (index) => {
      currentImageIndex.value = index
    }

    const checkLogin = () => {
      if (!store.state.shop.user.token) {
        ElMessage.warning('请先登录')
        router.push('/shop/login')
        return false
      }
      return true
    }

    const addToCart = async () => {
      if (!checkLogin()) return
      
      submitting.value = true
      try {
        await store.dispatch('shop/cart/addToCart', {
          productId: product.value.id,
          quantity: quantity.value
        })
        ElMessage.success('添加成功')
      } catch (error) {
        ElMessage.error(error.message || '添加失败')
      } finally {
        submitting.value = false
      }
    }

    const buyNow = async () => {
      if (!checkLogin()) return
      
      try {
        await store.dispatch('shop/cart/addToCart', {
          productId: product.value.id,
          quantity: quantity.value
        })
        router.push('/shop/checkout')
      } catch (error) {
        ElMessage.error(error.message || '操作失败')
      }
    }

    onMounted(() => {
      getProductDetail()
      initTableHeight()
      window.addEventListener('resize', handleResize)
    })

    onBeforeUnmount(() => {
      if (resizeTimer) {
        clearTimeout(resizeTimer)
      }
      window.removeEventListener('resize', handleResize)
    })

    return {
      loading,
      submitting,
      product,
      quantity,
      activeTab,
      currentImageIndex,
      tableHeight,
      currentImage,
      specificationsList,
      getImageUrl,
      setCurrentImage,
      addToCart,
      buyNow
    }
  }
}
</script>

<style lang="scss" scoped>
.page-container {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow-y: auto;
  background-color: #f5f7fa;
  padding-top: 60px; // 为顶部导航栏留出空间
}

.product-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;

  .product-card {
    margin-bottom: 20px;
    background: #fff;

    .product-content {
      display: flex;
      gap: 40px;
      margin-bottom: 40px;
      flex-wrap: wrap;

      .product-gallery {
        flex: 0 0 400px;
        max-width: 100%;

        .main-image {
          width: 100%;
          height: 400px;
          border: 1px solid #eee;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;

          .product-image {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
          }
        }

        .thumbnail-list {
          display: flex;
          gap: 10px;
          overflow-x: auto;
          padding-bottom: 10px;

          .thumbnail-item {
            width: 80px;
            height: 80px;
            border: 2px solid transparent;
            cursor: pointer;
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;

            &.active {
              border-color: var(--el-color-primary);
            }

            .thumbnail-image {
              max-width: 100%;
              max-height: 100%;
              object-fit: contain;
            }
          }
        }
      }

      .product-info {
        flex: 1;
        min-width: 300px;

        .product-name {
          font-size: 24px;
          margin: 0 0 20px;
          color: #333;
        }

        .product-price {
          margin-bottom: 20px;
          font-size: 16px;

          .price-value {
            color: #f56c6c;
            font-size: 24px;
            font-weight: bold;
          }
        }

        .product-stock,
        .product-quantity {
          margin-bottom: 20px;
          font-size: 16px;

          .stock-label,
          .quantity-label {
            color: #666;
            margin-right: 10px;
          }
        }

        .product-actions {
          display: flex;
          gap: 20px;
          margin-top: 30px;
        }
      }
    }

    .product-detail {
      border-top: 1px solid #eee;
      padding-top: 20px;

      .detail-content {
        padding: 20px;
        line-height: 1.6;
        color: #666;
      }

      :deep(.el-tabs__nav) {
        margin-bottom: 20px;
      }
    }
  }
}

@media (max-width: 768px) {
  .product-detail-container {
    padding: 10px;

    .product-card {
      .product-content {
        gap: 20px;

        .product-gallery {
          flex: 0 0 100%;

          .main-image {
            height: 300px;
          }
        }
      }
    }
  }
}
</style> 