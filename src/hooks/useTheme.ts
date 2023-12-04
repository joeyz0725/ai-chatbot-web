import type { GlobalThemeOverrides } from 'naive-ui'
import { computed, watch } from 'vue'
import { darkTheme, useOsTheme } from 'naive-ui'
import { useAppStore } from '@/store'
import { lightThemeOverrides, darkThemeOverrides } from './themeSelection'

// 自定义 hook: 处理应用程序的主题切换逻辑
export function useTheme() {
  // 使用自定义 hook 获取应用程序状态
  const appStore = useAppStore()

  // 获取操作系统当前主题的值
  const OsTheme = useOsTheme()

  // 计算属性：根据应用程序的主题模式判断是否为暗色模式
  const isDark = computed(() => {
    if (appStore.theme === 'auto')
      return OsTheme.value === 'dark'
    else
      return appStore.theme === 'dark'
  })

  // 计算属性：根据 isDark 的值选择相应的主题
  const theme = computed(() => {
    return isDark.value ? darkTheme : undefined
  })

  // 计算属性：根据 isDark 的值选择相应的主题覆盖
  const themeOverrides = computed<GlobalThemeOverrides>(() => {
    if (isDark.value) {
      return darkThemeOverrides
    }
    return lightThemeOverrides
  })

  // 监听 isDark 的变化，在根元素上添加或移除 'dark' 类
  watch(
    () => isDark.value,
    (dark) => {
      // 当 isDark 为真时，添加 'dark' 类
      if (dark)
        document.documentElement.classList.add('dark')
      else
      // 当 isDark 为假时，移除 'dark' 类
        document.documentElement.classList.remove('dark')
    },
    { immediate: true }, // 立即执行一次回调以处理初始状态
  )

  // 返回计算属性 theme 和 themeOverrides
  return { theme, themeOverrides }
}
