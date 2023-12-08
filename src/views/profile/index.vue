<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { FormInst } from 'naive-ui'
import {
  NAvatar, NButton, NForm, NFormItem,
  NInput, useMessage,
} from 'naive-ui'
// @ts-ignore
import VueToyFace from 'vue-toy-face'
import HeaderComponent from '../chat/components/Header/index.vue'
import AvatarSelector from './AvatarSelector.vue'
import defaultAvatar from '@/assets/profile-pic.png'
import { useChatStore, useUserStore } from '@/store'
import { t } from '@/locales'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { HoverButton, SvgIcon } from '@/components/common'
import { saveUserAPI } from '@/api/user'
import { splitAndCombine } from '@/utils/functions'

const router = useRouter()
const { isMobile } = useBasicLayout()
const usertore = useUserStore()
const chatStore = useChatStore()

const formRef = ref<FormInst | null>(null)
const userInfo = ref({
  avatar: usertore.userInfo?.avatar ?? '',
  name: usertore.userInfo?.name ?? '',
  description: usertore.userInfo?.description ?? '',
})
const avatarGroup = ref<number>(splitAndCombine(userInfo.value.avatar)[0] || 1)
const avatarNumber = ref<number>(splitAndCombine(userInfo.value.avatar)[1] || 1)

const message = useMessage()

const formRules = {
  name: [{
    key: 'name',
    required: true,
    trigger: ['input'],
    message: t('setting.nameEmptywarning'),
  }, {
    key: 'password',
    max: 15,
    trigger: ['input'],
    message: t('setting.nameExceedwarning'),
  },
  ],
  description: {
    key: 'description',
    max: 200,
    trigger: ['input'],
    message: t('setting.dscriptionExceedwarning'),
  },
}

const handleSave = function (e: Event) {
  e.preventDefault()
  if (userInfo.value.name !== '')
    userInfo.value.name = userInfo.value.name.trim()

  formRef.value?.validate((errors) => {
    if (!errors) {
      saveUserAPI(userInfo.value).then(response => response.data).then((data) => {
        if (data.success) {
          usertore.updateUserInfo(userInfo.value)
          message.success(t('common.saveSuccess'), {
            duration: 1000,
            onAfterLeave: () => {
              chatStore.reloadRoute()
            },
          })
        }
      })
    }
  })
}

const handleBack = function () {
  router.go(-1)
}

const modalShow = ref<boolean>(false)
const showModal = function () {
  modalShow.value = true
}
const hideModal = function () {
  modalShow.value = false
}

const changeAvatar = function (position: string) {
  userInfo.value.avatar = position
  avatarGroup.value = splitAndCombine(position)[0]
  avatarNumber.value = splitAndCombine(position)[1]
}

const overlayShow = ref<boolean>(false)
const showOverlay = function (isShow: boolean) {
  overlayShow.value = isShow
}
</script>

<template>
  <div class="w-full h-full">
    <HeaderComponent
      v-if="isMobile"
      :using-context="false"
      :title="$t('setting.profileTitle')"
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
        {{ $t('setting.profileTitle') }}
      </h2>
    </div>
    <div class="flex flex-col max-w-screen-xl gap-6 mt-5 mx-auto">
      <div>
        <NForm
          ref="formRef" :model="userInfo" :rules="formRules" size="large"
          class="flex flex-col justify-center items-center"
        >
          <div class="flex justify-center items-center">
            <button
              class="flex m-2 relative" @click="showModal"
              @mouseover="showOverlay(true)" @mouseout="showOverlay(false)"
            >
              <template v-if="userInfo.avatar">
                <VueToyFace
                  size="80" rounded="80" style="margin:0;"
                  :group="avatarGroup" :toy-number="avatarNumber"
                />
              </template>
              <template v-else>
                <NAvatar
                  :src="defaultAvatar"
                  style="width: 80px; height: 80px; border-radius: 40px;"
                />
              </template>
              <div
                v-show="overlayShow" class="absolute top-0 left-0 rounded-full
                w-full h-full bg-black bg-opacity-50 flex justify-center items-center"
              >
                <SvgIcon class="text-xl text-white" icon="iconoir:profile-circle" />
              </div>
            </button>
          </div>
          <div
            class="w-2/5 flex flex-col gap-2"
            :class="isMobile ? 'w-4/5' : 'w-3/5 max-w-lg'"
          >
            <NFormItem :label="$t('setting.name')" path="name">
              <NInput v-model:value="userInfo.name" :placeholder="$t('setting.namePlaceholder')" />
            </NFormItem>
            <NFormItem :label="$t('setting.description')" path="description">
              <NInput
                v-model:value="userInfo.description" :placeholder="$t('setting.dscriptionExceedwarning')"
                type="textarea" :autosize="{ minRows: 5, maxRows: 8 }"
              />
            </NFormItem>
            <div class="grid grid-flow-col justify-stretch">
              <NButton
                type="primary" style="height: 48px; border-radius: 16px; color: #fff"
                @click="handleSave"
              >
                {{ $t('common.save') }}
              </NButton>
            </div>
          </div>
        </NForm>
      </div>
    </div>
    <AvatarSelector :visible="modalShow" @close="hideModal" @change="changeAvatar" />
  </div>
</template>

<style scoped>
  ::v-deep(.n-upload-trigger){
    display: flex;
  }
</style>
