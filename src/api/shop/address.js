import request from '@/utils/request'

export function addAddress(data) {
  return request({
    url: '/mall/address',
    method: 'post',
    data
  })
}

export function getAddressList() {
  return request({
    url: '/mall/address',
    method: 'get'
  })
}

export function updateAddress(id, data) {
  return request({
    url: `/mall/address/${id}`,
    method: 'put',
    data
  })
}

export function deleteAddress(id) {
  return request({
    url: `/mall/address/${id}`,
    method: 'delete'
  })
} 