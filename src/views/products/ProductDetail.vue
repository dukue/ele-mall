<template>
  <div class="product-detail">
    <el-tabs v-model="activeTab">
      <el-tab-pane label="基本信息" name="basic">
        <!-- 基本信息内容 -->
      </el-tab-pane>
      <el-tab-pane label="库存管理" name="inventory">
        <router-view v-if="activeTab === 'inventory'" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const activeTab = ref('basic')

// 监听标签页变化,更新路由
watch(activeTab, (newTab) => {
  if (newTab === 'inventory') {
    router.push({
      name: 'ProductInventory',
      params: { id: route.params.id }
    })
  }
})

// 根据当前路由设置活动标签
onMounted(() => {
  if (route.name === 'ProductInventory') {
    activeTab.value = 'inventory'
  }
})
</script> 