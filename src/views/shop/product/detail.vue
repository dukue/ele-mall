<template>
  <div class="product-detail-container">
    <el-card class="product-card" v-loading="loading">
      <div class="product-content">
        <div class="product-gallery">
          <img :src="product.image" class="product-image" />
        </div>
        <div class="product-info">
          <h1 class="product-name">{{ product.name }}</h1>
          <div class="product-price">
            <span class="price-label">价格：</span>
            <span class="price-value">¥{{ product.price ? product.price.toFixed(2) : '0.00' }}</span>
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
            <div class="detail-content" v-html="product.detail"></div>
          </el-tab-pane>
          <el-tab-pane label="规格参数" name="params">
            <el-table :data="product.params" border stripe>
              <el-table-column prop="name" label="参数名"></el-table-column>
              <el-table-column prop="value" label="参数值"></el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'ProductDetail',
  data() {
    return {
      loading: false,
      submitting: false,
      product: {},
      quantity: 1,
      activeTab: 'detail'
    }
  },
  created() {
    this.getProductDetail()
  },
  methods: {
    async getProductDetail() {
      this.loading = true
      try {
        const { data } = await this.$store.dispatch('shop/product/getProductDetail', this.$route.params.id)
        this.product = data
      } catch (error) {
        this.$message.error('获取商品详情失败')
      } finally {
        this.loading = false
      }
    },
    async addToCart() {
      if (!this.checkLogin()) return
      
      this.submitting = true
      try {
        await this.$store.dispatch('shop/cart/addToCart', {
          productId: this.product.id,
          quantity: this.quantity
        })
        this.$message.success('添加成功')
      } catch (error) {
        this.$message.error(error.message || '添加失败')
      } finally {
        this.submitting = false
      }
    },
    async buyNow() {
      if (!this.checkLogin()) return
      
      try {
        await this.$store.dispatch('shop/cart/addToCart', {
          productId: this.product.id,
          quantity: this.quantity
        })
        this.$router.push('/shop/checkout')
      } catch (error) {
        this.$message.error(error.message || '操作失败')
      }
    },
    checkLogin() {
      if (!this.$store.state.shop.user.token) {
        this.$message.warning('请先登录')
        this.$router.push('/shop/login')
        return false
      }
      return true
    }
  }
}
</script>

<style lang="scss" scoped>
.product-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;

  .product-card {
    .product-content {
      display: flex;
      gap: 40px;
      margin-bottom: 40px;

      .product-gallery {
        flex: 0 0 400px;

        .product-image {
          width: 100%;
          height: 400px;
          object-fit: cover;
        }
      }

      .product-info {
        flex: 1;

        .product-name {
          margin: 0 0 20px;
          font-size: 24px;
          line-height: 1.4;
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
        }

        .product-actions {
          display: flex;
          gap: 20px;
        }
      }
    }

    .product-detail {
      .detail-content {
        padding: 20px 0;
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .product-detail-container {
    .product-card {
      .product-content {
        flex-direction: column;

        .product-gallery {
          flex: none;
          width: 100%;

          .product-image {
            height: 300px;
          }
        }
      }
    }
  }
}
</style> 