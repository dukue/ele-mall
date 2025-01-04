<template>
  <div class="customs-container">
    <el-card class="customs-card">
      <!-- 搜索区域 -->
      <div class="search-box">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input
              v-model="queryInfo.query"
              :placeholder="t('customs.searchPlaceholder')"
              clearable
              @clear="handleSearchClear"
            >
              <template #append>
                <el-button @click="getCustomsList">
                  <el-icon><Search /></el-icon>
                </el-button>
              </template>
            </el-input>
          </el-col>
          <el-col :span="6">
            <el-select 
              v-model="queryInfo.status" 
              :placeholder="t('customs.statusFilter')"
              clearable
              @change="handleStatusChange"
            >
              <el-option
                v-for="(value, key) in statusOptions"
                :key="key"
                :label="t(`customs.statusMap.${key}`)"
                :value="key"
              />
            </el-select>
          </el-col>
        </el-row>
      </div>

      <!-- 清关列表 -->
      <el-table :data="customsList" border stripe>
        <el-table-column prop="Order.orderNo" :label="t('order.orderNo')" width="180" />
        <el-table-column prop="status" :label="t('customs.status')" width="120">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ t(`customs.statusMap.${scope.row.status}`) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="declarationNo" :label="t('customs.declarationNo')" width="180" />
        <el-table-column prop="customsOffice" :label="t('customs.customsOffice')" />
        <el-table-column prop="createTime" :label="t('common.createTime')" width="180">
          <template #default="scope">
            {{ formatDateTime(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column :label="t('common.operation')" width="200" fixed="right">
          <template #default="scope">
            <el-button 
              type="primary" 
              link
              @click="handleView(scope.row)"
            >
              {{ t('common.view') }}
            </el-button>
            <el-button 
              type="primary" 
              link
              @click="handleProcess(scope.row)"
            >
              {{ t('common.process') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        v-model:current-page="queryInfo.pagenum"
        v-model:page-size="queryInfo.pagesize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>

    <!-- 清关详情对话框 -->
    <CustomsClearance
      v-if="selectedOrder"
      ref="clearanceRef"
      :order-id="selectedOrder.orderId"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import request from '@/utils/request'
import CustomsClearance from './components/CustomsClearance.vue'

const { t } = useI18n()

// 查询参数
const queryInfo = ref({
  query: '',
  pagenum: 1,
  pagesize: 10,
  status: ''
})

// 数据列表
const customsList = ref([])
const total = ref(0)
const selectedOrder = ref(null)
const clearanceRef = ref(null)

// 状态选项
const statusOptions = {
  pending: 'pending',
  submitted: 'submitted',
  inspecting: 'inspecting',
  passed: 'passed',
  rejected: 'rejected'
}

// 获取状态类型
const getStatusType = (status) => {
  const typeMap = {
    pending: 'info',
    submitted: 'warning',
    inspecting: 'warning',
    passed: 'success',
    rejected: 'danger'
  }
  return typeMap[status] || 'info'
}

// 获取清关列表
const getCustomsList = async () => {
  try {
    const { code, data, message } = await request.get('/customs', {
      params: queryInfo.value
    })
    
    if (code === 200) {
      customsList.value = data.items || []
      total.value = data.total || 0
    } else {
      ElMessage.error(message || t('customs.listFailed'))
    }
  } catch (error) {
    console.error('获取清关列表失败:', error)
    ElMessage.error(t('customs.listFailed'))
  }
}

// 查看详情
const handleView = (row) => {
  selectedOrder.value = row
  clearanceRef.value?.open()
}

// 处理清关
const handleProcess = (row) => {
  selectedOrder.value = row
  clearanceRef.value?.open('process')
}

// 搜索相关方法
const handleSearchClear = () => {
  queryInfo.value.pagenum = 1
  getCustomsList()
}

const handleStatusChange = () => {
  queryInfo.value.pagenum = 1
  getCustomsList()
}

// 分页相关方法
const handleSizeChange = (newSize) => {
  queryInfo.value.pagesize = newSize
  getCustomsList()
}

const handleCurrentChange = (newPage) => {
  queryInfo.value.pagenum = newPage
  getCustomsList()
}

// 格式化日期时间
const formatDateTime = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
}

// 初始化
getCustomsList()
</script>

<style scoped>
.customs-container {
  padding: 20px;
}

.customs-card {
  min-height: calc(100vh - 180px);
}

.search-box {
  margin-bottom: 20px;
}

:deep(.el-card__body) {
  padding: 20px;
}

.el-pagination {
  margin-top: 15px;
  justify-content: flex-end;
}
</style> 