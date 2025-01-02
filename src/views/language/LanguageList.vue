<template>
  <div class="language-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>语言管理</span>
          <el-button type="primary" @click="handleAdd">添加语言</el-button>
        </div>
      </template>

      <el-table :data="languageList" border stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="语言名称" />
        <el-table-column prop="code" label="语言代码" />
        <el-table-column prop="status" label="状态">
          <template #default="scope">
            <el-tag :type="scope.row.status ? 'success' : 'danger'">
              {{ scope.row.status ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { languageAPI } from '@/api/modules/global'
import { ElMessage, ElMessageBox } from 'element-plus'

const languageList = ref([])

const getLanguageList = async () => {
  try {
    const res = await languageAPI.getList()
    languageList.value = res.data
  } catch (error) {
    console.error('获取语言列表失败:', error)
  }
}

onMounted(() => {
  getLanguageList()
})

const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确定要删除语言 "${row.name}" 吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async () => {
    try {
      await languageAPI.delete(row.id)
      ElMessage.success('删除成功')
      getLanguageList()
    } catch (error) {
      ElMessage.error('删除失败')
    }
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

const handleEdit = (row) => {
  ElMessage.info(`准备编辑语言: ${row.name}`)
  // TODO: 实现编辑功能
  console.log('编辑的语言数据:', row)
}

const handleAdd = () => {
  ElMessage.info('添加功能开发中...')
  // TODO: 实现添加功能
}
</script>

<style scoped>
.language-container {
  padding: 20px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style> 