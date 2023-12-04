<script setup lang="ts">
import { ref, watch, createVNode } from 'vue'
import { NModal, NForm, NFormItem , NInput, NButton, FormInst, useMessage } from 'naive-ui'
import { useSettingStore, useUserStore, useTokenStore } from '@/store'
import { t } from '@/locales'
import { loginAPI } from '@/api/common'
import { extractTokenFromHeader } from '@/utils/functions'
// @ts-ignore
import { SvgIcon } from '@/components/common'

interface userInfo {
  username: string
  password: string
}
const user = ref<userInfo>({
  username: '1',
  password: '1'
})

const formRules = {
  username: {
    required: true,
    trigger: 'blur',
    message: t('setting.usernameEmptywarning')
  },
  password: {
    required: true,
    trigger: 'blur',
    message: t('setting.passwordEmptywarning')
  }
}
const ms = useMessage()
const settingStore = useSettingStore()
const userStore = useUserStore()
const tokenStore = useTokenStore()
const show = ref<boolean>(settingStore.showLoginModal ?? false)
watch(() => settingStore.showLoginModal, (newValue) => {
  show.value = newValue
})
const formRef = ref<FormInst | null>(null)

const goLogin = function (){
  loginAPI(user.value)
  .then(response => {
    if (!response.data.success){
      ms.error(response.data.message)
      return Promise.reject()
    }
    const authorizationHeader = response.headers['authorization-web']
    if (authorizationHeader) {
      const token: string | null = extractTokenFromHeader(authorizationHeader)
      if (token != null)
        tokenStore.setToken(token)
    }
    return response.data
  }).then(data => {
    if (data.success){
      const userInfo = data.data
      userStore.updateUserInfo({
        avatar: userInfo.avatar,
        name: userInfo.name,
        description: userInfo.description
      })
      userStore.updateExtra({
        leftCount: userInfo.leftCount,
        isLogin: true
      })
      settingStore.updateSetting({showLoginModal: false})
    }
  }).catch(error => {

  })
}

const login = (e: Event) => {
  e.preventDefault()
  formRef.value?.validate((errors) => {
    if (!errors) {
      goLogin()
    }
  })
  return
}

const closeModal = () => {
  settingStore.updateSetting({showLoginModal: false})
}


const handleEnter = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    event.preventDefault()
    login(event)
  }
}
</script>

<template>
  <NModal v-model:show="show" preset="dialog" :onAfterLeave="closeModal" :closable="false"
    :title="()=>createVNode('h3', { class: 'my-0 mx-auto' }, t('setting.login'))" :showIcon="false"
    style="width: 328px;height: 400px; display: flex; flex-direction: column;">
    <NForm ref="formRef" :model="user" :rules="formRules" label-placement="left" label-width="auto"
      class="flex flex-col justify-center pt-8 gap-2">
      <NFormItem path="username">
        <NInput v-model:value="user.username" size="large" :placeholder="t('setting.username')" 
          @keypress="handleEnter" />
      </NFormItem>
      <NFormItem path="password">
        <NInput v-model:value="user.password" size="large" :placeholder="t('setting.password')" 
          type="password"  @keypress="handleEnter"/>
      </NFormItem>
      <div class="w-full flex justify-between gap-3 mt-4">
        <NButton type="primary" size="large" @click="login" style="flex-grow: 1;">{{t('setting.login')}}</NButton>
        <NButton type="default" size="large" @click="closeModal" style="flex-grow: 1;">{{t('common.cancel')}}</NButton>
      </div>
      <!-- 微信登录，暂不实现
      <NButton type="default" size="large" style="margin-top: 16px; 
          color:#07C160; border-color: #07C160;">
        <template #icon>
          <SvgIcon icon="fa:wechat" class="text-3xl" />
        </template>
        <span>{{ t('setting.wechatLogin') }}</span>
      </NButton>
      -->
    </NForm>
  </NModal>
</template>

<style scoped>
  .n-input--focus {
    border: 0 !important;
    background-color: transparent !important;
  }
</style>