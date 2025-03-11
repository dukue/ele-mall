<template>
  <div class="home-container">
    <div class="page-content">
      <!-- 顶部轮播图 -->
      <div class="banner-section">
        <el-carousel height="400px" :interval="5000" arrow="hover">
          <el-carousel-item v-for="i in 4" :key="i">
            <div class="banner-item" :style="{ backgroundColor: `var(--el-color-primary-light-${i+5})` }">
              <h3>精选商品 {{ i }}</h3>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>

      <div class="main-content">
        <!-- 左侧分类导航 -->
        <div class="category-nav">
          <el-card class="category-card" shadow="never">
            <template #header>
              <div class="card-header">
                <span>商品分类</span>
                <el-button text>全部分类</el-button>
              </div>
            </template>
            <el-menu 
              mode="vertical" 
              :default-active="activeCategory"
              @select="handleCategorySelect"
              class="category-menu">
              <el-menu-item v-for="category in categories" :key="category.id" :index="category.id.toString()">
                <el-icon><Grid /></el-icon>
                <span>{{ category.name }}</span>
                <span class="category-count">({{ category.productCount }})</span>
              </el-menu-item>
            </el-menu>
          </el-card>
        </div>

        <!-- 右侧内容区 -->
        <div class="content-area">
          <!-- 筛选器 -->
          <el-card class="filter-card" shadow="never">
            <el-form :inline="true" :model="filterForm" class="filter-form">
              <el-form-item label="关键词">
                <el-input 
                  v-model="filterForm.keyword" 
                  placeholder="搜索商品" 
                  prefix-icon="Search"
                  clearable>
                </el-input>
              </el-form-item>
              <el-form-item label="价格">
                <div class="price-range">
                  <el-input-number 
                    v-model="filterForm.minPrice" 
                    :min="0" 
                    controls-position="right"
                    placeholder="最低价">
                  </el-input-number>
                  <span class="separator">-</span>
                  <el-input-number 
                    v-model="filterForm.maxPrice" 
                    :min="0" 
                    controls-position="right"
                    placeholder="最高价">
                  </el-input-number>
                </div>
              </el-form-item>
              <el-form-item label="排序">
                <el-select v-model="filterForm.sort" placeholder="排序方式">
                  <el-option label="最新上架" value="createTime_desc">
                    <div class="option-content">
                      <el-icon><Timer /></el-icon>
                      <span>最新上架</span>
                    </div>
                  </el-option>
                  <el-option label="价格从低到高" value="price_asc">
                    <div class="option-content">
                      <el-icon><Sort /></el-icon>
                      <span>价格从低到高</span>
                    </div>
                  </el-option>
                  <el-option label="价格从高到低" value="price_desc">
                    <div class="option-content">
                      <el-icon><Sort /></el-icon>
                      <span>价格从高到低</span>
                    </div>
                  </el-option>
                  <el-option label="销量优先" value="sales_desc">
                    <div class="option-content">
                      <el-icon><TrendCharts /></el-icon>
                      <span>销量优先</span>
                    </div>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleFilter">
                  <el-icon><Search /></el-icon>
                  筛选
                </el-button>
                <el-button @click="resetFilter">
                  <el-icon><RefreshRight /></el-icon>
                  重置
                </el-button>
              </el-form-item>
            </el-form>
          </el-card>

          <!-- 商品列表 -->
          <div class="products-wrapper">
            <el-row :gutter="20" v-loading="loading">
              <el-col 
                v-for="product in products" 
                :key="product.id" 
                :xs="24" 
                :sm="12" 
                :md="8" 
                :lg="6" 
                :xl="6">
                <el-card 
                  class="product-card" 
                  shadow="hover" 
                  :body-style="{ padding: '0px' }">
                  <div class="product-image" @click="goToDetail(product.id)">
                    <el-image 
                      :src="product.image" 
                      :alt="product.name"
                      fit="cover"
                      loading="lazy"
                      @error="handleImageError">
                      <template #error>
                        <div class="image-error">
                          <el-icon><Picture /></el-icon>
                        </div>
                      </template>
                    </el-image>
                    <div class="image-overlay">
                      <span>查看详情</span>
                    </div>
                  </div>
                  <div class="product-info">
                    <h3 class="product-name" @click="goToDetail(product.id)">
                      {{ product.name }}
                    </h3>
                    <div class="product-meta">
                      <span class="product-price">¥{{ product.price }}</span>
                      <span class="product-sales">已售 {{ product.sales }}</span>
                    </div>
                    <div class="product-action">
                      <el-button 
                        type="primary" 
                        @click="addToCart(product)">
                        <el-icon><ShoppingCart /></el-icon>
                        加入购物车
                      </el-button>
                    </div>
                  </div>
                </el-card>
              </el-col>
            </el-row>

            <!-- 分页器 -->
            <div class="pagination-container">
              <el-pagination
                v-model:current-page="currentPage"
                v-model:page-size="pageSize"
                :total="total"
                :page-sizes="[12, 24, 36, 48]"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSizeChange"
                @current-change="handlePageChange"
                background>
              </el-pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  Grid,
  Search,
  Timer,
  Sort,
  TrendCharts,
  RefreshRight,
  Picture,
  ShoppingCart
} from '@element-plus/icons-vue'
import placeholderImg from '@/assets/placeholder.jpg'

