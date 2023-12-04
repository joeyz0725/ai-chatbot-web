<script setup lang='ts'>
// 导入 Vue 3 的 Composition API 中的相关函数和模块
import { computed, onMounted, ref } from 'vue'
// 导入 Naive UI 中的 NSpin 组件
import { NSpin, NH2, NH3 } from 'naive-ui'
// 导入项目根目录下的 package.json 文件
import pkg from '../../../../package.json'
// 导入自定义的 fetchChatConfig 函数和 useAuthStore 函数
import { fetchChatConfig } from '@/api'
import { useAuthStore } from '@/store'

// 定义 ConfigState 接口，规定 chat 配置的数据结构
interface ConfigState {
  timeoutMs?: number
  reverseProxy?: string
  apiModel?: string
  socksProxy?: string
  httpsProxy?: string
  usage?: string
}

// 使用 useAuthStore 函数创建 authStore 实例
const authStore = useAuthStore()

// 创建一个响应式引用对象，初始值为 false，用于表示数据加载状态
const loading = ref(false)

// 创建一个响应式引用对象，初始值为 null，用于存储 chat 配置数据
const config = ref<ConfigState>()

// 创建一个计算属性，判断是否是 ChatGPT API
const isChatGPTAPI = computed<boolean>(() => !!authStore.isChatGPTAPI)

// 定义异步函数，用于获取 chat 配置数据
async function fetchConfig() {
  try {
    // 设置 loading 为 true，表示开始加载数据
    loading.value = true
    // 调用 fetchChatConfig 函数，获取 chat 配置数据
    const { data } = await fetchChatConfig<ConfigState>()
    // 将获取到的数据赋值给 config 引用对象
    config.value = data
  }
  finally {
    // 无论请求成功或失败，都将 loading 设置为 false，表示加载结束
    loading.value = false
  }
}

// 在组件挂载后调用 fetchConfig 函数，获取初始化数据
onMounted(() => {
  fetchConfig()
})
</script>

<template>
  <NSpin :show="loading">
    <div class="p-4 space-y-4">
      <div>
        <NH2 class="font-bold">奇小宝</NH2>
        <NH3 class="n-text-lg">一款基于原生ChatGPT的聊天机器人</NH3>
      </div>
      <div class="p-2 space-y-2 rounded-md bg-neutral-100 dark:bg-neutral-700">
        <p>
          永久免费 - 禁止发送任何违法违禁文字
        </p>
      </div>
    </div>
  </NSpin>
</template>
