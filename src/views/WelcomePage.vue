<template>
  <div class="welcome-container">
    <el-card>
      <template #header>
        <div class="welcome-header">
          <el-icon><House /></el-icon>
          <span>欢迎使用</span>
        </div>
      </template>
      
      <div class="welcome-content">
        <h1>电商后台管理系统</h1>
        <el-row :gutter="20" class="statistics">
          <el-col :span="6">
            <el-card shadow="hover">
              <template #header>
                <div class="stat-header">
                  <el-icon><Shop /></el-icon>
                  <span>商品总数</span>
                </div>
              </template>
              <div class="stat-number">125</div>
            </el-card>
          </el-col>
          
          <el-col :span="6">
            <el-card shadow="hover">
              <template #header>
                <div class="stat-header">
                  <el-icon><User /></el-icon>
                  <span>用户总数</span>
                </div>
              </template>
              <div class="stat-number">85</div>
            </el-card>
          </el-col>
          
          <el-col :span="6">
            <el-card shadow="hover">
              <template #header>
                <div class="stat-header">
                  <el-icon><Tickets /></el-icon>
                  <span>订单总数</span>
                </div>
              </template>
              <div class="stat-number">238</div>
            </el-card>
          </el-col>
          
          <el-col :span="6">
            <el-card shadow="hover">
              <template #header>
                <div class="stat-header">
                  <el-icon><Money /></el-icon>
                  <span>总收入</span>
                </div>
              </template>
              <div class="stat-number">￥45,789</div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { House, Shop, User, Tickets, Money } from '@element-plus/icons-vue'
</script>

<style scoped>
.welcome-container {
  padding: 20px;
}

.welcome-header {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
}

.welcome-content {
  text-align: center;
}

.welcome-content h1 {
  color: #303133;
  margin-bottom: 40px;
}

.statistics {
  margin-top: 20px;
}

.stat-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #606266;
}

.stat-number {
  font-size: 24px;
  font-weight: bold;
  color: #409EFF;
  padding: 10px 0;
}

.el-card {
  margin-bottom: 20px;
}
</style> 