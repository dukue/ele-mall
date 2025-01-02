<template>
  <div class="exchange-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>汇率管理</span>
          <el-button type="primary" @click="handleAdd">添加汇率</el-button>
        </div>
      </template>

      <el-table :data="exchangeList" border stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="fromCurrency" label="原币种" />
        <el-table-column prop="toCurrency" label="目标币种" />
        <el-table-column prop="rate" label="汇率" />
        <el-table-column prop="updateTime" label="更新时间" />
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
import { exchangeAPI } from '@/api/modules/global'
import { ElMessage, ElMessageBox } from 'element-plus'

const exchangeList = ref([])

const getExchangeList = async () => {
  try {
    const res = await exchangeAPI.getList()
    exchangeList.value = res.data
  } catch (error) {
    console.error('获取汇率列表失败:', error)
  }
}

const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确定要删除 "${row.fromCurrency} 到 ${row.toCurrency}" 的汇率记录吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async () => {
    try {
      await exchangeAPI.delete(row.id)
      ElMessage.success('删除成功')
      getExchangeList()
    } catch (error) {
      ElMessage.error('删除失败')
    }
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

const handleEdit = (row) => {
  ElMessage.info(`准备编辑汇率: ${row.fromCurrency} -> ${row.toCurrency}`)
  // TODO: 实现编辑功能
  console.log('编辑的汇率数据:', row)
}

const handleAdd = () => {
  ElMessage.info('添加功能开发中...')
  // TODO: 实现添加功能
}

onMounted(() => {
  getExchangeList()
})
</script>

<style scoped>
.exchange-container {
  padding: 20px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style> 