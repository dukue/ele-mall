<template>
  <div class="product-list-container">
    <el-card class="filter-card">
      <el-form :inline="true" :model="filterForm" class="filter-form">
        <el-form-item label="商品名称">
          <el-input v-model="filterForm.name" placeholder="请输入商品名称"></el-input>
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="filterForm.categoryId" placeholder="请选择分类">
            <el-option
              v-for="category in categories"
              :key="category.id"
              :label="category.name"
              :value="category.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="product-card" v-loading="loading">
      <div class="product-grid">
        <el-card
          v-for="product in products"
          :key="product.id"
          class="product-item"
          shadow="hover"
          @click="goToDetail(product.id)"
        >
          <img :src="product.image" class="product-image" />
          <div class="product-info">
            <h3 class="product-name">{{ product.name }}</h3>
            <p class="product-price">¥{{ product.price.toFixed(2) }}</p>
          </div>
        </el-card>
      </div>

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
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'ProductList',
  data() {
    return {
      loading: false,
      filterForm: {
        name: '',
        categoryId: ''
      },
      categories: [],
      products: [],
      total: 0,
      pageSize: 12,
      currentPage: 1
    }
  },
  created() {
    this.getCategories()
    this.getProducts()
  },
  methods: {
    async getCategories() {
      try {
        const { data } = await this.$store.dispatch('shop/product/getCategories')
        this.categories = data.list
      } catch (error) {
        this.$message.error('获取分类列表失败')
      }
    },
    async getProducts() {
      this.loading = true
      try {
        const { data } = await this.$store.dispatch('shop/product/getProducts', {
          page: this.currentPage,
          pageSize: this.pageSize,
          ...this.filterForm
        })
        this.products = data.list
        this.total = data.total
      } catch (error) {
        this.$message.error('获取商品列表失败')
      } finally {
        this.loading = false
      }
    },
    handleSearch() {
      this.currentPage = 1
      this.getProducts()
    },
    resetFilter() {
      this.filterForm = {
        name: '',
        categoryId: ''
      }
      this.handleSearch()
    },
    handlePageChange(page) {
      this.currentPage = page
      this.getProducts()
    },
    goToDetail(id) {
      this.$router.push(`/shop/product/${id}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.product-list-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;

  .filter-card {
    margin-bottom: 20px;
  }

  .product-card {
    .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 20px;

      .product-item {
        cursor: pointer;
        transition: transform 0.3s;

        &:hover {
          transform: translateY(-5px);
        }

        .product-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
        }

        .product-info {
          padding: 10px;

          .product-name {
            margin: 0 0 10px;
            font-size: 16px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .product-price {
            margin: 0;
            color: #f56c6c;
            font-size: 18px;
            font-weight: bold;
          }
        }
      }
    }

    .pagination-container {
      text-align: center;
      margin-top: 20px;
    }
  }
}

@media screen and (max-width: 768px) {
  .product-list-container {
    .filter-card {
      .filter-form {
        .el-form-item {
          margin-right: 0;
          margin-bottom: 10px;
          width: 100%;

          .el-input,
          .el-select {
            width: 100%;
          }
        }
      }
    }

    .product-card {
      .product-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  }
}
</style> 