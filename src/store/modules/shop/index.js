import user from './user'
import cart from './cart'
import order from './order'
import category from './category'
import product from './product'

export default {
  namespaced: true,
  modules: {
    user,
    cart,
    order,
    category,
    product
  }
} 