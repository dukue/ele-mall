import request from '@/utils/request'

export function addToCart(data) {
  return request({
    url: '/mall/cart',
    method: 'post',
    data
  })
}

export function getCart() {
  return request({
    url: '/mall/cart',
    method: 'get'
  })
}

export function updateCartItem(id, data) {
  return request({
    url: `/mall/cart/${id}`,
    method: 'put',
    data
  })
}

export function removeFromCart(id) {
  return request({
    url: `/mall/cart/${id}`,
    method: 'delete'
  })
} 