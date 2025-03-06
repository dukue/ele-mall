<template>
  <div class="login-container" :style="{ backgroundImage: `url(${bgImage})` }">
    <h1 class="system-title">电商后台管理系统</h1>
    <div class="login-box">
      <!-- 头像区域 -->
      <div class="avatar-box">
        <img src="../assets/logo.png" alt="avatar">
      </div>
      
      <!-- 登录表单区域 -->
      <el-form 
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="login-form">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input 
            v-model="loginForm.username"
            placeholder="请输入用户名"
            prefix-icon="User">
          </el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input 
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            prefix-icon="Lock"
            @keyup.enter="login">
          </el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button style="width: 100%;" type="primary" @click="login" :loading="loading">登录</el-button>
          <!-- <el-button type="info" @click="resetLoginForm">重置</el-button> -->
        </el-form-item>
        <div class="copyright">&copy; 2024-2025 丁凯 毕设</div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'

const router = useRouter()
const loginFormRef = ref()
const loading = ref(false)
const bgImage = ref('https://api.vvhan.com/api/bing?rand=sj')



// 登录表单的数据绑定对象
const loginForm = ref({
  username: 'admin',
  password: '123456'
})

// 表单验证规则
const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
  ]
}

// 重置登录表单
// const resetLoginForm = () => {
//   loginFormRef.value.resetFields()
// }

// 登录
const login = () => {
  loginFormRef.value.validate(async valid => {
    if (!valid) return
    
    loading.value = true
    try {
      const { code, data, message } = await request.post('/auth/login', loginForm.value)
      if (code === 200) {
        // 保存 token
        window.sessionStorage.setItem('token', data.token)
        // 保存用户信息
        window.sessionStorage.setItem('userInfo', JSON.stringify(data.userInfo))
        
        router.push('/home')
        ElMessage.success(message || '登录成功')
      } else {
        ElMessage.error(message || '登录失败')
      }
    } catch (error) {
      console.error('登录失败:', error)
      ElMessage.error('登录失败，请检查用户名和密码')
    } finally {
      loading.value = false
    }
  })
}

</script>

<style scoped>
.system-title {
  position: absolute;
  top: 5%;
  left: 50%;
  transform: translateX(-50%);
  color: #fff;
  font-size: 36px;
  font-weight: 600;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  margin: 0;
  z-index: 2;
  letter-spacing: 2px;
}

.login-container {
  background-color: #2b4b6b;
  height: 100%;
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
}

.login-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(5px);
}

.login-box {
  width: 450px;
  height: 400px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  overflow: visible;
}
.copyright {
  position: absolute;
  bottom: 5px;
  left: 50%;
  transform: translateX(-50%);
  color: #797171;
  font-size: 12px;
}
.avatar-box {
  height: 110px;
  width: 110px;
  border: 2px solid #9f9898;
  border-radius: 50%;
  padding: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  top: -10px;
  background-color: #857f7f;
  z-index: 1;
}

.avatar-box img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #fff;
}

.login-form {
  position: relative;
  margin-top: 100px;
  width: 100%;
  padding: 20px 40px;
  box-sizing: border-box;
}

.btns {
  display: flex;
  justify-content: center;
  margin-top: 30px;
  gap: 20px;
}

:deep(.el-input__wrapper) {
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: 44px;
}

:deep(.el-button) {
  padding: 12px 36px;
  border-radius: 4px;
  font-weight: 500;
  height: 44px;
}

:deep(.el-button--primary) {
  background: linear-gradient(45deg, #409eff, #36a3f7);
  border: none;
}

:deep(.el-button--info) {
  background: #909399;
  border: none;
}
</style> 