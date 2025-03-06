<template>
  <div class="cart-container">
    <el-card class="cart-card" v-loading="loading">
      <template #header>
        <span>我的购物车</span>
      </template>

      <!-- 购物车为空 -->
      <div v-if="!cartItems.length" class="empty-cart">
        <el-empty description="购物车是空的">
          <el-button type="primary" @click="$router.push('/shop')">去购物</el-button>
        </el-empty>
      </div>

      <!-- 购物车列表 -->
      <div v-else class="cart-content">
        <div class="cart-header">
          <el-checkbox v-model="selectAll" @change="handleSelectAll">全选</el-checkbox>
          <span class="column-product">商品信息</span>
          <span class="column-price">单价</span>
          <span class="column-quantity">数量</span>
          <span class="column-total">小计</span>
          <span class="column-action">操作</span>
        </div>

        <div class="cart-items">
          <div v-for="item in cartItems" :key="item.id" class="cart-item">
            <el-checkbox v-model="item.selected" @change="handleItemSelect"></el-checkbox>
            <div class="item-info">
              <img :src="item.productImage" :alt="item.productName">
              <div class="product-info">
                <h3 @click="goToProduct(item.productId)">{{ item.productName }}</h3>
              </div>
            </div>
            <div class="item-price">¥ {{ item.price }}</div>
            <div class="item-quantity">
              <el-input-number 
                v-model="item.quantity" 
                :min="1" 
                :max="99"
                size="small"
                @change="(value) => handleQuantityChange(item.id, value)">
              </el-input-number>
            </div>
            <div class="item-total">¥ {{ (item.price * item.quantity).toFixed(2) }}</div>
            <div class="item-action">
              <el-button 
                type="text" 
                class="delete-btn"
                @click="handleDelete(item.id)">
                删除
              </el-button>
            </div>
          </div>
        </div>

        <!-- 购物车底部 -->
        <div class="cart-footer">
          <div class="footer-left">
            <el-button @click="handleClearSelected">清空选中</el-button>
          </div>
          <div class="footer-right">
            <div class="selected-info">
              已选择 <span class="selected-count">{{ selectedCount }}</span> 件商品
              合计：<span class="total-price">¥ {{ totalPrice.toFixed(2) }}</span>
            </div>
            <el-button 
              type="primary" 
              size="large"
              :disabled="!selectedCount"
              @click="handleCheckout">
              去结算
            </el-button>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'ShoppingCart',
  data() {
    return {
      loading: false,
      selectAll: false
    }
  },
  computed: {
    ...mapState({
      cartItems: state => state.shop.cart.items
    }),
    selectedCount() {
      return this.cartItems.filter(item => item.selected).length
    },
    totalPrice() {
      return this.cartItems
        .filter(item => item.selected)
        .reduce((total, item) => total + item.price * item.quantity, 0)
    }
  },
  created() {
    this.getCartItems()
  },
  methods: {
    async getCartItems() {
      this.loading = true
      try {
        await this.$store.dispatch('shop/cart/getCart')
        // 为每个商品添加selected属性
        this.cartItems.forEach(item => {
          this.$set(item, 'selected', false)
        })
      } catch (error) {
        this.$message.error('获取购物车失败')
      } finally {
        this.loading = false
      }
    },
    handleSelectAll(val) {
      this.cartItems.forEach(item => {
        item.selected = val
      })
    },
    handleItemSelect() {
      this.selectAll = this.cartItems.every(item => item.selected)
    },
    async handleQuantityChange(id, quantity) {
      try {
        await this.$store.dispatch('shop/cart/updateCartItem', { id, quantity })
      } catch (error) {
        this.$message.error('更新数量失败')
      }
    },
    async handleDelete(id) {
      try {
        await this.$confirm('确定要删除该商品吗？', '提示', {
          type: 'warning'
        })
        await this.$store.dispatch('shop/cart/removeFromCart', id)
        this.$message.success('删除成功')
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error('删除失败')
        }
      }
    },
    async handleClearSelected() {
      try {
        const selectedItems = this.cartItems.filter(item => item.selected)
        if (!selectedItems.length) {
          this.$message.warning('请先选择商品')
          return
        }
        await this.$confirm('确定要清空选中的商品吗？', '提示', {
          type: 'warning'
        })
        await Promise.all(
          selectedItems.map(item => 
            this.$store.dispatch('shop/cart/removeFromCart', item.id)
          )
        )
        this.$message.success('清空成功')
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error('清空失败')
        }
      }
    },
    handleCheckout() {
      const selectedItems = this.cartItems.filter(item => item.selected)
      if (!selectedItems.length) {
        this.$message.warning('请先选择商品')
        return
      }
      this.$router.push('/shop/checkout')
    },
    goToProduct(id) {
      this.$router.push(`/shop/product/${id}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.cart-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;

  .cart-card {
    .card-header {
      font-size: 18px;
      font-weight: bold;
    }

    .empty-cart {
      padding: 40px 0;
      text-align: center;
    }

    .cart-content {
      .cart-header {
        display: grid;
        grid-template-columns: 50px 400px 150px 150px 150px 100px;
        align-items: center;
        padding: 15px 0;
        border-bottom: 1px solid #ebeef5;
        font-size: 14px;
        color: #606266;
      }

      .cart-items {
        .cart-item {
          display: grid;
          grid-template-columns: 50px 400px 150px 150px 150px 100px;
          align-items: center;
          padding: 20px 0;
          border-bottom: 1px solid #ebeef5;

          .item-info {
            display: flex;
            align-items: center;
            gap: 15px;

            img {
              width: 80px;
              height: 80px;
              object-fit: cover;
            }

            .product-info {
              h3 {
                margin: 0;
                font-size: 14px;
                cursor: pointer;
                &:hover {
                  color: #409EFF;
                }
              }
            }
          }

          .item-price, .item-total {
            color: #f56c6c;
          }

          .delete-btn {
            color: #f56c6c;
          }
        }
      }

      .cart-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 0;

        .footer-right {
          display: flex;
          align-items: center;
          gap: 20px;

          .selected-info {
            font-size: 14px;
            .selected-count {
              color: #409EFF;
              margin: 0 5px;
            }
            .total-price {
              color: #f56c6c;
              font-size: 20px;
              font-weight: bold;
            }
          }
        }
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .cart-container {
    .cart-card {
      .cart-content {
        .cart-header {
          display: none;
        }

        .cart-items {
          .cart-item {
            grid-template-columns: 1fr;
            gap: 10px;
            padding: 10px;

            .item-info {
              flex-direction: column;
              text-align: center;
            }

            .item-price, .item-quantity, .item-total, .item-action {
              text-align: center;
            }
          }
        }

        .cart-footer {
          flex-direction: column;
          gap: 20px;

          .footer-right {
            flex-direction: column;
            width: 100%;

            .el-button {
              width: 100%;
            }
          }
        }
      }
    }
  }
}
</style> 