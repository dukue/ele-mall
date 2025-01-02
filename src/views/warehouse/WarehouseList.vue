<template>
  <div class="warehouse-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>仓库管理</span>
          <el-button type="primary" @click="handleAdd">添加仓库</el-button>
        </div>
      </template>

      <el-table :data="warehouseList" border stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="仓库名称" />
        <el-table-column prop="location" label="位置" />
        <el-table-column prop="capacity" label="容量" />
        <el-table-column prop="status" label="状态">
          <template #default="scope">
            <el-tag :type="scope.row.status ? 'success' : 'warning'">
              {{ scope.row.status ? '正常' : '维护中' }}
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
import { warehouseAPI } from '@/api/modules/global'
import { ElMessage, ElMessageBox } from 'element-plus'

const warehouseList = ref([])

const getWarehouseList = async () => {
  try {
    const res = await warehouseAPI.getList()
    warehouseList.value = res.data
  } catch (error) {
    console.error('获取仓库列表失败:', error)
  }
}

const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确定要删除仓库 "${row.name}" 吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async () => {
    try {
      await warehouseAPI.delete(row.id)
      ElMessage.success('删除成功')
      getWarehouseList()
    } catch (error) {
      ElMessage.error('删除失败')
    }
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

const handleEdit = (row) => {
  ElMessage.info(`准备编辑仓库: ${row.name}`)
  // TODO: 实现编辑功能
  console.log('编辑的仓库数据:', row)
}

const handleAdd = () => {
  ElMessage.info('添加功能开发中...')
  // TODO: 实现添加功能
}

onMounted(() => {
  getWarehouseList()
})
</script>

<style scoped>
.warehouse-container {
  padding: 20px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style> 