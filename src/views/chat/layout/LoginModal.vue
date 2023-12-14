<script setup lang="ts">
import { createVNode, ref } from 'vue'
import type { FormInst } from 'naive-ui'
import { NButton, NForm, NFormItem, NInput, NModal, useMessage } from 'naive-ui'
import { useGptStore, useTokenStore, useUserStore, useChatStore } from '@/store'
import { getServerState } from '@/store/modules/chat/helper'
import { t } from '@/locales'
import { loginAPI } from '@/api/common'
import { extractTokenFromHeader } from '@/utils/functions'
import SvgIcon from '@/components/common/SvgIcon/index.vue'
interface Props {
  visible: boolean
}
defineProps<Props>()
const emit: (event: string, payload?: any) => void = defineEmits()
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
const userStore = useUserStore()
const tokenStore = useTokenStore()
const gptStore = useGptStore()
const chatStore = useChatStore()

const formRef = ref<FormInst | null>(null)

const setAuthorizationHeader = function(response: any) {
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
}
const setUser = function(data: any) {
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
  return data.data.config
}

const goLogin = function () {
  loginAPI(user.value)
    .then((response) => {
      return setAuthorizationHeader(response)
    }).then((data) => {
      if (data.success) {
        const config = setUser(data)
        // 查询用户的聊天记录
        getServerState().then((state)=>{
          chatStore.setChatState(state as any)
          chatStore.setActive((state as any)?.active, (state as any)?.activeTitle)
        })
        closeModal()
        return config
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
  emit('hide')
}

const handleEnter = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    event.preventDefault()
    login(event)
  }
}

const showContactAuthor = function (){
  emit('showContactAuthor')
}
</script>

<template>
  <NModal
    :show="visible" preset="dialog" :on-after-leave="closeModal" :closable="false"
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
          type="password" show-password-on="click" @keypress="handleEnter"
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
      <NButton type="default" size="large" style="margin-top: 16px;
          color:#07C160; border-color: #07C160;" @click="showContactAuthor">
        <template #icon>
          <SvgIcon icon="fa:wechat" class="text-3xl" />
        </template>
        <span>{{ t('upgrade.contactAuthortoGetAccount') }}</span>
      </NButton>
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
