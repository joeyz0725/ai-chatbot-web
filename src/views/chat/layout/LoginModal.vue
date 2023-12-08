<script setup lang="ts">
import { createVNode, ref, watch } from 'vue'
import type { FormInst } from 'naive-ui'
import { NButton, NForm, NFormItem, NInput, NModal, useMessage } from 'naive-ui'
import { useGptStore, useSettingStore, useTokenStore, useUserStore } from '@/store'
import { t } from '@/locales'
import { loginAPI } from '@/api/common'
import { extractTokenFromHeader } from '@/utils/functions'
// @ts-expect-error

interface userInfo {
  username: string
  password: string
}
const user = ref<userInfo>({
  username: '',
  password: '',
})

const formRules = {
  username: {
    required: true,
    trigger: 'input',
    message: t('setting.usernameEmptywarning'),
  },
  password: {
    required: true,
    trigger: 'input',
    message: t('setting.passwordEmptywarning'),
  },
}
const ms = useMessage()
const settingStore = useSettingStore()
const userStore = useUserStore()
const tokenStore = useTokenStore()
const gptStore = useGptStore()
const show = ref<boolean>(settingStore.showLoginModal ?? false)
watch(() => settingStore.showLoginModal, (newValue) => {
  show.value = newValue
})
const formRef = ref<FormInst | null>(null)

const goLogin = function () {
  loginAPI(user.value)
    .then((response) => {
      if (!response.data.success) {
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
    }).then((data) => {
      if (data.success) {
        const userInfo = data.data.user
        userStore.updateUserInfo({
          avatar: userInfo.avatar,
          name: userInfo.name,
          description: userInfo.description,
        })
        userStore.updateExtra({
          leftCount: userInfo.leftCount,
          isLogin: true,
          roleType: userInfo.roleType,
        })
        settingStore.updateSetting({ showLoginModal: false })
        return data.data.config
      }
      else {
        ms.error(data.message)
        return false
      }
    }).then((config) => {
      gptStore.updateState(config)
    })
    .catch((error) => {

    })
}

const login = (e: Event) => {
  e.preventDefault()
  formRef.value?.validate((errors) => {
    if (!errors)
      goLogin()
  })
}

const closeModal = () => {
  settingStore.updateSetting({ showLoginModal: false })
}

const handleEnter = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    event.preventDefault()
    login(event)
  }
}
</script>

<template>
  <NModal
    v-model:show="show" preset="dialog" :on-after-leave="closeModal" :closable="false"
    :title="() => createVNode('h3', { class: 'my-0 mx-auto' }, t('setting.login'))" :show-icon="false"
    style="width: 328px;height: 400px; display: flex; flex-direction: column;"
  >
    <NForm
      ref="formRef" :model="user" :rules="formRules" label-placement="left" label-width="auto"
      class="flex flex-col justify-center pt-8 gap-2"
    >
      <NFormItem path="username">
        <NInput
          v-model:value="user.username" size="large" :placeholder="t('setting.username')"
          @keypress="handleEnter"
        />
      </NFormItem>
      <NFormItem path="password">
        <NInput
          v-model:value="user.password" size="large" :placeholder="t('setting.password')"
          type="password" @keypress="handleEnter"
        />
      </NFormItem>
      <div class="w-full flex justify-between gap-3 mt-4">
        <NButton type="primary" size="large" style="flex-grow: 1;" @click="login">
          {{ t('setting.login') }}
        </NButton>
        <NButton type="default" size="large" style="flex-grow: 1;" @click="closeModal">
          {{ t('common.cancel') }}
        </NButton>
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
