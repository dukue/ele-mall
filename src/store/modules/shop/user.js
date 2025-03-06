import { login, register, getUserInfo } from '@/api/shop/user'
import { getToken, setToken, removeToken } from '@/utils/auth'

const state = {
  token: getToken(),
  isLoggedIn: !!getToken(),
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
  // 用户登录
  async login({ commit }, userInfo) {
    const { data } = await login(userInfo)
    const { token } = data
    commit('SET_TOKEN', token)
    setToken(token)
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
    removeToken()
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
} 