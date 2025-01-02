<template>
  <div class="order-container">
    <el-card>
      <!-- 搜索区域 -->
      <div class="search-box">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input
              v-model="queryInfo.query"
              placeholder="请输入订单号"
              clearable
              @clear="getOrderList">
              <template #append>
                <el-button @click="getOrderList">
                  <el-icon><Search /></el-icon>
                </el-button>
              </template>
            </el-input>
          </el-col>
          <el-col :span="8">
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="handleDateChange"
            />
          </el-col>
        </el-row>
      </div>

      <!-- 订单列表 -->
      <el-table :data="orderList" border stripe>
        <el-table-column type="index" label="#" width="50" />
        <el-table-column prop="orderNo" label="订单编号" width="220" />
        <el-table-column prop="createTime" label="下单时间" width="180" />
        <el-table-column prop="totalAmount" label="订单金额" width="120">
          <template #default="scope">
            ¥{{ Number(scope.row.totalAmount).toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="订单状态" width="120">
          <template #default="scope">
            <el-tag :type="orderStatusMap[scope.row.status].type">
              {{ orderStatusMap[scope.row.status].label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="payMethod" label="支付方式" width="120">
          <template #default="scope">
            {{ payMethodMap[scope.row.payMethod] }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220">
          <template #default="scope">
            <el-button-group>
              <el-button 
                type="primary" 
                :icon="View"
                @click="showOrderDetail(scope.row)">
                查看
              </el-button>
              <el-button 
                type="success" 
                :icon="Edit"
                v-if="scope.row.status === 'pending'"
                @click="handleOrder(scope.row, 'processing')">
                发货
              </el-button>
              <el-button 
                type="danger" 
                :icon="Delete"
                @click="cancelOrder(scope.row)"
                v-if="scope.row.status === 'pending'">
                取消
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        v-model:current-page="queryInfo.pagenum"
        v-model:page-size="queryInfo.pagesize"
        :page-sizes="[5, 10, 15, 20]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>

    <!-- 订单详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="订单详情"
      width="70%">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="订单编号">{{ currentOrder.orderNo }}</el-descriptions-item>
        <el-descriptions-item label="下单时间">{{ currentOrder.createTime }}</el-descriptions-item>
        <el-descriptions-item label="订单状态">
          <el-tag :type="orderStatusMap[currentOrder.status]?.type">
            {{ orderStatusMap[currentOrder.status]?.label }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="支付方式">
          {{ payMethodMap[currentOrder.payMethod] }}
        </el-descriptions-item>
      </el-descriptions>

      <!-- 收货人信息 -->
      <el-descriptions title="收货人信息" :column="2" border class="margin-top">
        <el-descriptions-item label="收货人">{{ currentOrder.receiver }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{ currentOrder.phone }}</el-descriptions-item>
        <el-descriptions-item label="收货地址" :span="2">{{ currentOrder.address }}</el-descriptions-item>
      </el-descriptions>

      <!-- 商品信息 -->
      <div class="margin-top">
        <h3>商品信息</h3>
        <el-table :data="currentOrder.products" border>
          <el-table-column type="index" label="#" width="50" />
          <el-table-column prop="name" label="商品名称" />
          <el-table-column prop="price" label="单价" width="120">
            <template #default="scope">
              ¥{{ Number(scope.row.price).toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column prop="quantity" label="数量" width="120" />
          <el-table-column label="小计" width="120">
            <template #default="scope">
              ¥{{ (Number(scope.row.price) * Number(scope.row.quantity)).toFixed(2) }}
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="total-amount">
        总计：<span>¥{{ Number(currentOrder.totalAmount || 0).toFixed(2) }}</span>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Search, View, Edit, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '@/utils/request'

// 查询参数
const queryInfo = ref({
  query: '',
  pagenum: 1,
  pagesize: 10,
  startDate: '',
  endDate: ''
})

// 日期范围
const dateRange = ref([])

// 订单列表数据
const orderList = ref([])
const total = ref(0)
const detailDialogVisible = ref(false)
const currentOrder = ref({})

// 订单状态映射
const orderStatusMap = {
  pending: { type: 'warning', label: '待发货' },
  processing: { type: 'primary', label: '已发货' },
  completed: { type: 'success', label: '已完成' },
  cancelled: { type: 'info', label: '已取消' }
}

// 支付方式映射
const payMethodMap = {
  alipay: '支付宝',
  wechat: '微信支付',
  card: '银行卡'
}

// 获取订单列表
const getOrderList = async () => {
  try {
    const data = await request.get('/orders', {
      params: {
        ...queryInfo.value
      }
    })
    orderList.value = data.orders
    total.value = data.total
  } catch (error) {
    console.error('获取订单列表失败:', error)
  }
}

// 处理日期变化
const handleDateChange = (val) => {
  if (val) {
    queryInfo.value.startDate = val[0].toISOString().split('T')[0]
    queryInfo.value.endDate = val[1].toISOString().split('T')[0]
  } else {
    queryInfo.value.startDate = ''
    queryInfo.value.endDate = ''
  }
  getOrderList()
}

// 显示订单详情
const showOrderDetail = async (order) => {
  try {
    // 获取订单详细信息
    const detailData = await request.get(`/orders/${order.id}`)
    currentOrder.value = detailData
    detailDialogVisible.value = true
  } catch (error) {
    console.error('获取订单详情失败:', error)
    ElMessage.error('获取订单详情失败')
  }
}

// 处理订单（发货）
const handleOrder = async (order, action) => {
  try {
    await request.put(`/orders/${order.id}/status`, {
      status: action
    })
    ElMessage.success('操作成功')
    getOrderList()
  } catch (error) {
    console.error('订单操作失败:', error)
    ElMessage.error('操作失败')
  }
}

// 取消订单
const cancelOrder = async (order) => {
  const confirmResult = await ElMessageBox.confirm(
    '确定要取消该订单吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).catch(err => err)

  if (confirmResult !== 'confirm') return

  try {
    await request.put(`/orders/${order.id}/status`, {
      status: 'cancelled'
    })
    ElMessage.success('订单已取消')
    getOrderList()
  } catch (error) {
    console.error('取消订单失败:', error)
    ElMessage.error('取消订单失败')
  }
}

// 监听 pagesize 改变
const handleSizeChange = (newSize) => {
  queryInfo.value.pagesize = newSize
  getOrderList()
}

// 监听页码值改变
const handleCurrentChange = (newPage) => {
  queryInfo.value.pagenum = newPage
  getOrderList()
}

// 组件挂载时获取订单列表
onMounted(() => {
  getOrderList()
})
</script>

<style scoped>
.order-container {
  padding: 20px;
}

.search-box {
  margin-bottom: 20px;
}

.el-pagination {
  margin-top: 20px;
  justify-content: flex-end;
}

.margin-top {
  margin-top: 20px;
}

.total-amount {
  margin-top: 20px;
  text-align: right;
  font-size: 16px;
}

.total-amount span {
  color: #f56c6c;
  font-size: 20px;
  font-weight: bold;
  margin-left: 8px;
}
</style> 