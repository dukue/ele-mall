<template>
  <div class="user-center-container">
    <!-- 用户信息卡片 -->
    <el-card class="user-info-card" v-loading="loading">
      <div class="user-header">
        <div class="avatar-wrapper">
          <el-avatar :size="80" :src="userInfo.avatar">
            {{ userInfo.username ? userInfo.username[0].toUpperCase() : 'U' }}
          </el-avatar>
        </div>
        <div class="user-info">
          <h2 class="username">{{ userInfo.username }}</h2>
          <p class="user-contact">
            <i class="el-icon-phone"></i> {{ userInfo.mobile }}
            <i class="el-icon-message" style="margin-left: 20px"></i> {{ userInfo.email }}
          </p>
        </div>
      </div>
    </el-card>

    <!-- 功能区域 -->
    <div class="features-container">
      <el-row :gutter="20">
        <!-- 订单概览 -->
        <el-col :xs="24" :sm="12" :md="8">
          <el-card class="feature-card" shadow="hover">
            <template #header>
              <span>我的订单</span>
              <el-button type="text" @click="$router.push('/shop/orders')">查看全部</el-button>
            </template>
            <div class="order-overview">
              <div class="overview-item" @click="goToOrders('pending')">
                <i class="el-icon-wallet"></i>
                <span>待付款</span>
                <el-badge :value="orderCounts.pending" class="count-badge" v-if="orderCounts.pending"></el-badge>
              </div>
              <div class="overview-item" @click="goToOrders('paid')">
                <i class="el-icon-box"></i>
                <span>待发货</span>
                <el-badge :value="orderCounts.paid" class="count-badge" v-if="orderCounts.paid"></el-badge>
              </div>
              <div class="overview-item" @click="goToOrders('shipped')">
                <i class="el-icon-truck"></i>
                <span>待收货</span>
                <el-badge :value="orderCounts.shipped" class="count-badge" v-if="orderCounts.shipped"></el-badge>
              </div>
              <div class="overview-item" @click="goToOrders('completed')">
                <i class="el-icon-circle-check"></i>
                <span>已完成</span>
              </div>
            </div>
          </el-card>
        </el-col>

        <!-- 收货地址 -->
        <el-col :xs="24" :sm="12" :md="8">
          <el-card class="feature-card" shadow="hover">
            <template #header>
              <span>收货地址</span>
              <el-button type="text" @click="$router.push('/shop/address')">管理</el-button>
            </template>
            <div class="address-list" v-loading="addressLoading">
              <div v-if="addresses.length" class="address-item">
                <div class="address-info">
                  <p class="receiver">
                    <span class="name">{{ defaultAddress.receiverName }}</span>
                    <span class="phone">{{ defaultAddress.receiverPhone }}</span>
                  </p>
                  <p class="address-detail">
                    {{ getFullAddress(defaultAddress) }}
                  </p>
                </div>
                <el-tag size="small" type="success">默认地址</el-tag>
              </div>
              <el-empty v-else description="暂无收货地址">
                <el-button type="primary" size="small" @click="$router.push('/shop/address')">
                  添加地址
                </el-button>
              </el-empty>
            </div>
          </el-card>
        </el-col>

        <!-- 账户安全 -->
        <el-col :xs="24" :sm="12" :md="8">
          <el-card class="feature-card" shadow="hover">
            <template #header>
              <span>账户安全</span>
            </template>
            <div class="security-list">
              <div class="security-item" @click="showUpdatePasswordDialog = true">
                <div class="security-info">
                  <i class="el-icon-lock"></i>
                  <span>登录密码</span>
                </div>
                <el-button type="text">修改</el-button>
              </div>
              <div class="security-item">
                <div class="security-info">
                  <i class="el-icon-mobile-phone"></i>
                  <span>手机号码</span>
                </div>
                <el-tag size="small" type="success" v-if="userInfo.mobile">已绑定</el-tag>
                <el-button v-else type="text" @click="showUpdateInfoDialog = true">绑定</el-button>
              </div>
              <div class="security-item">
                <div class="security-info">
                  <i class="el-icon-message"></i>
                  <span>邮箱账号</span>
                </div>
                <el-tag size="small" type="success" v-if="userInfo.email">已绑定</el-tag>
                <el-button v-else type="text" @click="showUpdateInfoDialog = true">绑定</el-button>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 修改密码对话框 -->
    <el-dialog
      title="修改密码"
      v-model="showUpdatePasswordDialog"
      width="400px"
      @closed="resetPasswordForm">
      <el-form :model="passwordForm" :rules="passwordRules" ref="passwordForm" label-width="100px">
        <el-form-item label="原密码" prop="oldPassword">
          <el-input v-model="passwordForm.oldPassword" type="password" show-password></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="passwordForm.newPassword" type="password" show-password></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="passwordForm.confirmPassword" type="password" show-password></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showUpdatePasswordDialog = false">取消</el-button>
        <el-button type="primary" :loading="updating" @click="handleUpdatePassword">确认</el-button>
      </template>
    </el-dialog>

    <!-- 修改个人信息对话框 -->
    <el-dialog
      title="修改个人信息"
      v-model="showUpdateInfoDialog"
      width="400px"
      @closed="resetInfoForm">
      <el-form :model="infoForm" :rules="infoRules" ref="infoForm" label-width="80px">
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="infoForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="infoForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showUpdateInfoDialog = false">取消</el-button>
        <el-button type="primary" :loading="updating" @click="handleUpdateInfo">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'UserCenter',
  data() {
    // 确认密码的验证规则
    const validateConfirmPassword = (rule, value, callback) => {
      if (value !== this.passwordForm.newPassword) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      addressLoading: false,
      addresses: [],
      orderCounts: {
        pending: 0,
        paid: 0,
        shipped: 0
      },
      showUpdatePasswordDialog: false,
      showUpdateInfoDialog: false,
      updating: false,
      passwordForm: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      passwordRules: {
        oldPassword: [
          { required: true, message: '请输入原密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请确认密码', trigger: 'blur' },
          { validator: validateConfirmPassword, trigger: 'blur' }
        ]
      },
      infoForm: {
        email: '',
        mobile: ''
      },
      infoRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.shop.user.userInfo
    }),
    defaultAddress() {
      return this.addresses.find(addr => addr.isDefault) || this.addresses[0]
    }
  },
  created() {
    this.getUserInfo()
    this.getAddresses()
    this.getOrderCounts()
  },
  methods: {
    async getUserInfo() {
      this.loading = true
      try {
        await this.$store.dispatch('shop/user/getUserInfo')
      } catch (error) {
        this.$message.error('获取用户信息失败')
      } finally {
        this.loading = false
      }
    },
    async getAddresses() {
      this.addressLoading = true
      try {
        const { data } = await this.$store.dispatch('shop/address/getAddresses')
        this.addresses = data.list
      } catch (error) {
        this.$message.error('获取地址列表失败')
      } finally {
        this.addressLoading = false
      }
    },
    async getOrderCounts() {
      try {
        const { data } = await this.$store.dispatch('shop/order/getOrders')
        const counts = {
          pending: 0,
          paid: 0,
          shipped: 0
        }
        data.list.forEach(order => {
          if (Object.prototype.hasOwnProperty.call(counts, order.status)) {
            counts[order.status]++
          }
        })
        this.orderCounts = counts
      } catch (error) {
        this.$message.error('获取订单统计失败')
      }
    },
    getFullAddress(address) {
      if (!address) return ''
      return `${address.province}${address.city}${address.district}${address.detailAddress}`
    },
    goToOrders(status) {
      this.$router.push({
        path: '/shop/orders',
        query: { status }
      })
    },
    async handleUpdatePassword() {
      this.$refs.passwordForm.validate(async valid => {
        if (valid) {
          this.updating = true
          try {
            await this.$store.dispatch('shop/user/updatePassword', this.passwordForm)
            this.$message.success('密码修改成功')
            this.showUpdatePasswordDialog = false
          } catch (error) {
            this.$message.error(error.message || '修改失败')
          } finally {
            this.updating = false
          }
        }
      })
    },
    async handleUpdateInfo() {
      this.$refs.infoForm.validate(async valid => {
        if (valid) {
          this.updating = true
          try {
            await this.$store.dispatch('shop/user/updateUserInfo', this.infoForm)
            this.$message.success('信息更新成功')
            this.showUpdateInfoDialog = false
            this.getUserInfo()
          } catch (error) {
            this.$message.error(error.message || '更新失败')
          } finally {
            this.updating = false
          }
        }
      })
    },
    resetPasswordForm() {
      if (this.$refs.passwordForm) {
        this.$refs.passwordForm.resetFields()
      }
      this.passwordForm = {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
    },
    resetInfoForm() {
      if (this.$refs.infoForm) {
        this.$refs.infoForm.resetFields()
      }
      this.infoForm = {
        email: this.userInfo.email,
        mobile: this.userInfo.mobile
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.user-center-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;

  .user-info-card {
    margin-bottom: 20px;

    .user-header {
      display: flex;
      align-items: center;
      gap: 20px;

      .user-info {
        .username {
          margin: 0 0 10px;
          font-size: 20px;
        }

        .user-contact {
          margin: 0;
          color: #606266;
          font-size: 14px;

          i {
            margin-right: 5px;
          }
        }
      }
    }
  }

  .features-container {
    .feature-card {
      margin-bottom: 20px;

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .order-overview {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 10px;
        text-align: center;

        .overview-item {
          cursor: pointer;
          padding: 10px;
          position: relative;

          &:hover {
            color: #409EFF;
          }

          i {
            font-size: 24px;
            margin-bottom: 5px;
          }

          span {
            display: block;
            font-size: 14px;
          }

          .count-badge {
            position: absolute;
            top: 0;
            right: 20px;
          }
        }
      }

      .address-list {
        .address-item {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 10px 0;

          .address-info {
            flex: 1;
            margin-right: 20px;

            .receiver {
              margin: 0 0 5px;

              .name {
                font-weight: bold;
                margin-right: 10px;
              }

              .phone {
                color: #606266;
              }
            }

            .address-detail {
              margin: 0;
              color: #606266;
              font-size: 14px;
            }
          }
        }
      }

      .security-list {
        .security-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 0;
          border-bottom: 1px solid #ebeef5;

          &:last-child {
            border-bottom: none;
          }

          .security-info {
            display: flex;
            align-items: center;
            gap: 10px;

            i {
              font-size: 18px;
              color: #909399;
            }
          }
        }
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .user-center-container {
    .user-info-card {
      .user-header {
        flex-direction: column;
        text-align: center;

        .user-info {
          .user-contact {
            display: flex;
            flex-direction: column;
            gap: 5px;
          }
        }
      }
    }

    .features-container {
      .feature-card {
        .order-overview {
          grid-template-columns: repeat(2, 1fr);
        }
      }
    }
  }
}
</style> 