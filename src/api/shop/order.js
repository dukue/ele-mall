import request from '@/utils/request'

export function createOrder(data) {
  return request({
    url: '/mall/order',
    method: 'post',
    data
  })
}

export function getOrders(status) {
  return request({
    url: status ? `/mall/order?status=${status}` : '/mall/order',
    method: 'get'
  })
}

export function getOrderDetail(orderId) {
  return request({
    url: `/mall/order/${orderId}`,
    method: 'get'
  })
}

export function cancelOrder(orderId) {
  return request({
    url: `/mall/order/${orderId}/cancel`,
    method: 'put'
  })
}

export function confirmOrder(orderId) {
  return request({
    url: `/mall/order/${orderId}/confirm`,
    method: 'put'
  })
} 