import { getProducts, getProductDetail } from '@/api/shop/product'
import request from '@/utils/request'
import placeholderImg from '@/assets/placeholder.jpg'

const state = {
  list: [],
  total: 0,
  currentProduct: null
}

const mutations = {
  SET_PRODUCTS: (state, { list, total }) => {
    console.log('Setting products:', { list, total })
    state.list = list.map(product => ({
      ...product,
      image: product.image ? 
        (product.image.startsWith('http') ? product.image : `${request.defaults.baseURL}/${product.image.replace(/^\//, '')}`) 
        : placeholderImg
    }))
    state.total = total
  },
  SET_CURRENT_PRODUCT: (state, product) => {
    console.log('Setting current product:', product)
    if (product) {
      state.currentProduct = {
        ...product,
        image: product.image ? 
          (product.image.startsWith('http') ? product.image : `${request.defaults.baseURL}/${product.image.replace(/^\//, '')}`)
          : placeholderImg
      }
    } else {
      state.currentProduct = null
    }
  }
}

const actions = {
  async getProducts({ commit }, params) {
    try {
      console.log('Fetching products with params:', params)
      const response = await getProducts(params)
      console.log('Products response:', response)
      if (response.code === 200 && response.data) {
        commit('SET_PRODUCTS', {
          list: response.data.list || [],
          total: response.data.total || 0
        })
        return response.data
      }
      console.warn('Invalid products response:', response)
      return { list: [], total: 0 }
    } catch (error) {
      console.error('Error fetching products:', error)
      return { list: [], total: 0 }
    }
  },

  async getProductDetail({ commit }, id) {
    try {
      console.log('Fetching product detail for id:', id)
      const response = await getProductDetail(id)
      console.log('Product detail response:', response)
      if (response.data) {
        commit('SET_CURRENT_PRODUCT', response.data)
        return response.data
      }
      console.warn('Invalid product detail response:', response)
      return null
    } catch (error) {
      console.error('Error fetching product detail:', error)
      return null
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
} 