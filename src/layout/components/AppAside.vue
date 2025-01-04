<template>
  <el-aside :width="isCollapse ? '64px' : '200px'">
    <div class="toggle-button" @click="toggleCollapse">
      <el-icon><Fold v-if="!isCollapse"/><Expand v-else/></el-icon>
    </div>
    
    <el-menu
      :default-active="activePath"
      background-color="#333744"
      text-color="#fff"
      active-text-color="#409EFF"
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
  background-color: #333744;
  transition: width 0.3s;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.el-menu {
  border-right: none;
  flex: 1;
  overflow-y: auto;
}

.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style> 