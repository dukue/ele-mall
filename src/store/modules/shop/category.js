import { getCategories } from '@/api/shop/product'

const state = {
  list: []
}

const mutations = {
  SET_CATEGORIES: (state, categories) => {
    console.log('Setting categories:', categories)
    state.list = categories.map(category => ({
      ...category,
      id: category.id.toString() // 确保ID是字符串类型，用于el-menu的index匹配
    }))
  }
}

const actions = {
  async getCategories({ commit }) {
    try {
      console.log('Fetching categories...')
      const response = await getCategories()
      console.log('Categories response:', response)
      if (response.data) {
        commit('SET_CATEGORIES', response.data)
        return response.data
      }
      console.warn('Invalid categories response:', response)
      return []
    } catch (error) {
      console.error('Error fetching categories:', error)
      return []
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
} 