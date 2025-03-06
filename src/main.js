import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIcons from '@element-plus/icons-vue'
import i18n from './plugins/i18n'
import permission from './directives/permission'

const app = createApp(App)

// 注册所有图标
Object.entries(ElementPlusIcons).forEach(([key, component]) => {
  app.component(key, component)
})

app.use(ElementPlus)
app.use(router)
app.use(store)
app.use(i18n)
app.use(permission)

app.mount('#app')
