import { hasPermission } from '@/utils/permission'

export default {
  mounted(el, binding) {
    const { value } = binding
    if (value && !hasPermission(value)) {
      el.parentNode?.removeChild(el)
    }
  }
} 