export default {
  name: 'ShopHome',
  components: {
    Grid,
    Search,
    Timer,
    Sort,
    TrendCharts,
    RefreshRight,
    Picture,
    ShoppingCart
  },
  setup() {
    const store = useStore()
    const router = useRouter()

    const activeCategory = ref('')
    const filterForm = ref({
      keyword: '',
      minPrice: null,
      maxPrice: null,
      sort: 'createTime_desc'
    })
    const currentPage = ref(1)
    const pageSize = ref(12)
    const loading = ref(false)

    const categories = computed(() => store.state.shop.category.list)
    const products = computed(() => store.state.shop.product.list)
    const total = computed(() => store.state.shop.product.total)

    const getCategories = async () => {
      try {
        await store.dispatch('shop/category/getCategories')
      } catch (error) {
        ElMessage.error('获取分类失败')
      }
    }

    const getProducts = async () => {
      loading.value = true
      try {
        const params = {
          page: currentPage.value,
          pageSize: pageSize.value,
          categoryId: activeCategory.value || undefined,
          keyword: filterForm.value.keyword || undefined,
          minPrice: filterForm.value.minPrice,
          maxPrice: filterForm.value.maxPrice,
          sort: filterForm.value.sort
        }
        await store.dispatch('shop/product/getProducts', params)
      } catch (error) {
        ElMessage.error('获取商品列表失败')
      } finally {
        loading.value = false
      }
    }

    const handleSizeChange = (size) => {
      pageSize.value = size
      getProducts()
    }

    const handleCategorySelect = (index) => {
      activeCategory.value = index
      currentPage.value = 1
      getProducts()
    }

    const handleFilter = () => {
      currentPage.value = 1
      getProducts()
    }

    const resetFilter = () => {
      filterForm.value = {
        keyword: '',
        minPrice: null,
        maxPrice: null,
        sort: 'createTime_desc'
      }
      currentPage.value = 1
      getProducts()
    }

    const handlePageChange = (page) => {
      currentPage.value = page
      getProducts()
    }

    const goToDetail = (id) => {
      router.push(`/shop/product/${id}`)
    }

    const addToCart = async (product) => {
      if (!store.state.shop.user.isLoggedIn) {
        ElMessage.warning('请先登录')
        router.push('/shop/login')
        return
      }
      try {
        await store.dispatch('shop/cart/addToCart', {
          productId: product.id,
          quantity: 1
        })
        ElMessage.success('添加成功')
      } catch (error) {
        ElMessage.error('添加失败')
      }
    }

    const handleImageError = (e) => {
      e.target.src = placeholderImg
    }

    onMounted(() => {
      getCategories()
      getProducts()
    })

    return {
      activeCategory,
      filterForm,
      currentPage,
      pageSize,
      products,
      total,
      loading,
      categories,
      handleCategorySelect,
      handleFilter,
      resetFilter,
      handlePageChange,
      handleSizeChange,
      goToDetail,
      addToCart,
      handleImageError
    }
  }
}
</script>

