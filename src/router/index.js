import { createRouter, createWebHistory } from 'vue-router'

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
    component: () => import('../views/HomePage.vue'),
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        name: 'Welcome',
        component: () => import('../views/WelcomePage.vue')
      },
      {
        path: '/products',
        name: 'Products',
        component: () => import('../views/products/ProductList.vue')
      },
      {
        path: '/orders',
        name: 'Orders',
        component: () => import('../views/orders/OrderList.vue')
      },
      {
        path: '/users',
        name: 'Users',
        component: () => import('../views/users/UserList.vue')
      },
      {
        path: '/statistics',
        name: 'Statistics',
        component: () => import('../views/StatisticsPage.vue')
      },
      {
        path: '/home/languages',
        name: 'Languages',
        component: () => import('@/views/i18n/LanguageList.vue'),
        meta: { 
          title: 'menu.i18n.languages',
          icon: 'Language'
        }
      },
      {
        path: '/home/exchange',
        component: () => import('@/views/exchange/ExchangeList.vue'),
        name: 'ExchangeRates',
        meta: { title: 'exchangeRates' }
      },
      {
        path: 'warehouse',
        name: 'Warehouse',
        component: () => import('@/views/warehouse/WarehouseList.vue'),
        meta: { title: '仓库管理' }
      },
      {
        path: '/categories',
        name: 'Categories',
        component: () => import('../views/products/CategoryList.vue')
      },
      {
        path: '/customs',
        name: 'Customs',
        component: () => import('../views/customs/CustomsList.vue'),
        meta: { title: '清关管理' }
      }
    ]
  }
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
  next()
})

export default router 