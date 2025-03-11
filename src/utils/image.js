import { baseURL } from '@/config'

/**
 * 获取完整的图片URL
 * @param {string} path - 图片路径
 * @returns {string} 完整的图片URL
 */
export function getImageUrl(path) {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  return `${baseURL}/${path}`
} 