export default {
  path: '/shop',
  component: () => import('@/views/shop/layout/index'),
  children: [
    {
      path: '',
      name: 'ShopHome',
      component: () => import('@/views/shop/home/index'),
      meta: { title: '商城首页' }
    },
    {
      path: 'login',
      name: 'ShopLogin',
      component: () => import('@/views/shop/user/login'),
      meta: { title: '用户登录' }
    },
    {
      path: 'register',
      name: 'ShopRegister',
      component: () => import('@/views/shop/user/register'),
      meta: { title: '用户注册' }
    },
    {
      path: 'products',
      name: 'ProductList',
      component: () => import('@/views/shop/products/ProductList'),
      meta: { title: '商品列表' }
    },
    {
      path: 'product/:id',
      name: 'ProductDetail',
      component: () => import('@/views/shop/products/ProductDetail'),
      meta: { title: '商品详情' }
    },
    {
      path: 'cart',
      name: 'ShoppingCart',
      component: () => import('@/views/shop/cart/index'),
      meta: { title: '购物车', requiresAuth: true }
    },
    {
      path: 'checkout',
      name: 'Checkout',
      component: () => import('@/views/shop/order/checkout'),
      meta: { title: '结算', requiresAuth: true }
    },
    {
      path: 'orders',
      name: 'OrderList',
      component: () => import('@/views/shop/order/list'),
      meta: { title: '我的订单', requiresAuth: true }
    },
    {
      path: 'order/:id',
      name: 'OrderDetail',
      component: () => import('@/views/shop/order/detail'),
      meta: { title: '订单详情', requiresAuth: true }
    },
    {
      path: 'user',
      name: 'UserCenter',
      component: () => import('@/views/shop/user/center'),
      meta: { title: '个人中心', requiresAuth: true }
    },
    {
      path: 'address',
      name: 'AddressList',
      component: () => import('@/views/shop/user/address'),
      meta: { title: '收货地址', requiresAuth: true }
    }
  ]
} 