import axios from 'axios'
import { ElMessage } from 'element-plus'
import { getToken } from '@/utils/auth'

const request = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  timeout: 5000
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 根据请求URL判断是否为商城接口
    const isMallApi = config.url.startsWith('/mall/')
    
    let token
    if (isMallApi) {
      // 商城接口使用 auth.js 中的 getToken
      token = getToken(true)
    } else {
      // 后台接口使用 sessionStorage 中的 token
      token = sessionStorage.getItem('token')
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    // 如果是文件下载，直接返回
    if (response.config.responseType === 'blob') {
      return response
    }
    
    const res = response.data
    if (!res) {
      ElMessage.error('服务器响应错误')
      return Promise.reject(new Error('服务器响应错误'))
    }

    // 不要在这里检查 res.code，让调用方处理业务状态码
    return res
  },
  error => {
    console.error('Response error:', error)
    ElMessage.error(error.message || '请求失败')
    return Promise.reject(error)
  }
)

export default request 