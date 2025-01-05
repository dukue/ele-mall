<template>
  <el-aside :width="isCollapse ? '64px' : '200px'">
    <div class="toggle-button" @click="toggleCollapse">
      <el-icon><Fold v-if="!isCollapse"/><Expand v-else/></el-icon>
    </div>
    
    <el-menu
      :default-active="activePath"
      :unique-opened="true"
      :collapse="isCollapse"
      :collapse-transition="false"
      router>
      
      <!-- 一级菜单 -->
      <el-sub-menu :index="item.id + ''" v-for="item in menus" :key="item.id">
        <!-- 一级菜单模板 -->
        <template #title>
          <el-icon>
            <component :is="iconList[item.id]"></component>
          </el-icon>
          <span>{{ getMenuTitle(item.authName) }}</span>
        </template>
        
        <!-- 二级菜单 -->
        <el-menu-item 
          :index="subItem.path" 
          v-for="subItem in item.children" 
          :key="subItem.id"
          @click="saveNavState(subItem.path)">
          <template #title>
            <el-icon><Location /></el-icon>
            <span>{{ $t(subItem.langKey) }}</span>
          </template>
        </el-menu-item>
      </el-sub-menu>
    </el-menu>
  </el-aside>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { House, Shop, User, Tickets, PieChart, Location, Fold, Expand } from '@element-plus/icons-vue'
import { menuList, iconMap } from '@/config/menu'

const { t } = useI18n()
const isCollapse = ref(false)
const activePath = ref('')

// 菜单折叠与展开
const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

// 保存链接的激活状态
const saveNavState = (activePath) => {
  window.sessionStorage.setItem('activePath', activePath)
}

// 组件挂载时
onMounted(() => {
  activePath.value = window.sessionStorage.getItem('activePath') || '/welcome'
})

// 图标映射
const iconComponents = {
  House,
  Shop,
  User,
  Tickets,
  PieChart,
  Location
}

const iconList = computed(() => {
  const list = {}
  Object.keys(iconMap).forEach(key => {
    list[key] = iconComponents[iconMap[key]]
  })
  return list
})

// 菜单数据
const menus = ref(menuList)

// 修改一级菜单的显示
const getMenuTitle = computed(() => (authName) => t(authName))
</script>

<style scoped>
.el-aside {
  background-color: #ffffff;
  transition: width 0.3s;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 1px 0 4px rgba(0, 0, 0, 0.08);
  position: relative;
  z-index: 999;
}

.el-menu {
  border-right: none;
  flex: 1;
  overflow-y: auto;
}

.toggle-button {
  background-color: #f5f7fa;
  font-size: 12px;
  line-height: 32px;
  color: #606266;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
  border-bottom: 1px solid #e4e7ed;
  transition: background-color 0.3s;
}

.toggle-button:hover {
  background-color: #ecf5ff;
  color: #409EFF;
}

:deep(.el-menu) {
  --el-menu-bg-color: #ffffff;
  --el-menu-text-color: #606266;
  --el-menu-hover-bg-color: #ecf5ff;
  --el-menu-active-color: #409EFF;
}

/* 一级菜单样式 */
:deep(.el-sub-menu__title) {
  height: 50px;
  line-height: 50px;
  padding: 0 20px !important;
  font-size: 15px;
  font-weight: 500;
  color: #303133;
  background-color: #ffffff;
}

/* 二级菜单容器 */
:deep(.el-menu-item) {
  height: 45px;
  line-height: 45px;
  padding: 0 20px 0 48px !important;
  font-size: 14px;
  background-color: #f9fafc;
}

:deep(.el-menu-item.is-active) {
  background-color: #ecf5ff !important;
  border-right: 2px solid #409EFF;
}

:deep(.el-sub-menu__title:hover) {
  background-color: #ecf5ff;
}

:deep(.el-sub-menu) {
  border-bottom: 1px solid #f0f0f0;
}

:deep(.el-menu--collapse) {
  width: 64px;
}

:deep(.el-menu-item:hover),
:deep(.el-menu-item.is-active) {
  color: #409EFF !important;
}

:deep(.el-icon) {
  width: 24px;
  text-align: center;
  font-size: 18px;
  margin-right: 5px;
  color: #909399;
}

/* 一级菜单图标 */
:deep(.el-sub-menu__title .el-icon) {
  font-size: 18px;
  color: #606266;
}

/* 二级菜单图标 */
:deep(.el-menu-item .el-icon) {
  font-size: 16px;
  color: #909399;
}

:deep(.el-menu-item.is-active .el-icon),
:deep(.el-menu-item:hover .el-icon),
:deep(.el-sub-menu__title:hover .el-icon) {
  color: #409EFF;
}

/* 展开的子菜单 */
:deep(.el-sub-menu.is-opened) {
  background-color: #f9fafc;
}
</style> 