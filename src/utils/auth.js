const ADMIN_TOKEN_KEY = 'admin_token'
const MALL_TOKEN_KEY = 'mall_token'

export function getToken(isMall = false) {
  return localStorage.getItem(isMall ? MALL_TOKEN_KEY : ADMIN_TOKEN_KEY)
}

export function setToken(token, isMall = false) {
  return localStorage.setItem(isMall ? MALL_TOKEN_KEY : ADMIN_TOKEN_KEY, token)
}

export function removeToken(isMall = false) {
  return localStorage.removeItem(isMall ? MALL_TOKEN_KEY : ADMIN_TOKEN_KEY)
}

export function isLoggedIn(isMall = false) {
  return !!getToken(isMall)
} 