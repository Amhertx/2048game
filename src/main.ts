import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'

// 创建 Pinia 实例
const pinia = createPinia()
const app = createApp(App)

// 注册 Pinia
app.use(pinia)
app.mount('#app')
