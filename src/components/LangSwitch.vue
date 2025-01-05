<template>
  <el-dropdown @command="handleCommand" trigger="click">
    <span class="lang-switch">
      {{ getCurrentLanguageName() }}
      <el-icon class="el-icon--right"><arrow-down /></el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="lang in availableLanguages"
          :key="lang.code"
          :command="getLocaleCode(lang.code)"
          :disabled="currentLang === getLocaleCode(lang.code)"
        >
          {{ lang.name }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'
import request from '@/utils/request'
import eventBus from '@/utils/eventBus'

const { locale } = useI18n()

// 当前语言
const currentLang = computed(() => locale.value)

// 可用语言列表
const availableLanguages = ref([])

// 获取语言列表
const getLanguageList = async () => {
  try {
    const { code, data } = await request.get('/i18n/languages')
    if (code === 200) {
      // 所有语言都显示在菜单中
      availableLanguages.value = data || []
    }
  } catch (error) {
    console.error('获取语言列表失败:', error)
  }
}

// 语言代码映射
const getLocaleCode = (code) => {
  const codeMap = {
    'zh': 'zh-CN',
    'en': 'en-US',
    'ja': 'ja-JP'
  }
  return codeMap[code] || code
}

// 获取当前语言名称
const getCurrentLanguageName = () => {
  const currentLanguage = availableLanguages.value.find(
    lang => getLocaleCode(lang.code) === currentLang.value
  )
  return currentLanguage?.name || 'English'  // 默认显示英文
}

// 切换语言
const handleCommand = (command) => {
  locale.value = command
  localStorage.setItem('locale', command)
  ElMessage.success(command === 'zh-CN' ? '切换语言成功' : 'Language switched successfully')
  window.location.reload()
}

// 监听语言列表更新事件
const refreshLanguages = () => {
  getLanguageList()
}

// 初始化
onMounted(() => {
  getLanguageList()
  eventBus.on('languages-updated', refreshLanguages)
})

onUnmounted(() => {
  eventBus.off('languages-updated', refreshLanguages)
})
</script>

<style scoped>
.lang-switch {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #000000;
}

.el-icon {
  margin-left: 4px;
}
</style> 