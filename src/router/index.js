import { createRouter, createWebHistory } from 'vue-router'
import InventoryManagement from '@/views/warehouse/InventoryManagement.vue'
import LayoutContainer from '@/layout'
import { routePermissions, hasPermission } from '@/utils/permission'
import { ElMessage } from 'element-plus'
import shopRoutes from './shop'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginPage.vue')
  },
  {
    path: '/home',
    name: 'Home',
    component: LayoutContainer,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        name: 'Welcome',
        component: () => import('../views/WelcomePage.vue'),
        meta: { title: 'menu.welcome' }
      },
      {
        path: '/products',
        name: 'AdminProductList',
        component: () => import('@/views/products/ProductList.vue'),
        meta: { title: 'menu.products.list' }
      },
      {
        path: '/orders',
        name: 'Orders',
        component: () => import('../views/orders/OrderList.vue'),
        meta: { title: 'menu.orders.list' }
      },
      {
        path: '/users',
        name: 'Users',
        component: () => import('../views/users/UserList.vue'),
        meta: { title: 'menu.users.list' }
      },
      {
        path: '/statistics',
        name: 'Statistics',
        component: () => import('../views/statistics/StatisticsPage.vue'),
        meta: { title: 'menu.statistics.report' }
      },
      {
        path: '/languages',
        name: 'Languages',
        component: () => import('@/views/i18n/LanguageList.vue'),
        meta: { 
          title: 'menu.i18n.languages',
          icon: 'Language'
        }
      },
      {
        path: '/exchange',
        name: 'ExchangeRates',
        component: () => import('@/views/exchange/ExchangeList.vue'),
        meta: { title: 'menu.exchange.title' }
      },
      {
        path: '/products/:id',
        name: 'AdminProductDetail',
        component: () => import('@/views/products/ProductDetail.vue'),
        meta: { title: 'product.detail' },
        children: [
          {
            path: 'inventory',
            name: 'AdminProductInventory',
            component: InventoryManagement,
            meta: { title: 'inventory.title' }
          }
        ]
      },
      {
        path: '/warehouse',
        name: 'WarehouseList',
        component: () => import('@/views/warehouse/WarehouseList.vue'),
        meta: { title: 'menu.warehouse.title' }
      },
      {
        path: '/categories',
        name: 'Categories',
        component: () => import('../views/products/CategoryList.vue'),
        meta: { title: 'menu.products.categories' }
      },
      {
        path: '/products/add',
        name: 'AddProduct',
        component: () => import('@/views/products/AddProduct.vue')
      }
    ]
  },
  shopRoutes
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// 导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  
  const token = window.sessionStorage.getItem('token')
  if (!token) return next('/login')
  
  // 检查路由权限
  const requiredPermissions = routePermissions[to.path]
  if (requiredPermissions && !requiredPermissions.some(permission => hasPermission(permission))) {
    ElMessage.error('没有访问权限')
    return next('/welcome')
  }
  
  // 检查是否需要登录权限
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!token) {
      next({
        path: '/shop/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router 