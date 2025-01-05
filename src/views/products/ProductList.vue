<template>
  <div class="product-list">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>{{ t('product.list') }}</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            {{ t('product.addProduct') }}
          </el-button>
        </div>
      </template>

      <!-- 搜索区域 -->
      <el-form :inline="true" :model="queryForm" class="search-form">
        <el-form-item>
          <el-input
            v-model="queryForm.name"
            :placeholder="t('product.searchPlaceholder')"
            clearable
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            {{ t('common.search') }}
          </el-button>
          <el-button @click="handleReset">
            {{ t('common.reset') }}
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 表格区域 -->
      <div class="table-container">
        <el-table
          v-loading="loading"
          :data="productList"
          border
          stripe
          style="width: 100%"
          :height="tableHeight"
        >
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="name" :label="t('product.name')" min-width="200" />
          <el-table-column prop="price" :label="t('product.price')" width="120">
            <template #default="scope">
              {{ formatPrice(scope.row.price) }}
            </template>
          </el-table-column>
          <el-table-column prop="category" :label="t('product.category')" width="150">
            <template #default="scope">
              {{ scope.row.category?.name || t('product.unknownCategory') }}
            </template>
          </el-table-column>
          <el-table-column prop="status" :label="t('product.status')" width="100">
            <template #default="scope">
              <el-tag :type="scope.row.status ? 'success' : 'info'">
                {{ scope.row.status ? t('common.yes') : t('common.no') }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column :label="t('common.operation')" width="250" fixed="right">
            <template #default="scope">
              <el-button 
                type="primary" 
                size="small" 
                @click="handleEdit(scope.row)"
              >
                {{ t('common.edit') }}
              </el-button>
              <el-button 
                type="success" 
                size="small" 
                @click="handleInventory(scope.row)"
              >
                {{ t('inventory.title') }}
              </el-button>
              <el-button 
                type="danger" 
                size="small" 
                @click="handleDelete(scope.row)"
              >
                {{ t('common.delete') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页区域 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="queryForm.pageNum"
          v-model:page-size="queryForm.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '@/utils/request'
import { Plus } from '@element-plus/icons-vue'

const router = useRouter()
const { t } = useI18n()
const loading = ref(false)
const productList = ref([])
const total = ref(0)
const tableHeight = ref('calc(100vh - 300px)')

// 查询表单
const queryForm = ref({
  name: '',
  pageNum: 1,
  pageSize: 10
})

// 获取商品列表
const getProductList = async () => {
  loading.value = true
  try {
    const { code, data, message } = await request.get('/products', {
      params: queryForm.value
    })
    if (code === 200) {
      productList.value = data.products || []
      total.value = data.total || 0
    } else {
      ElMessage.error(message || t('product.listFailed'))
    }
  } catch (error) {
    console.error('获取商品列表失败:', error)
    ElMessage.error(t('product.listFailed'))
  } finally {
    loading.value = false
  }
}

// 格式化价格
const formatPrice = (price) => {
  return `¥ ${Number(price).toFixed(2)}`
}

// 搜索
const handleSearch = () => {
  queryForm.value.pageNum = 1
  getProductList()
}

// 重置
const handleReset = () => {
  queryForm.value = {
    name: '',
    pageNum: 1,
    pageSize: 10
  }
  getProductList()
}

// 页码改变
const handleCurrentChange = (val) => {
  queryForm.value.pageNum = val
  getProductList()
}

// 每页条数改变
const handleSizeChange = (val) => {
  queryForm.value.pageSize = val
  queryForm.value.pageNum = 1
  getProductList()
}

// 跳转到库存管理
const handleInventory = (row) => {
  router.push({
    name: 'ProductInventory',
    params: { id: row.id }
  })
}

// 编辑商品
const handleEdit = (row) => {
  router.push({
    name: 'ProductDetail',
    params: { id: row.id }
  })
}

// 删除商品
const handleDelete = (row) => {
  ElMessageBox.confirm(
    t('product.deleteConfirm'),
    t('common.warning'),
    {
      confirmButtonText: t('common.confirm'),
      cancelButtonText: t('common.cancel'),
      type: 'warning'
    }
  ).then(async () => {
    try {
      const { code, message } = await request.delete(`/products/${row.id}`)
      if (code === 200) {
        ElMessage.success(t('product.deleteSuccess'))
        getProductList()
      } else {
        ElMessage.error(message || t('product.deleteFailed'))
      }
    } catch (error) {
      console.error('删除商品失败:', error)
      ElMessage.error(t('product.deleteFailed'))
    }
  }).catch(() => {
    ElMessage.info(t('common.deleteCancel'))
  })
}

// 添加商品
const handleAdd = () => {
  router.push('/products/add')
}

onMounted(() => {
  getProductList()
})
</script>

<style scoped>
.product-list {
  height: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-form {
  margin-bottom: 20px;
}

.table-container {
  margin-bottom: 20px;
}

.pagination {
  display: flex;
  justify-content: flex-end;
}
</style> 