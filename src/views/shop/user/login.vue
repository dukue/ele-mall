<template>
  <div class="login-container">
    <el-card class="login-card">
      <template #header>
        <div class="card-header">
          <h2>用户登录</h2>
        </div>
      </template>
      <el-form
        ref="formRef"
        :model="loginForm"
        :rules="rules"
        label-width="80px"
        @keyup.enter="handleLogin"
      >
        <el-form-item label="用户名" prop="username">
          <el-input 
            v-model="loginForm.username"
            placeholder="请输入用户名"
            :prefix-icon="User"
          />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            :prefix-icon="Lock"
            show-password
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            @click="handleLogin"
            class="submit-btn"
          >
            登录
          </el-button>
          <router-link to="/shop/register" class="register-link">
            <el-button>注册账号</el-button>
          </router-link>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'

const store = useStore()
const router = useRouter()
const route = useRoute()
const formRef = ref(null)
const loading = ref(false)

const loginForm = reactive({
  username: '',
  password: ''
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  if (!formRef.value) return
  
  try {
    const valid = await formRef.value.validate()
    if (valid) {
      loading.value = true
      await store.dispatch('shop/user/login', loginForm)
      await store.dispatch('shop/user/getUserInfo')
      ElMessage.success('登录成功')
      
      // 获取重定向地址或默认跳转到商城首页
      const redirect = route.query.redirect || '/shop'
      router.push(redirect)
    }
  } catch (error) {
    console.error('登录失败:', error)
    ElMessage.error(error.message || '登录失败')
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f7fa;
  padding: 20px;

  .login-card {
    width: 100%;
    max-width: 400px;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

    :deep(.el-card__header) {
      padding: 15px 20px;
      border-bottom: 1px solid #ebeef5;
    }

    .card-header {
      text-align: center;
      h2 {
        margin: 0;
        color: #303133;
        font-size: 20px;
      }
    }
  }

  :deep(.el-form) {
    padding: 20px;

    .el-form-item:last-child {
      margin-bottom: 0;
    }

    .el-button {
      width: 100%;
      margin-bottom: 10px;
      height: 40px;
      font-size: 16px;
    }
  }

  .register-link {
    text-decoration: none;
    display: block;
  }
}
</style> 