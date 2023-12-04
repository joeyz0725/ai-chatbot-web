<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { NButton, NRadioGroup, NRadioButton, NSelect, NCountdown } from 'naive-ui'
import { useAppStore, useUserStore, useTokenStore } from '@/store'
import type { Language, Theme } from '@/store/modules/app/helper'
import { t } from '@/locales'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import HeaderComponent from '../chat/components/Header/index.vue'
import { HoverButton, SvgIcon } from '@/components/common'
import { logoutAPI, fetchTimeAPI } from '@/api/common'

const router = useRouter()
const appStore = useAppStore()
const userStore = useUserStore()
const tokenStore = useTokenStore()
const { isMobile } = useBasicLayout()
const currentTheme = ref<Theme>(appStore.theme)
const currentLanguage = ref<Language>(appStore.language)
const logined = computed<boolean>(() => tokenStore.token?true:false)

const themeOptions: { label: string; value: Theme; icon: string }[] = [
  { label: t('setting.systemAutoTheme'), value: 'auto', icon: 'ri:contrast-line' }, 
  { label: t('setting.lightTheme'), value: 'light', icon: 'ri:sun-foggy-line' }, 
  { label: t('setting.darkTheme'), value: 'dark', icon: 'ri:moon-foggy-line' }
]

const languageOptions: { label: string; key: Language; value: Language }[] = [
  { label: '简体中文', key: 'zh-CN', value: 'zh-CN' },
  { label: '繁體中文', key: 'zh-TW', value: 'zh-TW' },
  { label: 'English', key: 'en-US', value: 'en-US' },
  { label: '한국어', key: 'ko-KR', value: 'ko-KR' },
  { label: '日本語', key: 'ja-JP', value: 'ja-JP' },
  { label: 'Русский язык', key: 'ru-RU', value: 'ru-RU' },
  { label: 'Français', key: 'fr-FR', value: 'fr-FR' },
  { label: 'español', key: 'es-AR', value: 'es-AR' },
]

const handleThemeSelect = function(value: Theme) {
  currentTheme.value = value
  appStore.setTheme(currentTheme.value)
}

const handleLanguageSelect = function(value: Language) {
  currentLanguage.value = value
  appStore.setLanguage(value)
}

const handleBack = function() {
  router.go(-1);
}

const handleLogout = function() {
  logoutAPI()
  .then((response)=>response.data)
  .then(data => {
    if (data.success) {
      tokenStore.removeToken()
      userStore.resetUserInfo()
      const leftCount = data.data.leftCount
      userStore.updateExtra({
        leftCount: leftCount,
        isLogin: false
      })
      location.reload()
    }else {
      // 用户不存在
    }
  })
  .catch(error => {
    // 处理错误
  })
}

const leftCount = computed(()=>userStore.extra?.leftCount)
const leftCountofToday = computed(()=>{
  if (leftCount.value !== -1)
    return leftCount.value
  else 
    return t('setting.unlimited')
})
const computedFreshCountTime = ref<number>(0);
fetchTimeAPI().then(response=>response.data).then((data)=>{
  computedFreshCountTime.value = data.timeDifference
})

</script>

<template>
  <div class="w-full h-full">
    <HeaderComponent
      v-if="isMobile"
      :using-context="false"
    />
    <div class="flex flex-col max-w-screen-xl gap-6 my-0 mx-auto">
      <div>
        <div class="flex justify-center items-center p-5">
          <HoverButton @click="handleBack" class="flex items-center">
            <span class="text-2xl dark:text-white">
              <SvgIcon icon="uiw:left" />
            </span>
          </HoverButton>
          <h2 class="text-lg font-semibold flex-grow text-center mr-11">{{ $t('setting.setting') }}</h2>
        </div>
      </div>
      <div>
        <div class="flex justify-center items-center">
          <div class="flex flex-col gap-6"
                :class="isMobile?'w-4/5':'w-3/5 max-w-lg'">
            <div class="flex flex-col gap-3">
              <h3 class="text-xl font-bold">{{ $t('setting.theme') }}</h3>
              <NRadioGroup v-model:value="currentTheme" 
                  size="large"  name="themeSelection"
                  :on-update:value="handleThemeSelect">
                <NRadioButton class="w-1/3 text-center truncate"
                  v-for="theme in themeOptions"
                  :key="theme.value"
                  :value="theme.value"
                  :label="theme.label"
                />
              </NRadioGroup>
            </div>
            <div class="flex flex-col gap-3">
              <h3 class="text-xl font-bold">{{ $t('setting.language') }}</h3>
              <NSelect v-model:value="currentLanguage" :options="languageOptions"
                  size="large" :on-update:value="handleLanguageSelect" >
              </NSelect>
            </div>
            <div class="flex flex-col gap-3">
              <h3 class="text-xl font-bold">{{ $t('setting.leftToday') }}</h3>
              <div class="flex justify-between">
              <p class="text-base">{{ $t('setting.totalCount') }}：<span>{{ leftCountofToday }}</span></p>
              <p v-show="leftCount!==-1" class="text-base">{{ $t('setting.refreshLeft')}}：
                <NCountdown ref="countdown" :duration="computedFreshCountTime" />
              </p>
              </div>
            </div>
            <div v-if="logined" class="flex justify-center mt-5">
              <NButton type="error" ghost @click="handleLogout">
                {{ $t('setting.logout') }}
              </NButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  ::v-deep(.n-upload-trigger){
    display: flex;
  }
  ::v-deep(.n-radio__label){
    overflow: hidden; /* 隐藏超出部分 */
    white-space: nowrap; /* 禁止文本换行 */
    text-overflow: ellipsis; /* 使用省略号表示超出部分 */
  }
  .selected-radio{
    background-color: #5d5cde;
  }
  .n-radio-button.n-radio-button--checked{
    color: #fff;
    background-color: #5d5cde;
  }
</style>