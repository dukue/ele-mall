<template>
  <div class="order-list-container">
    <el-card class="order-card" v-loading="loading">
      <template #header>
        <span>我的订单</span>
      </template>

      <!-- 订单为空 -->
      <div v-if="!orders.length" class="empty-orders">
        <el-empty description="暂无订单">
          <el-button type="primary" @click="$router.push('/shop')">去购物</el-button>
        </el-empty>
      </div>

      <!-- 订单列表 -->
      <div v-else class="order-list">
        <el-card v-for="order in orders" :key="order.orderId" class="order-item" shadow="hover">
          <div class="order-header">
            <div class="order-info">
              <span class="order-id">订单号：{{ order.orderId }}</span>
              <span class="order-time">{{ formatTime(order.createTime) }}</span>
            </div>
            <div class="order-status">
              <el-tag :type="getStatusType(order.status)">
                {{ order.statusText }}
              </el-tag>
            </div>
          </div>

          <div class="order-content">
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
              </div>
            </div>

            <div class="order-footer">
              <div class="total-amount">
                共 {{ getTotalQuantity(order.items) }} 件商品
                合计：<span class="price">¥ {{ order.totalAmount }}</span>
              </div>
              <div class="order-actions">
                <el-button 
                  type="text"
                  @click="$router.push(`/shop/order/${order.orderId}`)">
                  查看详情
                </el-button>
                <el-button 
                  v-if="order.status === 'pending'"
                  type="danger"
                  size="small"
                  @click="handleCancel(order.orderId)">
                  取消订单
                </el-button>
                <el-button 
                  v-if="order.status === 'shipped'"
                  type="primary"
                  size="small"
                  @click="handleConfirm(order.orderId)">
                  确认收货
                </el-button>
              </div>
            </div>
          </div>
        </el-card>
      </div>

      <!-- 分页 -->
      <div class="pagination-container" v-if="total > 0">
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
import { formatDate } from '@/utils/date'

export default {
  name: 'OrderList',
  data() {
    return {
      loading: false,
      orders: [],
      total: 0,
      currentPage: 1,
      pageSize: 10
    }
  },
  created() {
    this.getOrders()
  },
  methods: {
    async getOrders() {
      this.loading = true
      try {
        const { data } = await this.$store.dispatch('shop/order/getOrders')
        this.orders = data.list
        this.total = data.total
      } catch (error) {
        this.$message.error('获取订单列表失败')
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
    getTotalQuantity(items) {
      return items.reduce((total, item) => total + item.quantity, 0)
    },
    async handleCancel(orderId) {
      try {
        await this.$confirm('确定要取消该订单吗？', '提示', {
          type: 'warning'
        })
        await this.$store.dispatch('shop/order/cancelOrder', orderId)
        this.$message.success('订单已取消')
        this.getOrders()
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error('取消订单失败')
        }
      }
    },
    async handleConfirm(orderId) {
      try {
        await this.$confirm('确认已收到商品？', '提示', {
          type: 'warning'
        })
        await this.$store.dispatch('shop/order/confirmOrder', orderId)
        this.$message.success('确认收货成功')
        this.getOrders()
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error('确认收货失败')
        }
      }
    },
    handlePageChange() {
      this.getOrders()
    },
    goToProduct(id) {
      this.$router.push(`/shop/product/${id}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.order-list-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;

  .order-card {
    .card-header {
      font-size: 18px;
      font-weight: bold;
    }

    .empty-orders {
      padding: 40px 0;
      text-align: center;
    }

    .order-list {
      .order-item {
        margin-bottom: 20px;

        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 15px;
          border-bottom: 1px solid #ebeef5;

          .order-info {
            .order-id {
              margin-right: 20px;
              color: #303133;
            }
            .order-time {
              color: #909399;
              font-size: 14px;
            }
          }
        }

        .order-content {
          padding: 15px 0;

          .product-list {
            .product-item {
              display: flex;
              align-items: center;
              padding: 10px 0;

              img {
                width: 60px;
                height: 60px;
                object-fit: cover;
                margin-right: 15px;
              }

              .product-info {
                flex: 1;

                h4 {
                  margin: 0 0 8px;
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
            }
          }

          .order-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid #ebeef5;

            .total-amount {
              color: #606266;
              font-size: 14px;

              .price {
                color: #f56c6c;
                font-size: 16px;
                font-weight: bold;
              }
            }

            .order-actions {
              display: flex;
              gap: 10px;
            }
          }
        }
      }
    }

    .pagination-container {
      margin-top: 20px;
      text-align: center;
    }
  }
}

@media screen and (max-width: 768px) {
  .order-list-container {
    .order-card {
      .order-list {
        .order-item {
          .order-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }

          .order-content {
            .product-list {
              .product-item {
                flex-direction: column;
                text-align: center;

                img {
                  margin: 0 0 10px;
                }
              }
            }

            .order-footer {
              flex-direction: column;
              gap: 15px;
              text-align: center;

              .order-actions {
                justify-content: center;
              }
            }
          }
        }
      }
    }
  }
}
</style> 