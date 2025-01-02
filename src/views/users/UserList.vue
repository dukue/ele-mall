<template>
  <div class="user-container">
    <el-card>
      <!-- 搜索和添加区域 -->
      <div class="search-box">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input
              v-model="queryInfo.query"
              placeholder="请输入用户名/邮箱/手机号"
              clearable
              @clear="getUserList">
              <template #append>
                <el-button @click="getUserList">
                  <el-icon><Search /></el-icon>
                </el-button>
              </template>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="addDialogVisible = true">
              <el-icon><Plus /></el-icon>添加用户
            </el-button>
          </el-col>
        </el-row>
      </div>

      <!-- 用户列表 -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index" label="#" width="50" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="mobile" label="手机号" />
        <el-table-column prop="role" label="角色">
          <template #default="scope">
            <el-tag :type="scope.row.role === 'admin' ? 'danger' : 'success'">
              {{ scope.row.role === 'admin' ? '管理员' : '普通用户' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              @change="handleStatusChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button-group>
              <el-button 
                type="primary" 
                :icon="Edit"
                @click="showEditDialog(scope.row)">
                编辑
              </el-button>
              <el-button 
                type="danger" 
                :icon="Delete"
                @click="removeUser(scope.row.id)">
                删除
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
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

    <!-- 添加用户对话框 -->
    <el-dialog
      v-model="addDialogVisible"
      title="添加用户"
      width="50%"
      @close="addDialogClosed">
      <el-form
        ref="addFormRef"
        :model="addForm"
        :rules="userFormRules"
        label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" type="password" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email" />
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="addForm.role">
            <el-option label="管理员" value="admin" />
            <el-option label="普通用户" value="user" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 修改用户对话框 -->
    <el-dialog
      v-model="editDialogVisible"
      title="修改用户"
      width="50%"
      @close="editDialogClosed">
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="userFormRules"
        label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" />
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="editForm.role">
            <el-option label="管理员" value="admin" />
            <el-option label="普通用户" value="user" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUser">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Search, Plus, Edit, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '@/utils/request'

// 查询参数
const queryInfo = ref({
  query: '',
  pagenum: 1,
  pagesize: 10
})

// 用户列表数据
const userList = ref([])
const total = ref(0)

// 控制对话框显示
const addDialogVisible = ref(false)
const editDialogVisible = ref(false)

// 表单数据
const addForm = ref({
  username: '',
  password: '',
  email: '',
  mobile: '',
  role: 'user'
})

const editForm = ref({
  id: '',
  username: '',
  email: '',
  mobile: '',
  role: ''
})

// 表单验证规则
const userFormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  mobile: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ]
}

// 获取用户列表
const getUserList = async () => {
  try {
    const data = await request.get('/auth/users', {
      params: queryInfo.value
    })
    userList.value = data.users
    total.value = data.total
  } catch (error) {
    console.error('获取用户列表失败:', error)
  }
}

// 监听 switch 状态改变
const handleStatusChange = async (row) => {
  try {
    await request.put(`/auth/users/${row.id}/status`, {
      status: row.status
    })
    ElMessage.success(`用户 ${row.username} 状态更新成功`)
  } catch (error) {
    row.status = !row.status
    console.error('更新用户状态失败:', error)
  }
}

// 添加用户
const addUser = async () => {
  try {
    await request.post('/auth/users', addForm.value)
    ElMessage.success('添加用户成功')
    addDialogVisible.value = false
    getUserList()
  } catch (error) {
    console.error('添加用户失败:', error)
  }
}

// 展示编辑对话框
const showEditDialog = (row) => {
  editForm.value = { ...row }
  editDialogVisible.value = true
}

// 修改用户信息
const editUser = async () => {
  try {
    await request.put(`/auth/users/${editForm.value.id}`, {
      email: editForm.value.email,
      mobile: editForm.value.mobile,
      role: editForm.value.role
    })
    ElMessage.success('修改用户信息成功')
    editDialogVisible.value = false
    getUserList()
  } catch (error) {
    console.error('修改用户信息失败:', error)
  }
}

// 删除用户
const removeUser = async (id) => {
  const confirmResult = await ElMessageBox.confirm(
    '此操作将永久删除该用户, 是否继续?',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).catch(err => err)

  if (confirmResult !== 'confirm') return

  try {
    await request.delete(`/auth/users/${id}`)
    ElMessage.success('删除用户成功')
    getUserList()
  } catch (error) {
    console.error('删除用户失败:', error)
  }
}

// 监听 pagesize 改变
const handleSizeChange = (newSize) => {
  queryInfo.value.pagesize = newSize
  getUserList()
}

// 监听页码值改变
const handleCurrentChange = (newPage) => {
  queryInfo.value.pagenum = newPage
  getUserList()
}

// 监听添加对话框的关闭
const addDialogClosed = () => {
  addForm.value = {
    username: '',
    password: '',
    email: '',
    mobile: '',
    role: 'user'
  }
}

// 监听修改对话框的关闭
const editDialogClosed = () => {
  editForm.value = {
    id: '',
    username: '',
    email: '',
    mobile: '',
    role: ''
  }
}

// 组件挂载时获取用户列表
onMounted(() => {
  getUserList()
})
</script>

<style scoped>
.user-container {
  padding: 20px;
}

.search-box {
  margin-bottom: 20px;
}

.el-pagination {
  margin-top: 20px;
  justify-content: flex-end;
}
</style> 