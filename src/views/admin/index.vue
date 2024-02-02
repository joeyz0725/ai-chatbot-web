<script setup lang="ts">
import { ref } from 'vue'
import { NButton, NInput, useMessage } from 'naive-ui'
import { useRouter } from 'vue-router'
import HeaderComponent from '../chat/components/Header/index.vue'
import AdminModal from './modal.vue'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { HoverButton, SvgIcon } from '@/components/common'
import { fetchApiConfig, saveApiConfig } from '@/api/admin'
import { t } from '@/locales'

const ms = useMessage()
const router = useRouter()
const { isMobile } = useBasicLayout()

const handleBack = function () {
  router.go(-1)
}

const isNewShow = ref<boolean>(false)
const isResetShow = ref<boolean>(false)
const showNewModal = function () {
  isNewShow.value = true
}
const hideNewModal = function () {
  isNewShow.value = false
}
const showResetModal = function () {
  isResetShow.value = true
}
const hideResetModal = function () {
  isResetShow.value = false
}

const apiConfig = ref({
  apiKey: '',
  apiBaseUrl: ''
})
fetchApiConfig().then(data=>{
  const config = data.data.data
  apiConfig.value.apiKey = config.openaiApiKey
  apiConfig.value.apiBaseUrl = config.openaiApiBaseUrl
}).catch(e=>{
  ms.error(t('common.searchFailure'))
})

const clickResetApiConfig = function() {
  apiConfig.value.apiKey = ''
  apiConfig.value.apiBaseUrl = ''
}
const clickSaveApiConfig = function() {
  saveApiConfig(apiConfig.value).then(data=>{
    const result = data.data
    if(result.success){
      apiConfig.value.apiKey = result.data.apiKey
      apiConfig.value.apiBaseUrl = result.data.apiBaseUrl
      ms.success(result.message)
    }else{
      ms.error(result.message)
    }
  }).catch(e=>{
    ms.error(t('common.saveFailure'))
  })
}
</script>

<template>
  <HeaderComponent
    v-if="isMobile"
    :using-context="false"
    :title="$t('admin.adminOnly')"
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
      {{ $t('admin.adminOnly') }}
    </h2>
  </div>
  <div class="flex flex-col max-w-screen-xl gap-6 mt-5 mx-auto">
    <div class="flex flex-col justify-center items-center">
      <div :class="isMobile ? 'w-4/5' : 'w-3/5 max-w-lg'">
        <div class="flex flex-col gap">
          <div class="flex justify-between items-center my-2">
            <h3 class="text-lg font-bold">
              {{ $t('admin.accountConfig') }}
            </h3>
          </div>
          <div class="flex flex-col p-3 gap-4 bg-[#e5e7eb] rounded-xl dark:bg-[#28282c]">
            <div class="flex flex-wrap justify-between items-center">
              <p class="text-base" style="flex: 0 0 auto;">
                {{ $t('admin.createNewAccount') }}
              </p>
              <NButton type="error" ghost style="width:80px;" @click="showNewModal">
                {{ $t('admin.createBtn') }}
              </NButton>
            </div>
            <div class="flex flex-wrap justify-between items-center">
              <p class="text-base" style="flex: 0 0 auto;">
                {{ $t('admin.resetPassword') }}
              </p>
              <NButton type="error" ghost style="width:80px;" @click="showResetModal">
                {{ $t('admin.chooseAccount') }}
              </NButton>
            </div>
          </div>
        </div>
        <div class="flex flex-col gap">
          <div class="flex justify-between items-center my-2">
            <h3 class="text-lg font-bold">
              {{ $t('admin.rootAPIConfig') }}
            </h3>
            <div class="">
              <NButton
                type="default" ghost style="margin-right: 10px;" @click="clickResetApiConfig"
              >{{ $t('common.reset') }}
              </NButton>
              <NButton
                type="error" style="margin-right: 10px;" @click="clickSaveApiConfig"
              >{{ $t('common.save') }}
              </NButton>
            </div>
          </div>
          <div class="flex flex-col p-3 gap-4 bg-[#e5e7eb] rounded-xl dark:bg-[#28282c]">
            <div class="flex justify-between items-center gap-4">
              <p class="text-base flex-none whitespace-nowrap overflow-hidden overflow-ellipsis">
                {{ $t('admin.rootApiKey') }}
              </p>
              <NInput class="flex-grow"
                v-model:value="apiConfig.apiKey"
              />
            </div>
            <div class="flex justify-between items-center gap-3">
              <p class="text-base flex-none whitespace-nowrap overflow-hidden overflow-ellipsis">
                {{ $t('admin.rootApiBaseUrl') }}
              </p>
              <NInput class="flex-grow"
                v-model:value="apiConfig.apiBaseUrl"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <AdminModal
    :new-visible="isNewShow" :reset-visible="isResetShow"
    @closeNew="hideNewModal" @closeReset="hideResetModal"
  />
</template>
