import user from './user'
import cart from './cart'
import order from './order'
import category from './category'
import product from './product'
import address from './address'

export default {
  namespaced: true,
  modules: {
    user,
    cart,
    order,
    category,
    product,
    address
  }
} 