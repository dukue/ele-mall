<template>
  <div class="home-container">
    <!-- 分类导航 -->
    <div class="category-nav">
      <el-card>
        <template #header>
          <span>商品分类</span>
        </template>
        <el-menu mode="vertical" :default-active="activeCategory" @select="handleCategorySelect">
          <el-menu-item v-for="category in categories" :key="category.id" :index="category.id.toString()">
            <span>{{ category.name }}</span>
            <span class="category-count">({{ category.productCount }})</span>
          </el-menu-item>
        </el-menu>
      </el-card>
    </div>

    <!-- 商品展示区 -->
    <div class="product-container">
      <!-- 商品筛选 -->
      <el-card class="filter-card">
        <el-form :inline="true" :model="filterForm" class="filter-form">
          <el-form-item label="关键词">
            <el-input v-model="filterForm.keyword" placeholder="请输入商品名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="价格区间">
            <el-input-number v-model="filterForm.minPrice" :min="0" placeholder="最低价"></el-input-number>
            <span class="separator">-</span>
            <el-input-number v-model="filterForm.maxPrice" :min="0" placeholder="最高价"></el-input-number>
          </el-form-item>
          <el-form-item label="排序">
            <el-select v-model="filterForm.sort" placeholder="请选择排序方式">
              <el-option label="最新上架" value="createTime_desc"></el-option>
              <el-option label="价格从低到高" value="price_asc"></el-option>
              <el-option label="价格从高到低" value="price_desc"></el-option>
              <el-option label="销量优先" value="sales_desc"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleFilter">筛选</el-button>
            <el-button @click="resetFilter">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <!-- 商品列表 -->
      <el-row :gutter="20" class="product-list">
        <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="product in products" :key="product.id">
          <el-card :body-style="{ padding: '0px' }" class="product-card" shadow="hover">
            <div class="product-image">
              <img 
                :src="product.image" 
                :alt="product.name"
                @error="handleImageError"
              >
            </div>
            <div class="product-info">
              <h3 class="product-name" @click="goToDetail(product.id)">{{ product.name }}</h3>
              <p class="product-price">¥ {{ product.price }}</p>
              <p class="product-sales">销量: {{ product.sales }}</p>
              <div class="product-action">
                <el-button type="primary" size="small" @click="addToCart(product)">加入购物车</el-button>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="total"
          :page-size="pageSize"
          v-model:current-page="currentPage"
          @current-change="handlePageChange">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import placeholderImg from '@/assets/placeholder.jpg'  // 确保这个文件存在

export default {
  name: 'ShopHome',
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

    const categories = computed(() => {
      const cats = store.state.shop.category.list
      console.log('Current categories:', cats)
      return cats
    })

    const products = computed(() => {
      return store.state.shop.product.list
    })

    const total = computed(() => {
      return store.state.shop.product.total
    })

    const getCategories = async () => {
      try {
        console.log('Getting categories...')
        await store.dispatch('shop/category/getCategories')
        console.log('Categories updated')
      } catch (error) {
        console.error('Error in getCategories:', error)
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
          sort: filterForm.value.sort,
          lang: 'zh' // 默认使用中文
        }
        console.log('Getting products with params:', params)
        await store.dispatch('shop/product/getProducts', params)
      } catch (error) {
        console.error('Error in getProducts:', error)
        ElMessage.error('获取商品列表失败')
      } finally {
        loading.value = false
      }
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
      console.log('Home component mounted')
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
      goToDetail,
      addToCart,
      handleImageError
    }
  }
}
</script>

<style lang="scss" scoped>
.home-container {
  display: flex;
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;

  .category-nav {
    width: 200px;
    flex-shrink: 0;

    .category-count {
      float: right;
      color: #909399;
      font-size: 12px;
    }
  }

  .product-container {
    flex: 1;

    .filter-card {
      margin-bottom: 20px;

      .filter-form {
        .separator {
          margin: 0 10px;
        }
      }
    }

    .product-list {
      margin-bottom: 20px;

      .product-card {
        margin-bottom: 20px;
        transition: all 0.3s;

        &:hover {
          transform: translateY(-5px);
        }

        .product-image {
          height: 200px;
          overflow: hidden;
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }

        .product-info {
          padding: 14px;

          .product-name {
            margin: 0;
            font-size: 14px;
            color: #303133;
            cursor: pointer;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;

            &:hover {
              color: #409EFF;
            }
          }

          .product-price {
            color: #f56c6c;
            font-size: 18px;
            margin: 10px 0;
          }

          .product-sales {
            color: #909399;
            font-size: 12px;
            margin: 5px 0;
          }

          .product-action {
            text-align: center;
          }
        }
      }
    }
  }

  .pagination-container {
    text-align: center;
    margin-top: 20px;
  }
}

@media screen and (max-width: 768px) {
  .home-container {
    flex-direction: column;

    .category-nav {
      width: 100%;
    }
  }
}
</style> 