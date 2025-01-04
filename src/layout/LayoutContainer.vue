<template>
  <el-container class="layout-container">
    <app-header />
    <el-container>
      <app-aside />
      <app-main />
    </el-container>
  </el-container>
</template>

<script setup>
import { defineComponent } from 'vue'
import AppHeader from './components/AppHeader.vue'
import AppAside from './components/AppAside.vue'
import AppMain from './components/AppMain.vue'

defineComponent({
  name: 'LayoutContainer'
})
</script>

<style scoped>
.layout-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
</style> 