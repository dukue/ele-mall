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
        height="calc(100vh - 280px)"
      >
        <el-table-column type="index" label="#" width="50" />
        <el-table-column :label="t('product.name')" prop="name" />
        <el-table-column :label="t('product.price')" width="120">
          <template #default="scope">
            ¥{{ scope.row.price }}
          </template>
        </el-table-column>
        <el-table-column :label="t('product.weight')" prop="weight" width="120" />
        <el-table-column :label="t('product.category')" prop="category.name" width="120" />
        <el-table-column :label="t('product.status')" width="120">
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              @change="handleStatusChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column :label="t('common.operation')" width="180">
          <template #default="scope">
            <el-button-group>
              <el-button type="primary" :icon="Edit" @click="showEditDialog(scope.row)">
                {{ t('common.edit') }}
              </el-button>
              <el-button type="danger" :icon="Delete" @click="removeProduct(scope.row.id)">
                {{ t('common.delete') }}
              </el-button>
            </el-button-group>
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
      productList.value = data.products || []
      total.value = data.total || 0
    } else {
      ElMessage.error(message || t('product.listFailed'))
    }
  } catch (error) {
    console.error('获取商品列表失败:', error)
    ElMessage.error(t('product.listFailed'))
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
  height: calc(100% - 40px);
  display: flex;
  flex-direction: column;
}

.search-box {
  margin-bottom: 20px;
}

.el-card :deep(.el-card__body) {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.el-table {
  flex: 1;
  overflow: hidden;
}

.el-table :deep(.el-table__body-wrapper) {
  overflow-y: auto;
}

.el-button-group {
  display: flex;
  gap: 10px;
}
</style> 