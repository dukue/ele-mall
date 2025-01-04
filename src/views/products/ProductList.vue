<template>
  <div class="product-container">
    <el-card class="product-card">
      <!-- 搜索和添加区域 -->
      <div class="search-box">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input
              v-model="queryInfo.query"
              :placeholder="t('product.searchPlaceholder')"
              clearable
              @clear="getProductList">
              <template #append>
                <el-button @click="getProductList">
                  <el-icon><Search /></el-icon>
                </el-button>
              </template>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="handleAdd">
              <el-icon><Plus /></el-icon>{{ t('product.addProduct') }}
            </el-button>
          </el-col>
        </el-row>
      </div>

      <!-- 商品列表表格 -->
      <el-table 
        :data="productList" 
        border 
        stripe
        height="calc(100vh - 360px)"
      >
        <el-table-column type="index" label="#" width="60" />
        <el-table-column :label="t('product.name')" prop="name" min-width="200" />
        <el-table-column :label="t('product.price')" width="120">
          <template #default="scope">
            ¥{{ scope.row.price }}
          </template>
        </el-table-column>
        <el-table-column :label="t('product.weight')" prop="weight" width="120" />
        <el-table-column :label="t('product.category')" prop="category.name" width="140" />
        <el-table-column :label="t('product.status')" width="100">
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              @change="handleStatusChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column :label="t('common.operation')" width="200" fixed="right">
          <template #default="scope">
            <div class="operation-buttons">
              <el-button 
                type="primary" 
                size="small"
                @click="showEditDialog(scope.row)"
              >
                <el-icon><Edit /></el-icon>
                {{ t('common.edit') }}
              </el-button>
              <el-button 
                type="danger" 
                size="small"
                @click="removeProduct(scope.row.id)"
              >
                <el-icon><Delete /></el-icon>
                {{ t('common.delete') }}
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="queryInfo.pagenum"
          v-model:page-size="queryInfo.pagesize"
          :page-sizes="[5, 10, 15, 20]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <ProductForm
      v-model:visible="dialogVisible"
      :is-edit="isEdit"
      :edit-data="editData"
      @success="handleSuccess"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Search, Plus, Edit, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '@/utils/request'
import ProductForm from './components/ProductForm.vue'

const { t, locale } = useI18n()

// 查询参数对象
const queryInfo = ref({
  query: '',
  pagenum: 1,
  pagesize: 10,
  lang: locale.value.split('-')[0]
})

// 监听语言变化
watch(() => locale.value, (newLocale) => {
  queryInfo.value.lang = newLocale.split('-')[0]
  getProductList()
})

// 商品列表数据
const productList = ref([])
const total = ref(0)

// 新的表单控制变量
const dialogVisible = ref(false)
const isEdit = ref(false)
const editData = ref(null)

// 获取商品列表数据
const getProductList = async () => {
  try {
    const { code, data, message } = await request.get('/products', {
      params: {
        query: queryInfo.value.query,
        pagenum: queryInfo.value.pagenum,
        pagesize: queryInfo.value.pagesize,
        lang: queryInfo.value.lang
      }
    })
    if (code === 200 && data) {
      // 处理商品数据，确保分类名称正确显示
      productList.value = data.products.map(product => ({
        ...product,
        category: {
          ...product.category,
          name: product.category?.translations?.[queryInfo.value.lang]?.name || 
                product.category?.name ||
                t('product.unknownCategory')
        }
      }))
      total.value = data.total || 0
    } else {
      ElMessage.error(message || t('product.listFailed'))
    }
  } catch (error) {
    console.error('获取商品列表失败:', error)
    ElMessage.error(t('product.listFailed'))
    productList.value = []
    total.value = 0
  }
}

// 修改分页大小处理函数
const handleSizeChange = (newSize) => {
  queryInfo.value.pagesize = newSize
  queryInfo.value.pagenum = 1
  getProductList()
}

// 修改页码处理函数
const handleCurrentChange = (newPage) => {
  queryInfo.value.pagenum = newPage
  getProductList()
}

// 监听状态开关变化
const handleStatusChange = async (row) => {
  try {
    await request.put(`/products/${row.id}/status`, {
      status: row.status
    })
    ElMessage.success(`商品 ${row.name} 状态更新成功`)
  } catch (error) {
    row.status = !row.status
    console.error('更新商品状态失败:', error)
  }
}

// 修改添加按钮的点击事件
const handleAdd = () => {
  isEdit.value = false
  editData.value = null
  dialogVisible.value = true
}

// 修改编辑按钮的点击事件
const showEditDialog = async (row) => {
  try {
    // 获取商品详细信息
    const { code, data, message } = await request.get(`/products/${row.id}`)
    if (code === 200) {
      isEdit.value = true
      editData.value = data
      dialogVisible.value = true
    } else {
      ElMessage.error(message || '获取商品详情失败')
    }
  } catch (error) {
    console.error('获取商品详情失败:', error)
    ElMessage.error('获取商品详情失败')
  }
}

// 添加表单提交成功的处理函数
const handleSuccess = () => {
  getProductList()
}

// 删除商品
const removeProduct = async (id) => {
  const confirmResult = await ElMessageBox.confirm(
    t('product.deleteConfirm'),
    t('common.confirm'),
    {
      confirmButtonText: t('common.confirm'),
      cancelButtonText: t('common.cancel'),
      type: 'warning'
    }
  ).catch(err => err)

  if (confirmResult !== 'confirm') return

  try {
    await request.delete(`/products/${id}`)
    ElMessage.success(t('product.deleteSuccess'))
    getProductList()
  } catch (error) {
    console.error('删除商品失败:', error)
    ElMessage.error(t('product.deleteFailed'))
  }
}

// 组件挂载时获取商品列表
onMounted(() => {
  getProductList()
})
</script>

<style scoped>
.product-container {
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.product-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.search-box {
  margin-bottom: 15px;
}

.el-card :deep(.el-card__body) {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 15px 20px;
}

.pagination-container {
  margin-top: 15px;
  display: flex;
  justify-content: flex-end;
  padding: 10px 0;
}

.el-table {
  flex: 1;
  margin-bottom: 0;
}

.el-table :deep(.el-table__body-wrapper) {
  overflow-y: auto;
}

.el-table :deep(tbody tr:hover) {
  background-color: #f5f7fa !important;
}

.el-button-group {
  display: flex;
  gap: 8px;
}

.el-input {
  :deep(.el-input__wrapper) {
    box-shadow: 0 0 0 1px #dcdfe6 inset;
  }
  :deep(.el-input__wrapper:hover) {
    box-shadow: 0 0 0 1px #409eff inset;
  }
}

.el-button {
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 5px;
}

:deep(.el-pagination.is-background) {
  .el-pagination__total,
  .el-pagination__sizes {
    margin-right: 15px;
  }
  .btn-prev,
  .btn-next,
  .el-pager li {
    margin: 0 4px;
    min-width: 32px;
    border-radius: 4px;
  }
}

.operation-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.operation-buttons .el-button {
  padding: 8px 12px;
  min-width: 80px;
}

.el-table {
  flex: 1;
  margin-bottom: 0;
}

.el-table :deep(.el-table__body-wrapper) {
  overflow-y: auto;
}

.el-table :deep(.el-table__row) {
  height: 50px;
}

.el-table :deep(.el-table__fixed-right) {
  height: 100%;
  right: 0;
  background-color: #fff;
}

.el-table :deep(.el-table__fixed-right::before) {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 10px;
  background: linear-gradient(to right, rgba(0,0,0,0.15), rgba(0,0,0,0));
  pointer-events: none;
}
</style> 