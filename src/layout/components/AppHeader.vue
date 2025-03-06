<template>
  <el-header>
    <div class="header-left">
      <img src="@/assets/logo.png" alt="logo" class="logo_img">
      <div class="logo">{{ $t('common.systemTitle') }}</div>
    </div>
    <div class="header-right">
      <router-link to="/shop" class="shop-link">
        <el-button type="primary" plain>
          <el-icon><Shop /></el-icon>
          前台商城
        </el-button>
      </router-link>
      <LangSwitch />
      <el-dropdown>
        <span class="user-info">
          <el-avatar 
            v-if="userInfo.avatar" 
            :size="32" 
            :src="userInfo.avatar"
          />
          {{ username }}
          <el-icon class="el-icon--right"><arrow-down /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item disabled>
              {{ userInfo.role === 'admin' ? '管理员' : '普通用户' }}
            </el-dropdown-item>
            <el-dropdown-item divided @click="logout">
              {{ t('common.logout') }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </el-header>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { ArrowDown, Shop } from '@element-plus/icons-vue'
import LangSwitch from '@/components/LangSwitch.vue'

const router = useRouter()
const { t } = useI18n()

const userInfo = computed(() => {
  try {
    const userInfoStr = window.sessionStorage.getItem('userInfo')
    if (!userInfoStr) return { username: 'User' }
    return JSON.parse(userInfoStr)
  } catch (error) {
    console.error('解析用户信息失败:', error)
    return { username: 'User' }
  }
})

const username = computed(() => userInfo.value.username)

const logout = async () => {
  try {
    // 清除 cookie
    document.cookie.split(";").forEach(cookie => {
      const eqPos = cookie.indexOf("=")
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/"
    })
    
    // 清除 sessionStorage
    window.sessionStorage.clear()
    
    // 跳转到登录页
    router.push('/login')
    ElMessage.success(t('common.logoutSuccess'))
  } catch (error) {
    console.error('退出失败:', error)
    ElMessage.error(t('common.logoutFailed'))
  }
}
</script>

<style scoped>
.logo_img {
  width: 50px;
  height: 50px;
  margin-right: 12px;
}

.el-header {
  background-color: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #333;
  font-size: 20px;
  padding: 0 20px;
  height: 60px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  position: relative;
  z-index: 1000;
}

.header-left {
  display: flex;
  align-items: center;
  font-weight: 500;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #606266;
  transition: color 0.3s;
}

.user-info:hover {
  color: #409EFF;
}

:deep(.el-dropdown-menu__item) {
  padding: 8px 20px;
}

.shop-link {
  text-decoration: none;
  margin-right: 20px;
}

.shop-link .el-button {
  display: flex;
  align-items: center;
  gap: 5px;
}
</style> 