<template>
  <div class="order-detail-container">
    <el-card class="order-card" v-loading="loading">
      <template #header>
        <div class="header-left">
          <el-page-header @back="$router.back()" content="订单详情"></el-page-header>
        </div>
        <div class="header-right">
          <el-tag :type="getStatusType(order.status)" v-if="order">
            {{ order.statusText }}
          </el-tag>
        </div>
      </template>

      <template v-if="order">
        <!-- 订单信息 -->
        <div class="order-info-section">
          <h3 class="section-title">订单信息</h3>
          <div class="info-content">
            <div class="info-item">
              <span class="label">订单编号：</span>
              <span class="value">{{ order.orderId }}</span>
            </div>
            <div class="info-item">
              <span class="label">创建时间：</span>
              <span class="value">{{ formatTime(order.createTime) }}</span>
            </div>
            <div class="info-item" v-if="order.remark">
              <span class="label">订单备注：</span>
              <span class="value">{{ order.remark }}</span>
            </div>
          </div>
        </div>

        <!-- 收货信息 -->
        <div class="address-section">
          <h3 class="section-title">收货信息</h3>
          <div class="address-content">
            <div class="receiver-info">
              <span class="name">{{ order.address.receiverName }}</span>
              <span class="phone">{{ order.address.receiverPhone }}</span>
            </div>
            <div class="address">
              {{ order.address.fullAddress }}
            </div>
          </div>
        </div>

        <!-- 商品信息 -->
        <div class="products-section">
          <h3 class="section-title">商品信息</h3>
          <div class="product-list">
            <div v-for="item in order.items" :key="item.productId" class="product-item">
              <img :src="item.productImage" :alt="item.productName">
              <div class="product-info">
                <h4 @click="goToProduct(item.productId)">{{ item.productName }}</h4>
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

        <!-- 订单金额 -->
        <div class="amount-section">
          <div class="amount-item">
            <span>商品总额：</span>
            <span>¥ {{ order.totalAmount }}</span>
          </div>
          <div class="amount-item">
            <span>运费：</span>
            <span>¥ 0.00</span>
          </div>
          <div class="amount-item total">
            <span>实付金额：</span>
            <span class="final-price">¥ {{ order.totalAmount }}</span>
          </div>
        </div>

        <!-- 订单操作 -->
        <div class="order-actions" v-if="showActions">
          <el-button 
            v-if="order.status === 'pending'"
            type="danger"
            @click="handleCancel">
            取消订单
          </el-button>
          <el-button 
            v-if="order.status === 'shipped'"
            type="primary"
            @click="handleConfirm">
            确认收货
          </el-button>
        </div>
      </template>
    </el-card>
  </div>
</template>

<script>
import { formatDate } from '@/utils/date'

export default {
  name: 'OrderDetail',
  data() {
    return {
      loading: false,
      order: null
    }
  },
  computed: {
    showActions() {
      return this.order && ['pending', 'shipped'].includes(this.order.status)
    }
  },
  created() {
    this.getOrderDetail()
  },
  methods: {
    async getOrderDetail() {
      this.loading = true
      try {
        const { data } = await this.$store.dispatch('shop/order/getOrderDetail', this.$route.params.id)
        this.order = data
      } catch (error) {
        this.$message.error('获取订单详情失败')
      } finally {
        this.loading = false
      }
    },
    formatTime(time) {
      return formatDate(new Date(time), 'yyyy-MM-dd HH:mm:ss')
    },
    getStatusType(status) {
      const statusMap = {
        pending: 'warning',
        paid: 'primary',
        shipped: 'success',
        completed: '',
        cancelled: 'info'
      }
      return statusMap[status] || ''
    },
    async handleCancel() {
      try {
        await this.$confirm('确定要取消该订单吗？', '提示', {
          type: 'warning'
        })
        await this.$store.dispatch('shop/order/cancelOrder', this.order.orderId)
        this.$message.success('订单已取消')
        this.getOrderDetail()
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error('取消订单失败')
        }
      }
    },
    async handleConfirm() {
      try {
        await this.$confirm('确认已收到商品？', '提示', {
          type: 'warning'
        })
        await this.$store.dispatch('shop/order/confirmOrder', this.order.orderId)
        this.$message.success('确认收货成功')
        this.getOrderDetail()
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error('确认收货失败')
        }
      }
    },
    goToProduct(id) {
      this.$router.push(`/shop/product/${id}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.order-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;

  .order-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .section-title {
      margin: 0 0 20px;
      padding-bottom: 10px;
      border-bottom: 1px solid #ebeef5;
      font-size: 16px;
      color: #303133;
    }

    .order-info-section {
      margin-bottom: 30px;

      .info-content {
        .info-item {
          margin-bottom: 10px;
          font-size: 14px;

          .label {
            color: #909399;
            margin-right: 10px;
          }

          .value {
            color: #303133;
          }
        }
      }
    }

    .address-section {
      margin-bottom: 30px;

      .address-content {
        padding: 15px;
        background: #f5f7fa;
        border-radius: 4px;

        .receiver-info {
          margin-bottom: 10px;

          .name {
            font-weight: bold;
            margin-right: 20px;
          }

          .phone {
            color: #606266;
          }
        }

        .address {
          color: #606266;
          font-size: 14px;
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
              cursor: pointer;
              &:hover {
                color: #409EFF;
              }
            }

            .price-quantity {
              color: #606266;
              font-size: 14px;

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

    .amount-section {
      margin-bottom: 30px;
      padding: 20px;
      background: #f5f7fa;
      border-radius: 4px;

      .amount-item {
        display: flex;
        justify-content: flex-end;
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

        span:first-child {
          margin-right: 20px;
        }
      }
    }

    .order-actions {
      text-align: right;
      padding-top: 20px;
      border-top: 1px solid #ebeef5;
    }
  }
}

@media screen and (max-width: 768px) {
  .order-detail-container {
    .order-card {
      .products-section {
        .product-list {
          .product-item {
            flex-direction: column;
            text-align: center;

            img {
              margin: 0 0 10px;
            }

            .product-info {
              margin-bottom: 10px;
            }

            .item-total {
              margin-top: 10px;
            }
          }
        }
      }

      .amount-section {
        .amount-item {
          justify-content: space-between;
        }
      }

      .order-actions {
        text-align: center;

        .el-button {
          width: 100%;
          margin-bottom: 10px;
        }
      }
    }
  }
}
</style> 