import { login, register, getUserInfo } from '@/api/shop/user'
import { getToken, setToken, removeToken } from '@/utils/auth'

const state = {
  token: getToken(true),
  isLoggedIn: !!getToken(true),
  userInfo: null,
  username: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
    state.isLoggedIn = !!token
  },
  SET_USER_INFO: (state, userInfo) => {
    state.userInfo = userInfo
    state.username = userInfo ? userInfo.username : ''
  }
}

const actions = {
  // 初始化用户状态
  async initUserState({ commit, dispatch }) {
    const token = getToken(true)
    if (token) {
      commit('SET_TOKEN', token)
      try {
        await dispatch('getUserInfo')
      } catch (error) {
        // 如果获取用户信息失败，可能是token过期，清除token
        dispatch('logout')
        throw error
      }
    }
  },

  // 用户登录
  async login({ commit, dispatch }, userInfo) {
    const { data } = await login(userInfo)
    const { token } = data
    commit('SET_TOKEN', token)
    setToken(token, true)
    // 登录后立即获取用户信息
    await dispatch('getUserInfo')
    return data
  },

  // 用户注册
  async register(_, userInfo) {
    const { data } = await register(userInfo)
    return data
  },

  // 获取用户信息
  async getUserInfo({ commit }) {
    const { data } = await getUserInfo()
    commit('SET_USER_INFO', data)
    return data
  },

  // 退出登录
  logout({ commit }) {
    commit('SET_TOKEN', '')
    commit('SET_USER_INFO', null)
    removeToken(true)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
} 