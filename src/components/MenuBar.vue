<template>
  <el-menu
    :default-active="activeMenu"
    class="menu-bar"
    :collapse="isCollapse"
    background-color="#304156"
    text-color="#bfcbd9"
    active-text-color="#409EFF"
  >
    <template v-for="menu in menuList" :key="menu.title">
      <!-- 有子菜单的情况 -->
      <el-sub-menu v-if="menu.children" :index="menu.path || menu.title">
        <template #title>
          <el-icon v-if="menu.icon"><component :is="menu.icon" /></el-icon>
          <span>{{ $t(menu.title) }}</span>
        </template>
        <el-menu-item 
          v-for="subMenu in menu.children"
          :key="subMenu.path"
          :index="subMenu.path"
          @click="handleMenuClick(subMenu.path)"
        >
          {{ $t(subMenu.title) }}
        </el-menu-item>
      </el-sub-menu>
      
      <!-- 没有子菜单的情况 -->
      <el-menu-item v-else :index="menu.path" @click="handleMenuClick(menu.path)">
        <el-icon v-if="menu.icon"><component :is="menu.icon" /></el-icon>
        <template #title>{{ $t(menu.title) }}</template>
      </el-menu-item>
    </template>
  </el-menu>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { menuList } from '@/config/menuConfig'
import * as ElementPlusIcons from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const isCollapse = ref(false)

// 计算当前激活的菜单
const activeMenu = computed(() => route.path)

// 处理菜单点击
const handleMenuClick = (path) => {
  router.push(path)
}
</script>

<style scoped>
.menu-bar {
  height: 100%;
  border-right: none;
}

:deep(.el-menu-item.is-active) {
  background-color: #263445 !important;
}

:deep(.el-sub-menu__title:hover),
:deep(.el-menu-item:hover) {
  background-color: #263445 !important;
}

.el-icon {
  margin-right: 8px;
  width: 24px;
  text-align: center;
}
</style> 