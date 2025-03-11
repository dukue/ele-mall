<template>
  <div class="checkout-container">
    <el-card class="checkout-card" v-loading="loading">
      <template #header>
        <span>订单结算</span>
      </template>

      <!-- 收货地址 -->
      <div class="address-section">
        <h3 class="section-title">收货地址</h3>
        <div v-if="addresses.length" class="address-list">
          <el-radio-group v-model="selectedAddressId">
            <el-card
              v-for="address in addresses"
              :key="address.id"
              class="address-card"
              :class="{ 'is-selected': selectedAddressId === address.id }"
            >
              <el-radio :label="address.id">
                <div class="address-info">
                  <div class="receiver">
                    <span class="name">{{ address.receiverName }}</span>
                    <span class="phone">{{ address.receiverPhone }}</span>
                    <span v-if="address.isDefault" class="default-tag">默认</span>
                  </div>
                  <div class="address">
                    {{ address.province }}{{ address.city }}{{ address.district }}{{ address.detailAddress }}
                  </div>
                </div>
              </el-radio>
            </el-card>
          </el-radio-group>
          <div class="address-actions">
            <el-button type="text" @click="$router.push('/shop/address')">
              管理收货地址
            </el-button>
          </div>
        </div>
        <div v-else class="no-address">
          <el-empty description="暂无收货地址">
            <el-button type="primary" @click="$router.push('/shop/address')">
              添加收货地址
            </el-button>
          </el-empty>
        </div>
      </div>

      <!-- 商品清单 -->
      <div class="products-section">
        <h3 class="section-title">商品清单</h3>
        <div class="product-list">
          <div v-for="item in selectedItems" :key="item.id" class="product-item">
            <img :src="getImageUrl(item.productImage)" :alt="item.productName">
            <div class="product-info">
              <h4>{{ item.productName }}</h4>
              <div class="price-quantity">
                <span class="price">¥ {{ item.price }}</span>
                <span class="quantity">× {{ item.quantity }}</span>
              </div>
            </div>
            <div class="item-total">
              ¥ {{ (item.price * item.quantity).toFixed(2) }}
            </div>
          </div>
        </div>
      </div>

      <!-- 订单备注 -->
      <div class="remark-section">
        <h3 class="section-title">订单备注</h3>
        <el-input
          v-model="remark"
          type="textarea"
          :rows="2"
          placeholder="请输入订单备注（选填）">
        </el-input>
      </div>

      <!-- 订单金额 -->
      <div class="amount-section">
        <div class="amount-item">
          <span>商品总额：</span>
          <span>¥ {{ totalAmount.toFixed(2) }}</span>
        </div>
        <div class="amount-item">
          <span>运费：</span>
          <span>¥ 0.00</span>
        </div>
        <div class="amount-item total">
          <span>实付金额：</span>
          <span class="final-price">¥ {{ totalAmount.toFixed(2) }}</span>
        </div>
      </div>

      <!-- 提交订单 -->
      <div class="submit-section">
        <el-button 
          type="primary" 
          size="large" 
          :loading="submitting"
          :disabled="!canSubmit"
          @click="handleSubmit">
          提交订单
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getImageUrl } from '@/utils/image'