<style lang="scss" scoped>
.home-container {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow-y: auto;
  background-color: #f5f7fa;
  padding-top: 60px;

  .page-content {
    max-width: 1400px;
    margin: 0 auto;
    padding: 20px;

    .banner-section {
      margin-bottom: 30px;
      border-radius: 8px;
      overflow: hidden;

      .banner-item {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        font-size: 24px;
      }
    }

    .main-content {
      display: flex;
      gap: 20px;
      position: relative;

      .category-nav {
        width: 240px;
        flex-shrink: 0;

        .category-card {
          position: sticky;
          top: 20px;
          border-radius: 8px;
          
          .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #fff;
          }

          .category-menu {
            border-right: none;
            max-height: calc(100vh - 180px);
            overflow-y: auto;

            .el-menu-item {
              display: flex;
              align-items: center;
              gap: 8px;
              height: 45px;
              
              .category-count {
                margin-left: auto;
                font-size: 12px;
                color: var(--el-text-color-secondary);
              }
            }
          }
        }
      }

      .content-area {
        flex: 1;
        min-width: 0;

        .filter-card {
          margin-bottom: 20px;
          border-radius: 8px;

          .filter-form {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;

            .price-range {
              display: flex;
              align-items: center;
              gap: 8px;
            }

            :deep(.el-select) {
              .option-content {
                display: flex;
                align-items: center;
                gap: 8px;
                
                .el-icon {
                  font-size: 16px;
                }
              }
            }

            :deep(.el-select-dropdown__item) {
              padding: 8px 20px;

              &.selected {
                font-weight: bold;
                color: var(--el-color-primary);

                .option-content {
                  color: var(--el-color-primary);
                }
              }
            }
          }
        }

        .products-wrapper {
          .el-row {
            margin-right: -10px !important;
            margin-left: -10px !important;
          }

          .el-col {
            padding-right: 10px !important;
            padding-left: 10px !important;
          }

          .product-card {
            margin-bottom: 20px;
            border-radius: 8px;
            transition: all 0.3s ease;

            &:hover {
              transform: translateY(-5px);
              box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);

              .image-overlay {
                opacity: 1;
              }
            }

            .product-image {
              position: relative;
              height: 220px;
              overflow: hidden;
              cursor: pointer;

              .el-image {
                width: 100%;
                height: 100%;
              }

              .image-error {
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                background: #f5f7fa;
                color: var(--el-text-color-secondary);
                font-size: 24px;
              }

              .image-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.3);
                display: flex;
                justify-content: center;
                align-items: center;
                opacity: 0;
                transition: opacity 0.3s ease;
                color: #fff;
                font-size: 16px;
              }
            }

            .product-info {
              padding: 15px;

              .product-name {
                margin: 0 0 12px;
                font-size: 14px;
                font-weight: normal;
                color: var(--el-text-color-primary);
                cursor: pointer;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                min-height: 42px;
                line-height: 1.5;

                &:hover {
                  color: var(--el-color-primary);
                }
              }

              .product-meta {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 12px;

                .product-price {
                  font-size: 18px;
                  font-weight: bold;
                  color: var(--el-color-danger);
                }

                .product-sales {
                  font-size: 12px;
                  color: var(--el-text-color-secondary);
                }
              }

              .product-action {
                text-align: center;

                .el-button {
                  width: 100%;
                }
              }
            }
          }
        }

        .pagination-container {
          margin: 30px 0;
          display: flex;
          justify-content: center;
          background: #fff;
          padding: 20px 0;
        }
      }
    }
  }
}

@media screen and (max-width: 1200px) {
  .home-container {
    .page-content {
      padding: 15px;

      .banner-section {
        margin-bottom: 20px;
      }

      .main-content {
        flex-direction: column;

        .category-nav {
          width: 100%;
          margin-bottom: 20px;

          .category-card {
            position: static;
            
            .category-menu {
              max-height: none;
              overflow: visible;
            }
          }
        }
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .home-container {
    padding-top: 50px;

    .page-content {
      padding: 10px;

      .banner-section {
        margin-bottom: 15px;

        :deep(.el-carousel) {
          height: 200px !important;
        }
      }

      .main-content {
        .filter-card {
          .filter-form {
            flex-direction: column;
            gap: 10px;

            .el-form-item {
              margin-bottom: 0;
              width: 100%;

              .el-input,
              .el-select,
              .price-range {
                width: 100%;
              }
            }
          }
        }
      }
    }
  }
}
</style> 