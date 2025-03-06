import request from '@/utils/request'

export function register(data) {
  return request({
    url: '/mall/user/register',
    method: 'post',
    data
  })
}

export function login(data) {
  return request({
    url: '/mall/user/login',
    method: 'post',
    data
  })
}

export function getUserInfo() {
  return request({
    url: '/mall/user/info',
    method: 'get'
  })
}

export function updateUserInfo(data) {
  return request({
    url: '/mall/user/info',
    method: 'put',
    data
  })
}

export function updatePassword(data) {
  return request({
    url: '/mall/user/password',
    method: 'put',
    data
  })
} 