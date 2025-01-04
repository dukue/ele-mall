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
  overflow: hidden; /* 防止页面出现滚动条 */
}

#app {
  height: 100%;
  overflow: hidden;
}

/* 移除 el-main 的默认内边距 */
.el-main {
  --el-main-padding: 0px;
}

/* 自定义滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
