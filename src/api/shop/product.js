import request from '@/utils/request'

export function getCategories() {
  return request({
    url: '/mall/category',
    method: 'get'
  })
}

export function getProducts(params) {
  // 构建查询参数
  const queryParams = {
    page: params.page || 1,
    pageSize: params.pageSize || 10,
    lang: params.lang || 'zh',
    sort: params.sort || 'createTime_desc'
  }

  // 可选参数
  if (params.categoryId) queryParams.category = params.categoryId
  if (params.keyword) queryParams.keyword = params.keyword
  if (params.minPrice) queryParams.minPrice = params.minPrice
  if (params.maxPrice) queryParams.maxPrice = params.maxPrice

  return request({
    url: '/mall/products',
    method: 'get',
    params: queryParams
  })
}

export function getProductDetail(id) {
  return request({
    url: `/mall/products/${id}`,
    method: 'get'
  })
} 