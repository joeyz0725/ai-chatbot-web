<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { NButton, NCountdown, NDivider, NInput, NRadioButton, NRadioGroup, NSelect, useMessage } from 'naive-ui'
import HeaderComponent from '../chat/components/Header/index.vue'
import { useAppStore, useGptStore, useTokenStore, useUserStore } from '@/store'
import type { Language, Theme } from '@/store/modules/app/helper'
import type { Model } from '@/store/modules/chatgpt/helper'
import { t } from '@/locales'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { HoverButton, SvgIcon } from '@/components/common'
import { fetchTimeAPI, logoutAPI } from '@/api/common'
import { saveChatgptAPI } from '@/api/config'

const router = useRouter()
const appStore = useAppStore()
const userStore = useUserStore()
const tokenStore = useTokenStore()
const gptStore = useGptStore()
const { isMobile } = useBasicLayout()
const currentTheme = ref<Theme>(appStore.theme)
const currentLanguage = ref<Language>(appStore.language)
const logined = computed<boolean>(() => !!tokenStore.token)

const ms = useMessage()

const themeOptions: { label: string; value: Theme; icon: string }[] = [
  { label: t('setting.systemAutoTheme'), value: 'auto', icon: 'ri:contrast-line' },
  { label: t('setting.lightTheme'), value: 'light', icon: 'ri:sun-foggy-line' },
  { label: t('setting.darkTheme'), value: 'dark', icon: 'ri:moon-foggy-line' },
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

const handleThemeSelect = function (value: Theme) {
  currentTheme.value = value
  appStore.setTheme(currentTheme.value)
}

const handleLanguageSelect = function (value: Language) {
  currentLanguage.value = value
  appStore.setLanguage(value)
}

const handleBack = function () {
  router.go(-1)
}

// 退出登录
const handleLogout = function () {
  logoutAPI()
    .then(response => response.data)
    .then((data) => {
      if (data.success) {
      // 把gptStorage也给清除了
        tokenStore.removeToken()
        // 把gptStorage也给清除了
        gptStore.removeState()
        // 重置用户对象
        userStore.resetUserInfo()
        const leftCount = data.data.leftCount
        userStore.updateExtra({
          leftCount,
          isLogin: false,
          roleType: 0,
        })
        location.reload()
      }
      else {
      // 用户不存在
      }
      return data
    })
    .catch((error) => {
    // 处理错误
      console.log(error)
    })
}

const leftCount = computed(() => userStore.extra?.leftCount)
const leftCountofToday = computed(() => {
  if (leftCount.value !== -1)
    return leftCount.value
  else
    return t('setting.unlimited')
})
const computedFreshCountTime = ref<number>(0)
fetchTimeAPI().then(response => response.data).then((data) => {
  computedFreshCountTime.value = data.timeDifference
})

const roleType = computed(() => userStore.extra?.roleType || 0)
const modelOptions: { label: string; key: Model; value: Model }[] = [
  { label: 'GPT-3.5', key: 'gpt-3.5-turbo', value: 'gpt-3.5-turbo' },
  { label: 'GPT-4', key: 'gpt-4', value: 'gpt-4' },
]

const gptConfig = ref({
  model: gptStore.model || 'gpt-3.5-turbo',
  openaiAddress: gptStore.openaiAddress,
  openaiApiKey: gptStore.openaiApiKey,
  reverseProxyAddress: gptStore.reverseProxyAddress,
  accessToken: gptStore.accessToken,
})
watch(() => ({
  model: gptStore.model,
  openaiAddress: gptStore.openaiAddress,
  openaiApiKey: gptStore.openaiApiKey,
  reverseProxyAddress: gptStore.reverseProxyAddress,
  accessToken: gptStore.accessToken,
}), (newState) => {
  gptConfig.value = newState
})
const isChanged = ref<boolean>(false)
const isNotNull = ref<boolean>((
  gptConfig.value.model !== 'gpt-3.5-turbo'
  || gptConfig.value.openaiAddress !== ''
  || gptConfig.value.openaiApiKey !== ''
  || gptConfig.value.reverseProxyAddress !== ''
  || gptConfig.value.accessToken !== ''
))
const handleInputChange = function () {
  // 判断用户输入的值是否与初始值相等
  const isValueChanged = (
    gptConfig.value.model !== gptStore.model
    || gptConfig.value.openaiAddress !== gptStore.openaiAddress
    || gptConfig.value.openaiApiKey !== gptStore.openaiApiKey
    || gptConfig.value.reverseProxyAddress !== gptStore.reverseProxyAddress
    || gptConfig.value.accessToken !== gptStore.accessToken
  )
  // 更新 isChanged.value
  isChanged.value = isValueChanged
  const isValueNotNull = (
    gptConfig.value.model !== 'gpt-3.5-turbo'
    || gptConfig.value.openaiAddress !== ''
    || gptConfig.value.openaiApiKey !== ''
    || gptConfig.value.reverseProxyAddress !== ''
    || gptConfig.value.accessToken !== ''
  )
  isNotNull.value = isValueNotNull
}
const handleModelSelect = function (value: Model) {
  gptConfig.value.model = value
  handleInputChange()
}
const saveConfig = function () {
  saveChatgptAPI(gptConfig.value)
    .then(response => response.data)
    .then((data) => {
      if (data.success) {
        gptStore.updateState(gptConfig.value)
        ms.success(data.message)
      }
    }).catch((error) => {
      console.log(error)
    })
}

const resetConfig = function () {
  gptConfig.value = gptStore.getDefaultState()
  handleInputChange()
}
</script>

<template>
  <div class="w-full h-full">
    <HeaderComponent
      v-if="isMobile"
      :using-context="false"
      :title="$t('setting.setting')"
    />
    <div
      v-else
      class="flex justify-center items-center h-14
        sticky top-0 left-0 right-0 z-30 border-b dark:border-neutral-800 bg-white/80 dark:bg-black/20 backdrop-blur"
    >
      <HoverButton class="flex items-center" @click="handleBack">
        <span class="text-2xl dark:text-white">
          <SvgIcon icon="uiw:left" />
        </span>
      </HoverButton>
      <h2
        class="text-xl font-semibold flex-grow
        text-center mr-11"
      >
        {{ $t('setting.setting') }}
      </h2>
    </div>
    <div class="flex flex-col max-w-screen-xl gap-6 mt-5 mx-auto">
      <div class="flex flex-col justify-center items-center">
        <div :class="isMobile ? 'w-4/5' : 'w-3/5 max-w-lg'">
          <div class="flex flex-col gap-6">
            <div class="flex flex-col gap-3">
              <h3 class="text-lg font-bold">
                {{ $t('setting.theme') }}
              </h3>
              <NRadioGroup
                v-model:value="currentTheme"
                size="large" name="themeSelection"
                @update:value="handleThemeSelect"
              >
                <NRadioButton
                  v-for="theme in themeOptions"
                  :key="theme.value"
                  class="w-1/3 text-center truncate"
                  :value="theme.value"
                  :label="theme.label"
                />
              </NRadioGroup>
            </div>
            <div class="flex flex-col gap-3">
              <h3 class="text-lg font-bold">
                {{ $t('setting.language') }}
              </h3>
              <NSelect
                v-model:value="currentLanguage" :options="languageOptions"
                size="large" @update:value="handleLanguageSelect"
              />
            </div>
            <div class="flex flex-col gap-2">
              <h3 class="text-lg font-bold">
                {{ $t('setting.leftToday') }}
              </h3>
              <div class="flex justify-between">
                <p class="text-base">
                  {{ $t('setting.totalCount') }}：<span>{{ leftCountofToday }}</span>
                </p>
                <p v-show="leftCount !== -1" class="text-base">
                  {{ $t('setting.refreshLeft') }}：
                  <NCountdown ref="countdown" :duration="computedFreshCountTime" />
                </p>
              </div>
            </div>
          </div>
          <NDivider v-show="roleType < 20 || roleType === undefined"
            style="color: #666; font-size: 14px; margin-bottom: 0;"
          >
            {{ $t('setting.userOnly') }}
          </NDivider>
          <div class="flex flex-col gap">
            <div class="flex justify-between items-center my-2">
              <h3 class="text-lg font-bold">
                {{ $t('setting.chatGPTConfig') }}
              </h3>
              <div class="">
                <NButton
                  v-show="isNotNull" :disabled="roleType < 20 || roleType === undefined"
                  type="default" ghost style="margin-right: 10px;" @click="resetConfig"
                >{{ $t('common.reset') }}
                </NButton>
                <NButton
                  v-show="isChanged" :disabled="roleType < 20 || roleType === undefined"
                  type="error" style="margin-right: 10px;" @click="saveConfig"
                >{{ $t('common.save') }}
                </NButton>
              </div>
            </div>
            <div class="flex flex-col p-3 gap-4 bg-[#e5e7eb] rounded-xl dark:bg-[#28282c]">
              <div class="flex flex-wrap justify-between items-center">
                <p class="text-base" style="flex: 0 0 auto;">
                  {{ $t('setting.model') }}
                </p>
                <NSelect
                  v-model:value="gptConfig.model" :options="modelOptions"
                  size="medium" @update:value="handleModelSelect"
                  :disabled="roleType < 20 || roleType === undefined" style="flex: 0 0 auto; width: 200px;"
                />
              </div>
              <div class="flex flex-wrap justify-between items-center">
                <p class="text-base" style="flex: 0 0 auto;">
                  {{ $t('setting.openaiAddress') }}
                </p>
                <NInput
                  v-model:value="gptConfig.openaiAddress"
                  style="flex: 0 0 auto; width: 200px;" @update:value="handleInputChange"
                  :disabled="roleType < 20 || roleType === undefined"
                />
              </div>
              <div class="flex flex-wrap justify-between items-center">
                <p class="text-base" style="flex: 0 0 auto;">
                  {{ $t('setting.openaiApiKey') }}
                </p>
                <NInput
                  v-model:value="gptConfig.openaiApiKey"
                  style="flex: 0 0 auto; width: 200px;" @update:value="handleInputChange"
                  :disabled="roleType < 20 || roleType === undefined"
                />
              </div>
              <div class="flex flex-wrap justify-between items-center">
                <p class="text-base" style="flex: 0 0 auto;">
                  {{ $t('setting.reverseProxyAddress') }}
                </p>
                <NInput
                  v-model:value="gptConfig.reverseProxyAddress"
                  style="flex: 0 0 auto; width: 200px;" @update:value="handleInputChange"
                  :disabled="roleType < 20 || roleType === undefined"
                />
              </div>
              <div class="flex flex-wrap justify-between items-center">
                <p class="text-base" style="flex: 0 0 auto;">
                  {{ $t('setting.accessToken') }}
                </p>
                <NInput
                  v-model:value="gptConfig.accessToken"
                  style="flex: 0 0 auto; width: 200px;" @update:value="handleInputChange"
                  :disabled="roleType < 20 || roleType === undefined"
                />
              </div>
            </div>
          </div>
          <div v-if="logined" class="flex justify-center my-8">
            <NButton type="error" ghost @click="handleLogout">
              {{ $t('setting.logout') }}
            </NButton>
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
