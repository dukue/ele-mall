<template>
  <el-main class="app-main">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">{{ $t('common.home') }}</el-breadcrumb-item>
      <template v-if="currentMenu">
        <el-breadcrumb-item>{{ $t(currentMenu.authName) }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ $t(currentSubMenu.langKey) }}</el-breadcrumb-item>
      </template>
    </el-breadcrumb>
    
    <!-- 路由占位符 -->
    <router-view></router-view>
  </el-main>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { menuList } from '@/config/menu'

const route = useRoute()

// 根据当前路由路径获取对应的菜单项
const currentMenu = computed(() => {
  return menuList.find(menu => 
    menu.children.some(subMenu => subMenu.path === route.path)
  )
})

// 获取当前子菜单项
const currentSubMenu = computed(() => {
  if (!currentMenu.value) return null
  return currentMenu.value.children.find(subMenu => subMenu.path === route.path)
})
</script>

<style scoped>
.app-main {
  padding: 16px 24px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100vh;
  box-sizing: border-box;
  background-color: #f5f7fa;
}

.el-breadcrumb {
  margin-bottom: 15px;
  padding: 10px 0;
  background-color: #fff;
  border-radius: 8px;
  padding-left: 15px;
  flex-shrink: 0;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}

.app-main :deep(.el-main) {
  flex: 1;
  overflow-y: auto;
  padding: 0;
}

:deep(.el-card) {
  border-radius: 8px;
  border: none;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  margin-bottom: 16px;
}
</style> 