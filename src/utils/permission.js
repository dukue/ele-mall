// 权限配置
const adminPermissions = [
  'user.manage',      // 用户管理
  'category.manage',  // 分类管理
  'product.manage',   // 商品管理
  'order.manage',     // 订单管理
  'statistics.view'   // 统计数据
]

const userPermissions = [
  'product.view',     // 查看商品
  'order.view',       // 查看订单
]

// 获取用户权限列表
export const getUserPermissions = (role) => {
  return role === 'admin' ? adminPermissions : userPermissions
}

// 检查是否有权限
export const hasPermission = (permission) => {
  const userInfo = JSON.parse(sessionStorage.getItem('userInfo') || '{}')
  const permissions = getUserPermissions(userInfo.role)
  return permissions.includes(permission)
}

// 检查是否是管理员
export const isAdmin = () => {
  const userInfo = JSON.parse(sessionStorage.getItem('userInfo') || '{}')
  return userInfo.role === 'admin'
}

// 路由权限配置
export const routePermissions = {
  '/users': ['user.manage'],
  '/categories': ['category.manage'],
  '/products/add': ['product.manage'],
  '/statistics': ['statistics.view']
} 