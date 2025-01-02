import request from '@/utils/request'

// 语言相关接口
export const languageAPI = {
  getList: (params) => request.get('/language/list', { params }),
  add: (data) => request.post('/language/add', data),
  update: (data) => request.put('/language/update', data),
  delete: (id) => request.delete(`/language/${id}`)
}

// 汇率相关接口
export const exchangeAPI = {
  getList: (params) => request.get('/exchange/list', { params }),
  add: (data) => request.post('/exchange/add', data),
  update: (data) => request.put('/exchange/update', data),
  delete: (id) => request.delete(`/exchange/${id}`)
}

// 仓库相关接口
export const warehouseAPI = {
  getList: (params) => request.get('/warehouse/list', { params }),
  add: (data) => request.post('/warehouse/add', data),
  update: (data) => request.put('/warehouse/update', data),
  delete: (id) => request.delete(`/warehouse/${id}`)
} 