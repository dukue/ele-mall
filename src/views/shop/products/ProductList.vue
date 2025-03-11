<template>
  <div class="page-container">
    <div class="products-container">
      <!-- 筛选区域 -->
      <div class="filter-section">
        <el-card shadow="never">
          <el-form :inline="true" :model="filterForm" class="filter-form">
            <el-form-item label="关键词">
              <el-input 
                v-model="filterForm.keyword" 
                placeholder="搜索商品名称" 
                clearable
                @keyup.enter="handleFilter">
                <template #prefix>
                  <el-icon><Search /></el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label="分类">
              <el-select 
                v-model="filterForm.categoryId" 
                placeholder="选择分类"
                clearable>
                <el-option
                  v-for="category in categories"
                  :key="category.id"
                  :label="category.name"
                  :value="category.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="价格区间">
              <div class="price-range">
                <el-input-number 
                  v-model="filterForm.minPrice" 
                  :min="0" 
                  placeholder="最低价"
                  :controls="false"
                  :precision="2">
                </el-input-number>
                <span class="separator">-</span>
                <el-input-number 
                  v-model="filterForm.maxPrice" 
                  :min="0" 
                  placeholder="最高价"
                  :controls="false"
                  :precision="2">
                </el-input-number>
              </div>
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
      </div>

      <!-- 排序工具栏 -->
      <div class="toolbar">
        <div class="sort-buttons">
          <el-radio-group v-model="filterForm.sort" @change="handleFilter">
            <el-radio-button label="createTime_desc">最新</el-radio-button>
            <el-radio-button label="price_asc">价格从低到高</el-radio-button>
            <el-radio-button label="price_desc">价格从高到低</el-radio-button>
            <el-radio-button label="sales_desc">销量优先</el-radio-button>
          </el-radio-group>
        </div>
        <div class="view-switch">
          <el-switch
            v-model="isGridView"
            active-text="网格视图"
            inactive-text="列表视图">
          </el-switch>
        </div>
      </div>

      <!-- 商品列表 -->
      <div class="products-list" v-loading="loading">
        <template v-if="isGridView">
          <el-row :gutter="20">
            <el-col 
              v-for="product in products" 
              :key="product.id"
              :xs="24"
              :sm="12"
              :md="8"
              :lg="6"
              :xl="4">
              <el-card 
                class="product-card" 
                shadow="hover" 
                @click="goToDetail(product.id)">
                <div class="product-image">
                  <el-image 
                    :src="product.image" 
                    fit="cover"
                    :preview-src-list="[product.image]"
                    loading="lazy">
                    <template #error>
                      <div class="image-error">
                        <el-icon><Picture /></el-icon>
                      </div>
                    </template>
                  </el-image>
                </div>
                <div class="product-info">
                  <h3 class="product-name">{{ product.name }}</h3>
                  <div class="product-price">
                    <span class="price-symbol">¥</span>
                    <span class="price-value">{{ Number(product.price || 0).toFixed(2) }}</span>
                  </div>
                  <div class="product-meta">
                    <span class="sales">已售 {{ product.sales }}</span>
                    <el-button 
                      type="primary" 
                      size="small" 
                      circle
                      @click.stop="addToCart(product)">
                      <el-icon><ShoppingCart /></el-icon>
                    </el-button>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </template>
        <template v-else>
          <el-table :data="products" style="width: 100%">
            <el-table-column prop="image" label="商品图片" width="120">
              <template #default="{ row }">
                <el-image 
                  :src="row.image" 
                  fit="cover" 
                  style="width: 80px; height: 80px"
                  :preview-src-list="[row.image]">
                </el-image>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="商品名称" min-width="200">
              <template #default="{ row }">
                <div class="product-name-cell" @click="goToDetail(row.id)">
                  {{ row.name }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="price" label="价格" width="120">
              <template #default="{ row }">
                <span class="price">¥{{ Number(row.price || 0).toFixed(2) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="sales" label="销量" width="100">
              <template #default="{ row }">
                <span class="sales">{{ row.sales }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120" fixed="right">
              <template #default="{ row }">
                <el-button 
                  type="primary" 
                  size="small"
                  @click="addToCart(row)">
                  加入购物车
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>

        <!-- 分页器 -->
        <div class="pagination-container">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[12, 24, 36, 48]"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            background>
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  Search,
  RefreshRight,
  Picture,
  ShoppingCart
} from '@element-plus/icons-vue'

export default {
  name: 'ShopProductList',
  components: {
    Search,
    RefreshRight,
    Picture,
    ShoppingCart
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    
    // 状态
    const loading = ref(false)
    const isGridView = ref(true)
    const currentPage = ref(1)
    const pageSize = ref(12)
    const filterForm = ref({
      keyword: '',
      categoryId: '',
      minPrice: null,
      maxPrice: null,
      sort: 'createTime_desc'
    })

    // 计算属性
    const categories = computed(() => store.state.shop.category.list)
    const products = computed(() => store.state.shop.product.list)
    const total = computed(() => store.state.shop.product.total)

    // 方法
    const getProducts = async () => {
      loading.value = true
      try {
        const params = {
          page: currentPage.value,
          pageSize: pageSize.value,
          ...filterForm.value,
          categoryId: filterForm.value.categoryId || undefined,
          keyword: filterForm.value.keyword || undefined
        }
        await store.dispatch('shop/product/getProducts', params)
      } catch (error) {
        ElMessage.error('获取商品列表失败')
      } finally {
        loading.value = false
      }
    }

    const handleFilter = () => {
      currentPage.value = 1
      getProducts()
    }

    const resetFilter = () => {
      filterForm.value = {
        keyword: '',
        categoryId: '',
        minPrice: null,
        maxPrice: null,
        sort: 'createTime_desc'
      }
      handleFilter()
    }

    const handleSizeChange = (val) => {
      pageSize.value = val
      getProducts()
    }

    const handleCurrentChange = (val) => {
      currentPage.value = val
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

    // 生命周期
    onMounted(async () => {
      await store.dispatch('shop/category/getCategories')
      getProducts()
    })

    return {
      loading,
      isGridView,
      currentPage,
      pageSize,
      filterForm,
      categories,
      products,
      total,
      handleFilter,
      resetFilter,
      handleSizeChange,
      handleCurrentChange,
      goToDetail,
      addToCart
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
  padding-top: 60px;
}

.products-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;

  .filter-section {
    margin-bottom: 20px;

    .filter-form {
      display: flex;
      flex-wrap: wrap;
      gap: 15px;

      .price-range {
        display: flex;
        align-items: center;
        gap: 8px;

        .separator {
          color: var(--el-text-color-secondary);
        }
      }
    }
  }

  .toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding: 10px 20px;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);

    .sort-buttons {
      .el-radio-button__inner {
        padding: 8px 15px;
      }
    }
  }

  .products-list {
    .product-card {
      margin-bottom: 20px;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
      }

      .product-image {
        height: 200px;
        overflow: hidden;

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
      }

      .product-info {
        padding: 15px;

        .product-name {
          margin: 0 0 10px;
          font-size: 14px;
          line-height: 1.4;
          height: 40px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .product-price {
          margin-bottom: 10px;
          color: var(--el-color-danger);

          .price-symbol {
            font-size: 14px;
          }

          .price-value {
            font-size: 20px;
            font-weight: bold;
          }
        }

        .product-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .sales {
            font-size: 12px;
            color: var(--el-text-color-secondary);
          }
        }
      }
    }

    .product-name-cell {
      color: var(--el-color-primary);
      cursor: pointer;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }

  .pagination-container {
    margin-top: 30px;
    padding: 20px 0;
    text-align: center;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  }
}

@media screen and (max-width: 768px) {
  .products-container {
    padding: 10px;

    .filter-section {
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

    .toolbar {
      flex-direction: column;
      gap: 10px;
      padding: 10px;

      .sort-buttons {
        width: 100%;
        overflow-x: auto;
        white-space: nowrap;
        
        .el-radio-group {
          display: flex;
        }
      }

      .view-switch {
        width: 100%;
        display: flex;
        justify-content: center;
      }
    }
  }
}
</style> 