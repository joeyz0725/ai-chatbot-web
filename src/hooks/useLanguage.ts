import { computed } from 'vue'
import { enUS, esAR, frFR, jaJP, koKR , zhCN, zhTW } from 'naive-ui'
import { useAppStore } from '@/store'
import { setLocale } from '@/locales'

export function useLanguage() {
  const appStore = useAppStore()

  const language = computed(() => {
    switch (appStore.language) {
      case 'en-US':
        setLocale('en-US')
        return enUS
      case 'ru-RU':
        setLocale('ru-RU')
        return enUS
      case 'es-AR':
        setLocale('es-AR')
        return esAR
      case 'fr-FR':
        setLocale('fr-FR')
        return frFR
      case 'ko-KR':
        setLocale('ko-KR')
        return koKR
      case 'ja-JP':
        setLocale('ja-JP')
        return jaJP
      case 'zh-CN':
        setLocale('zh-CN')
        return zhCN
      case 'zh-TW':
        setLocale('zh-TW')
        return zhTW
      default:
        setLocale('zh-CN')
        return zhCN
    }
  })

  return { language }
}
