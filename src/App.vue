<template>
  <router-view></router-view>
</template>

<script>

</script>

<style>
/* 添加全局样式 */
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
}

#app {
  height: 100%;
}

/* 移除 el-main 的默认内边距 */
.el-main {
  --el-main-padding: 0px;
}
</style>
