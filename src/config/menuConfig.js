import { Location, Shop, Tickets } from '@element-plus/icons-vue'

export const menuList = [
  // 现有菜单配置...
  {
    title: '跨境管理',
    icon: Location,
    title: 'menu.crossBorder.title',
    children: [
      {
        title: 'menu.i18n.languages',
        path: '/home/languages',
      },
      {
        title: 'menu.exchange.title',
        path: '/home/exchange',
      },
      {
        title: 'menu.warehouse.title',
        path: '/home/warehouse',
      }
    ]
  },
  {
    title: '商品管理',
    icon: 'shop',
    children: [
      {
        title: '商品列表',
        path: '/products'
      },
      {
        title: '分类管理',
        path: '/categories'
      }
    ]
  },
  {
    title: '订单管理',
    icon: 'tickets',
    children: [
      {
        title: '订单列表',
        path: '/orders'
      },
      {
        title: '清关管理',
        path: '/customs'
      }
    ]
  }
] 