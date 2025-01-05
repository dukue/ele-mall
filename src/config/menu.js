export const menuList = [
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
        path: '/languages',
        langKey: 'menu.i18n.languages'
      },
      {
        id: 62,
        authName: 'menu.exchange.title',
        path: '/exchange',
        langKey: 'menu.exchange.title'
      },
      {
        id: 63,
        authName: 'menu.warehouse.title',
        path: '/warehouse',
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
      },
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
]

// 图标映射配置
export const iconMap = {
  1: 'House',
  2: 'Shop',
  3: 'Tickets',
  4: 'User',
  5: 'PieChart',
  6: 'Location'
} 