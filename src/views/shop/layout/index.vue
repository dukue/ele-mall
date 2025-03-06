<template>
  <div class="shop-container">
    <header class="shop-header">
      <div class="header-content">
        <router-link to="/shop" class="logo">
          <h1>ELE MALL</h1>
        </router-link>
        <nav class="main-nav">
          <router-link to="/shop">首页</router-link>
          <router-link to="/shop/products">商品</router-link>
        </nav>
        <div class="user-nav">
          <template v-if="isLoggedIn">
            <router-link to="/shop/cart" class="cart-link">
              <el-badge :value="cartCount" class="cart-badge">
                <i class="el-icon-shopping-cart-2"></i>
              </el-badge>
            </router-link>
            <el-dropdown @command="handleCommand">
              <span class="el-dropdown-link">
                {{ username }}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="userCenter">个人中心</el-dropdown-item>
                  <el-dropdown-item command="orders">我的订单</el-dropdown-item>
                  <el-dropdown-item command="address">收货地址</el-dropdown-item>
                  <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
          <template v-else>
            <router-link to="/shop/login">登录</router-link> /
            <router-link to="/shop/register">注册</router-link>
          </template>
        </div>
      </div>
    </header>

    <main class="shop-main">
      <router-view></router-view>
    </main>

    <footer class="shop-footer">
      <div class="footer-content">
        <p>&copy; 2024 ELE MALL. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

const isLoggedIn = computed(() => store.state.shop.user.isLoggedIn)
const username = computed(() => store.state.shop.user.username)
const cartCount = computed(() => store.state.shop.cart.count)

const handleCommand = (command) => {
  switch (command) {
    case 'userCenter':
      router.push('/shop/user')
      break
    case 'orders':
      router.push('/shop/orders')
      break
    case 'address':
      router.push('/shop/address')
      break
    case 'logout':
      store.dispatch('shop/user/logout')
      router.push('/shop')
      break
  }
}
</script>

<style lang="scss" scoped>
.shop-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.shop-header {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 100;

  .header-content {
    max-width: 1200px;
    margin: 0 auto;
    height: 60px;
    display: flex;
    align-items: center;
    padding: 0 20px;

    .logo {
      text-decoration: none;
      color: #409EFF;
      margin-right: 40px;
      h1 {
        margin: 0;
        font-size: 24px;
      }
    }

    .main-nav {
      flex: 1;
      a {
        color: #606266;
        text-decoration: none;
        margin-right: 20px;
        font-size: 16px;
        &:hover, &.router-link-active {
          color: #409EFF;
        }
      }
    }

    .user-nav {
      display: flex;
      align-items: center;
      gap: 20px;

      .cart-link {
        color: #606266;
        font-size: 20px;
        &:hover {
          color: #409EFF;
        }
      }

      .el-dropdown-link {
        cursor: pointer;
        color: #606266;
        &:hover {
          color: #409EFF;
        }
      }
    }
  }
}

.shop-main {
  flex: 1;
  margin-top: 60px;
  padding: 20px;
  background: #f5f7fa;
}

.shop-footer {
  background: #fff;
  padding: 20px 0;
  .footer-content {
    max-width: 1200px;
    margin: 0 auto;
    text-align: center;
    color: #909399;
  }
}
</style> 