export default {
  name: 'Checkout',
  data() {
    return {
      loading: false,
      submitting: false,
      selectedAddressId: null,
      remark: '',
      addresses: []
    }
  },
  computed: {
    ...mapState({
      cartItems: state => state.shop.cart.items
    }),
    selectedItems() {
      return this.cartItems.filter(item => item.selected)
    },
    totalAmount() {
      return this.selectedItems.reduce((total, item) => total + item.price * item.quantity, 0)
    },
    canSubmit() {
      return this.selectedAddressId && this.selectedItems.length > 0
    }
  },
  created() {
    this.getAddresses()
    this.checkCartItems()
  },
  methods: {
    getImageUrl(path) {
      return getImageUrl(path)
    },
    async getAddresses() {
      this.loading = true
      try {
        const data = await this.$store.dispatch('shop/address/getAddresses')
        this.addresses = data.list || []
        // 如果有默认地址，选中默认地址
        const defaultAddress = this.addresses.find(addr => addr.isDefault)
        if (defaultAddress) {
          this.selectedAddressId = defaultAddress.id
        } else if (this.addresses.length > 0) {
          this.selectedAddressId = this.addresses[0].id
        }
      } catch (error) {
        console.error('获取地址列表失败:', error)
        this.$message.error('获取地址列表失败')
      } finally {
        this.loading = false
      }
    },
    checkCartItems() {
      if (!this.selectedItems.length) {
        this.$message.warning('请先选择要购买的商品')
        this.$router.push('/shop/cart')
      }
    },
    async handleSubmit() {
      if (!this.canSubmit) {
        this.$message.warning('请选择收货地址')
        return
      }

      this.submitting = true
      try {
        const orderData = {
          addressId: this.selectedAddressId,
          items: this.selectedItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity
          })),
          remark: this.remark
        }

        const { data } = await this.$store.dispatch('shop/order/createOrder', orderData)
        this.$message.success('订单创建成功')
        
        // 清除已购买的商品
        await Promise.all(
          this.selectedItems.map(item =>
            this.$store.dispatch('shop/cart/removeFromCart', item.id)
          )
        )

        // 跳转到订单详情页
        this.$router.push(`/shop/order/${data.orderId}`)
      } catch (error) {
        this.$message.error('创建订单失败')
      } finally {
        this.submitting = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.checkout-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  height: calc(100vh - 80px);
  overflow: hidden;

  .checkout-card {
    height: 100%;
    display: flex;
    flex-direction: column;

    :deep(.el-card__header) {
      padding: 15px 20px;
      border-bottom: 1px solid #ebeef5;
      font-size: 18px;
      font-weight: bold;
    }

    :deep(.el-card__body) {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
    }

    .section-title {
      margin: 0 0 20px;
      padding-bottom: 10px;
      border-bottom: 1px solid #ebeef5;
      font-size: 16px;
      color: #303133;
    }

    .address-section {
      margin-bottom: 30px;

      .address-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
        margin-bottom: 20px;

        .address-card {
          cursor: pointer;
          transition: all 0.3s;

          &.is-selected {
            border-color: #409EFF;
          }

          .address-info {
            margin-left: 25px;

            .receiver {
              margin-bottom: 10px;

              .name {
                font-weight: bold;
                margin-right: 10px;
              }

              .phone {
                color: #606266;
              }

              .default-tag {
                background: #409EFF;
                color: #fff;
                padding: 2px 6px;
                border-radius: 4px;
                font-size: 12px;
                margin-left: 10px;
              }
            }

            .address {
              color: #606266;
              font-size: 14px;
            }
          }
        }
      }
    }

    .products-section {
      margin-bottom: 30px;

      .product-list {
        .product-item {
          display: flex;
          align-items: center;
          padding: 20px 0;
          border-bottom: 1px solid #ebeef5;

          img {
            width: 80px;
            height: 80px;
            object-fit: cover;
            margin-right: 20px;
          }

          .product-info {
            flex: 1;

            h4 {
              margin: 0 0 10px;
              font-size: 14px;
            }

            .price-quantity {
              color: #606266;
              
              .price {
                color: #f56c6c;
                margin-right: 10px;
              }
            }
          }

          .item-total {
            font-size: 16px;
            color: #f56c6c;
            font-weight: bold;
          }
        }
      }
    }

    .remark-section {
      margin-bottom: 30px;
    }

    .amount-section {
      margin-bottom: 30px;
      padding: 20px;
      background: #f5f7fa;
      border-radius: 4px;

      .amount-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        font-size: 14px;

        &.total {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #ebeef5;
          font-size: 16px;

          .final-price {
            color: #f56c6c;
            font-size: 20px;
            font-weight: bold;
          }
        }
      }
    }

    .submit-section {
      text-align: right;

      .el-button {
        width: 200px;
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .checkout-container {
    padding: 10px;
    height: calc(100vh - 60px);
  }
}
</style> 