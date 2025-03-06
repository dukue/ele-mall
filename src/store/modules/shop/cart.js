import { addToCart, getCart, updateCartItem, removeFromCart } from '@/api/shop/cart'

const state = {
  items: [],
  count: 0,
  totalAmount: 0
}

const mutations = {
  SET_CART: (state, { items, total, totalAmount }) => {
    state.items = items
    state.count = total
    state.totalAmount = totalAmount
  },
  UPDATE_CART_ITEM: (state, { id, quantity }) => {
    const item = state.items.find(item => item.id === id)
    if (item) {
      item.quantity = quantity
    }
  },
  REMOVE_CART_ITEM: (state, id) => {
    state.items = state.items.filter(item => item.id !== id)
    state.count = state.items.length
  }
}

const actions = {
  // 添加到购物车
  async addToCart({ dispatch }, { productId, quantity }) {
    await addToCart({ productId, quantity })
    await dispatch('getCart')
  },

  // 获取购物车
  async getCart({ commit }) {
    const { data } = await getCart()
    commit('SET_CART', {
      items: data.items,
      total: data.total,
      totalAmount: data.totalAmount
    })
    return data
  },

  // 更新购物车商品数量
  async updateCartItem({ commit }, { id, quantity }) {
    await updateCartItem(id, { quantity })
    commit('UPDATE_CART_ITEM', { id, quantity })
  },

  // 删除购物车商品
  async removeFromCart({ commit }, id) {
    await removeFromCart(id)
    commit('REMOVE_CART_ITEM', id)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
} 