<template>
  <el-header>
    <div class="header-left">
      <div class="logo">{{ $t('common.systemTitle') }}</div>
    </div>
    <div class="header-right">
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
import { ArrowDown } from '@element-plus/icons-vue'
import request from '@/utils/request'
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
    await request.post('/auth/logout')
    window.sessionStorage.clear()
    router.push('/login')
    ElMessage.success('退出成功')
  } catch (error) {
    console.error('退出失败:', error)
  }
}
</script>

<style scoped>
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 20px;
  padding: 0 20px;
  height: 60px;
}

.header-left {
  display: flex;
  align-items: center;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}
</style> 