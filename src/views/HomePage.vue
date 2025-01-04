<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div class="header-left">
        <div class="logo">{{ $t('common.systemTitle') }}</div>
      </div>
      <div class="header-right">
        <LangSwitch />
        <el-dropdown>
          <span class="user-info">
            <el-avatar 
              v-if="userInfo.avatar" 
              :size="32" 
              :src="userInfo.avatar"
            />
            {{ username }}
            <el-icon class="el-icon--right"><arrow-down /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item disabled>
                {{ userInfo.role === 'admin' ? '管理员' : '普通用户' }}
              </el-dropdown-item>
              <el-dropdown-item divided @click="logout">
                {{ t('common.logout') }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>
    
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">
          <el-icon><Fold v-if="!isCollapse"/><Expand v-else/></el-icon>
        </div>
        
        <el-menu
          :default-active="activePath"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          router>
          
          <!-- 一级菜单 -->
          <el-sub-menu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <!-- 一级菜单模板 -->
            <template #title>
              <el-icon>
                <component :is="iconList[item.id]"></component>
              </el-icon>
              <span>{{ getMenuTitle(item.authName) }}</span>
            </template>
            
            <!-- 二级菜单 -->
            <el-menu-item 
              :index="subItem.path" 
              v-for="subItem in item.children" 
              :key="subItem.id"
              @click="saveNavState(subItem.path)">
              <template #title>
                <el-icon><Location /></el-icon>
                <span>{{ $t(subItem.langKey) }}</span>
              </template>
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>
      
      <!-- 右侧内容主体 -->
      <el-main>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/home' }">{{ $t('common.home') }}</el-breadcrumb-item>
          <el-breadcrumb-item>{{ $t(breadcrumbItems[0]) }}</el-breadcrumb-item>
          <el-breadcrumb-item>{{ $t(breadcrumbItems[1]) }}</el-breadcrumb-item>
        </el-breadcrumb>
        
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { House, Shop, User, Tickets, PieChart, ArrowDown, Location } from '@element-plus/icons-vue'
import request from '@/utils/request'
import LangSwitch from '@/components/LangSwitch.vue'

const router = useRouter()
const { t } = useI18n()
const isCollapse = ref(false)
const activePath = ref('')
const breadcrumbItems = ref(['', ''])

// 获取用户信息
const userInfo = computed(() => {
  try {
    const userInfoStr = window.sessionStorage.getItem('userInfo')
    if (!userInfoStr) return { username: 'User' }
    
    return JSON.parse(userInfoStr)
  } catch (error) {
    console.error('解析用户信息失败:', error)
    return { username: 'User' }
  }
})

// 用户名显示
const username = computed(() => userInfo.value.username)

// 退出登录
const logout = async () => {
  try {
    await request.post('/auth/logout')
    window.sessionStorage.clear()
    router.push('/login')
    ElMessage.success('退出成功')
  } catch (error) {
    console.error('退出失败:', error)
  }
}

// 菜单折叠与展开
const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

// 保存链接的激活状态
const saveNavState = (activePath) => {
  window.sessionStorage.setItem('activePath', activePath)
  updateBreadcrumb(activePath)
}

// 更新面包屑导航
const updateBreadcrumb = (path) => {
  const menu = menuList.value.find(item => 
    item.children.some(subItem => subItem.path === path)
  )
  if (menu) {
    const subMenu = menu.children.find(item => item.path === path)
    breadcrumbItems.value = [menu.authName, subMenu.authName]
  }
}

// 组件挂载时
onMounted(() => {
  activePath.value = window.sessionStorage.getItem('activePath') || '/welcome'
  updateBreadcrumb(activePath.value)
})

// 图标映射
const iconList = {
  1: House,
  6: Location,
  2: Shop,
  3: Tickets,
  4: User,
  5: PieChart
}

// 菜单数据
const menuList = ref([
  {
    id: 1,
    authName: 'menu.home',
    path: '/welcome',
    children: [
      {
        id: 11,
        authName: 'menu.welcome',
        path: '/welcome',
        langKey: 'menu.welcome'
      }
    ]
  },
  {
    id: 6,
    authName: 'menu.crossBorder.title',
    path: '/crossborder',
    children: [
      {
        id: 61,
        authName: 'menu.i18n.languages',
        path: '/home/languages',
        langKey: 'menu.i18n.languages'
      },
      {
        id: 62,
        authName: 'menu.exchange.title',
        path: '/home/exchange',
        langKey: 'menu.exchange.title'
      },
      {
        id: 63,
        authName: 'menu.warehouse.title',
        path: '/home/warehouse',
        langKey: 'menu.warehouse.title'
      }
    ]
  },
  {
    id: 2,
    authName: 'menu.products.title',
    path: '/products',
    children: [
      {
        id: 21,
        authName: 'menu.products.list',
        path: '/products',
        langKey: 'menu.products.list'
      },
      {
        id: 22,
        authName: 'menu.products.categories',
        path: '/categories',
        langKey: 'menu.products.categories'
      }
    ]
  },
  {
    id: 3,
    authName: 'menu.orders.title',
    path: '/orders',
    children: [
      {
        id: 31,
        authName: 'menu.orders.list',
        path: '/orders',
        langKey: 'menu.orders.list'
      }
    ]
  },
  {
    id: 4,
    authName: 'menu.users.title',
    path: '/users',
    children: [
      {
        id: 41,
        authName: 'menu.users.list',
        path: '/users',
        langKey: 'menu.users.list'
      }
    ]
  },
  {
    id: 5,
    authName: 'menu.statistics.title',
    path: '/statistics',
    children: [
      {
        id: 51,
        authName: 'menu.statistics.report',
        path: '/statistics',
        langKey: 'menu.statistics.report'
      }
    ]
  }
])

// 修改一级菜单的显示
const getMenuTitle = computed(() => (authName) => t(authName))
</script>

<style scoped>
.home-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 20px;
  padding: 0 20px;
  height: 60px;
}

.el-container {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.el-aside {
  background-color: #333744;
  transition: width 0.3s;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.el-menu {
  border-right: none;
  flex: 1;
  overflow-y: auto;
}

.el-main {
  background-color: #eaedf1;
  padding: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.el-main > :last-child {
  flex: 1;
  overflow-y: auto;
  margin-top: 20px;
}

.header-left {
  display: flex;
  align-items: center;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.el-breadcrumb {
  margin-bottom: 15px;
  padding: 10px 0;
  background-color: #fff;
  border-radius: 4px;
  padding-left: 15px;
}
</style> 