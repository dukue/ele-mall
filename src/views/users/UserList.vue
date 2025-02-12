<template>
  <div class="user-container">
    <el-card class="user-card">
      <!-- 搜索区域 -->
      <div class="search-box">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input
              v-model="queryInfo.query"
              :placeholder="t('user.searchPlaceholder')"
              clearable
              @clear="handleSearchClear"
            >
              <template #append>
                <el-button @click="getUserList">
                  <el-icon><Search /></el-icon>
                </el-button>
              </template>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button 
              v-permission="'user.manage'"
              type="primary" 
              @click="handleAdd"
            >
              <el-icon><Plus /></el-icon>
              {{ t('common.add') }}
            </el-button>
          </el-col>
        </el-row>
      </div>

      <!-- 用户列表表格 -->
      <el-table 
        :data="userList" 
        border 
        stripe
        height="calc(100vh - 360px)"
      >
        <el-table-column type="index" label="#" width="60" />
        <el-table-column prop="username" :label="t('user.username')" width="150" />
        <el-table-column prop="email" :label="t('user.email')" width="200" />
        <el-table-column prop="mobile" :label="t('user.mobile')" width="150" />
        <el-table-column prop="role" :label="t('user.role')" width="120">
          <template #default="scope">
            <el-tag :type="scope.row.role === 'admin' ? 'danger' : 'info'">
              {{ t(`user.roleMap.${scope.row.role}`) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" :label="t('user.status')" width="100">
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              :disabled="scope.row.role === 'admin'"
              @change="(val) => handleStatusChange(scope.row, val)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="createTime" :label="t('user.createTime')" width="180">
          <template #default="scope">
            {{ formatDateTime(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column :label="t('common.operation')" width="200" fixed="right">
          <template #default="scope">
            <div class="operation-buttons">
              <el-button 
                v-permission="'user.manage'"
                type="primary" 
                size="small"
                @click="handleEdit(scope.row)"
              >
                <el-icon><Edit /></el-icon>
                {{ t('common.edit') }}
              </el-button>
              <el-button 
                v-permission="'user.manage'"
                type="danger" 
                size="small"
                :disabled="scope.row.role === 'admin'"
                @click="handleDelete(scope.row)"
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
          :page-sizes="[10, 20, 30, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 添加/编辑用户对话框 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="500px"
    >
      <el-form
        ref="userFormRef"
        :model="userForm"
        :rules="userFormRules"
        label-width="100px"
      >
        <el-form-item :label="t('user.username')" prop="username">
          <el-input v-model="userForm.username" :disabled="isEdit" />
        </el-form-item>
        <el-form-item :label="t('user.password')" prop="password" v-if="!isEdit">
          <el-input v-model="userForm.password" type="password" show-password />
        </el-form-item>
        <el-form-item :label="t('user.email')" prop="email">
          <el-input v-model="userForm.email" />
        </el-form-item>
        <el-form-item :label="t('user.mobile')" prop="mobile">
          <el-input v-model="userForm.mobile" />
        </el-form-item>
        <el-form-item :label="t('user.role')" prop="role">
          <el-select v-model="userForm.role" class="w-full">
            <el-option
              v-for="role in roles"
              :key="role.value"
              :label="t(role.label)"
              :value="role.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">
            {{ t('common.cancel') }}
          </el-button>
          <el-button type="primary" @click="handleSubmit">
            {{ t('common.confirm') }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Plus, Edit, Delete } from '@element-plus/icons-vue'
import request from '@/utils/request'

const { t } = useI18n()

// 查询参数
const queryInfo = ref({
  query: '',
  pagenum: 1,
  pagesize: 10
})

// 角色选项
const roles = [
  { value: 'admin', label: 'user.roleMap.admin' },
  { value: 'user', label: 'user.roleMap.user' }
]

// 数据列表
const userList = ref([])
const total = ref(0)

// 对话框相关
const dialogVisible = ref(false)
const isEdit = ref(false)
const userFormRef = ref(null)
const userForm = ref({
  username: '',
  password: '',
  email: '',
  mobile: '',
  role: 'user'
})

// 表单验证规则
const userFormRules = {
  username: [
    { required: true, message: t('validation.required', { field: t('user.username') }), trigger: 'blur' },
    { min: 3, max: 20, message: t('user.usernameLengthTip'), trigger: 'blur' }
  ],
  password: [
    { required: true, message: t('validation.required', { field: t('user.password') }), trigger: 'blur' },
    { min: 6, message: t('user.passwordLengthTip'), trigger: 'blur' }
  ],
  email: [
    { required: true, message: t('validation.required', { field: t('user.email') }), trigger: 'blur' },
    { type: 'email', message: t('user.emailFormatTip'), trigger: 'blur' }
  ],
  mobile: [
    { required: true, message: t('validation.required', { field: t('user.mobile') }), trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: t('user.mobileFormatTip'), trigger: 'blur' }
  ],
  role: [
    { required: true, message: t('validation.required', { field: t('user.role') }), trigger: 'change' }
  ]
}

// 对话框标题
const dialogTitle = computed(() => {
  return isEdit.value ? t('user.editUser') : t('user.addUser')
})

// 获取用户列表
const getUserList = async () => {
  try {
    const params = {
      query: queryInfo.value.query.trim() || undefined,
      pagenum: queryInfo.value.pagenum,
      pagesize: queryInfo.value.pagesize
    }

    const { code, data, message } = await request.get('/auth/users', { params })
    if (code === 200 && data) {
      // 对用户列表进行排序，管理员显示在最前面
      const users = data.users || []
      userList.value = users.sort((a, b) => {
        // 如果 a 是管理员，b 不是，a 排在前面
        if (a.role === 'admin' && b.role !== 'admin') return -1
        // 如果 b 是管理员，a 不是，b 排在前面
        if (b.role === 'admin' && a.role !== 'admin') return 1
        // 如果角色相同，按创建时间倒序排列（新用户在后）
        return new Date(a.createTime) - new Date(b.createTime)
      })
      total.value = data.total || 0
    } else {
      ElMessage.error(message || t('user.listFailed'))
    }
  } catch (error) {
    console.error('获取用户列表失败:', error)
    ElMessage.error(t('user.listFailed'))
    userList.value = []
    total.value = 0
  }
}

// 处理添加用户
const handleAdd = () => {
  isEdit.value = false
  userForm.value = {
    username: '',
    password: '',
    email: '',
    mobile: '',
    role: 'user'
  }
  dialogVisible.value = true
}

// 处理编辑用户
const handleEdit = (row) => {
  isEdit.value = true
  userForm.value = {
    id: row.id,
    username: row.username,
    email: row.email,
    mobile: row.mobile,
    role: row.role
  }
  dialogVisible.value = true
}

// 处理删除用户
const handleDelete = async (row) => {
  try {
    const confirmResult = await ElMessageBox.confirm(
      t('user.deleteConfirm'),
      t('common.confirm'),
      {
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
        type: 'warning'
      }
    )

    if (confirmResult === 'confirm') {
      const { code, message } = await request.delete(`/auth/users/${row.id}`)
      if (code === 200) {
        ElMessage.success(t('user.deleteSuccess'))
        getUserList()
      } else {
        ElMessage.error(message || t('user.deleteFailed'))
      }
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除用户失败:', error)
      ElMessage.error(t('user.deleteFailed'))
    }
  }
}

// 处理表单提交
const handleSubmit = async () => {
  if (!userFormRef.value) return

  try {
    await userFormRef.value.validate()
    
    if (isEdit.value) {
      // 编辑用户
      const { code, message } = await request.put(`/auth/users/${userForm.value.id}`, {
        email: userForm.value.email,
        mobile: userForm.value.mobile,
        role: userForm.value.role
      })
      if (code === 200) {
        ElMessage.success(t('user.editSuccess'))
        dialogVisible.value = false
        getUserList()
      } else {
        ElMessage.error(message || t('user.editFailed'))
      }
    } else {
      // 添加用户
      const { code, message } = await request.post('/auth/users', userForm.value)
      if (code === 200) {
        ElMessage.success(t('user.addSuccess'))
        dialogVisible.value = false
        getUserList()
      } else {
        ElMessage.error(message || t('user.addFailed'))
      }
    }
  } catch (error) {
    console.error('保存用户失败:', error)
    ElMessage.error(isEdit.value ? t('user.editFailed') : t('user.addFailed'))
  }
}

// 分页处理
const handleSizeChange = (newSize) => {
  queryInfo.value.pagesize = newSize
  queryInfo.value.pagenum = 1
  getUserList()
}

const handleCurrentChange = (newPage) => {
  queryInfo.value.pagenum = newPage
  getUserList()
}

// 搜索框清空处理
const handleSearchClear = () => {
  queryInfo.value.pagenum = 1
  getUserList()
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

// 处理状态变更
const handleStatusChange = async (row, newStatus) => {
  try {
    const { code, message } = await request.put(`/auth/users/${row.id}/status`, {
      status: newStatus
    })
    
    if (code === 200) {
      ElMessage.success(t('user.statusUpdateSuccess'))
    } else {
      // 如果更新失败，恢复原来的状态
      row.status = !newStatus
      ElMessage.error(message || t('user.statusUpdateFailed'))
    }
  } catch (error) {
    // 发生错误时，恢复原来的状态
    row.status = !newStatus
    console.error('更新用户状态失败:', error)
    ElMessage.error(t('user.statusUpdateFailed'))
  }
}

// 初始化
getUserList()
</script>

<style scoped>
.user-container {
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.user-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.search-box {
  margin-bottom: 15px;
}

:deep(.el-card__body) {
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

.operation-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.w-full {
  width: 100%;
}
</style> 