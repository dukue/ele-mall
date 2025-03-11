import { getAddressList, addAddress, updateAddress, deleteAddress } from '@/api/shop/address'

const state = {
  addresses: [],
  total: 0
}

const mutations = {
  SET_ADDRESSES: (state, { list, total }) => {
    state.addresses = list
    state.total = total
  }
}

const actions = {
  // 获取地址列表
  async getAddresses({ commit }) {
    const { data } = await getAddressList()
    commit('SET_ADDRESSES', {
      list: data.list,
      total: data.total
    })
    return data
  },

  // 添加地址
  async addAddress(_, addressData) {
    const { data } = await addAddress(addressData)
    return data
  },

  // 更新地址
  async updateAddress(_, { id, addressData }) {
    const response = await updateAddress(id, addressData)
    return response.data
  },

  // 删除地址
  async deleteAddress(_, id) {
    const { data } = await deleteAddress(id)
    return data
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
} 