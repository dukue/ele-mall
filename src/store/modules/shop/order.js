import { createOrder, getOrders, getOrderDetail, cancelOrder, confirmOrder } from '@/api/shop/order'

const state = {
  orders: [],
  currentOrder: null,
  total: 0
}

const mutations = {
  SET_ORDERS: (state, { list, total }) => {
    state.orders = list
    state.total = total
  },
  SET_CURRENT_ORDER: (state, order) => {
    state.currentOrder = order
  }
}

const actions = {
  // 创建订单
  async createOrder(_, orderData) {
    const { data } = await createOrder(orderData)
    return data
  },

  // 获取订单列表
  async getOrders({ commit }, status) {
    const { data } = await getOrders(status)
    commit('SET_ORDERS', {
      list: data.list,
      total: data.total,
    })
    return data
  },

  // 获取订单详情
  async getOrderDetail({ commit }, orderId) {
    const { data } = await getOrderDetail(orderId)
    commit('SET_CURRENT_ORDER', data)
    return data
  },

  // 取消订单
  async cancelOrder({ dispatch }, orderId) {
    await cancelOrder(orderId)
    await dispatch('getOrders')
  },

  // 确认收货
  async confirmOrder({ dispatch }, orderId) {
    await confirmOrder(orderId)
    await dispatch('getOrders')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
} 