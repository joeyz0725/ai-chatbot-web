<script setup lang="ts">
import { ref } from 'vue'
import { NModal, NForm, NFormItem, NInput, NButton, useMessage, FormInst, FormItemRule } from 'naive-ui'
import { t } from '@/locales'
import { changePasswordAPI } from '@/api/common'
interface Props{
  visible: boolean
}
defineProps<Props>()
const emit: (event: string, payload?: any) => void = defineEmits()

const ms = useMessage()

const formRules = {
  oldPassword: {
    key: 'oldPassword',
    required: true,
    trigger: ['input'],
    message: t('admin.passwordEmptyWarning'),
  },
  newPassword: {
    key: 'newPassword',
    required: true,
    trigger: ['input'],
    message: t('admin.passwordEmptyWarning'),
  },
  confirmNewPassword: [{
    key: 'confirmNewPassword',
    required: true,
    trigger: ['input'],
    validator: (rule: FormItemRule, value: string, callback: Function) => {
      if (passwordInfo.value.confirmNewPassword === ''){
        callback(t('admin.passwordEmptyWarning'));
        return
      }
      if (passwordInfo.value.newPassword !== passwordInfo.value.confirmNewPassword) {
        callback('确认密码与新的密码必须相同');
        return
      }
    },
  }],
}

const passwordInfo = ref({
  oldPassword: '',
  newPassword: '',
  confirmNewPassword: ''
})
const resetPasswordInfo = function() {
  passwordInfo.value.oldPassword = ''
  passwordInfo.value.newPassword = ''
  passwordInfo.value.confirmNewPassword = ''
}
const formRef = ref<FormInst | null>(null)
const handleChangePassword = function() {
  formRef.value?.validate((errors: any) => {
    if (!errors) {
      changePasswordAPI(passwordInfo.value).
        then(response => response.data).then((data) => {
        if (data.success) {
          ms.success(data.message)
          resetPasswordInfo()
          emit('close')
        }else{
          ms.error(data.message)
        }
      }).
      catch(error=>{
        
      }) 
    }
  })
}

</script>

<template>
  <NModal ref="itemsRef" :show="visible" preset="dialog" @mask-click="emit('close')"
    :closable="false" :showIcon="false" style="width:420px;" >
    <template #header>
      <h2 class="text-xl font-bold mx-auto">{{ t('admin.changePassword') }}</h2>
    </template>
    <template #default>
      <div class="flex justify-center items-center">
        <NForm
          ref="formRef" :model="passwordInfo" :rules="(formRules as any)" size="large"
          class="flex flex-col" label-placement="left" label-width="auto"
        >
          <NFormItem :label="$t('admin.oldPassword')" path="oldPassword">
            <NInput v-model:value="passwordInfo.oldPassword"
              type="password" show-password-on="click" />
          </NFormItem>
          <NFormItem :label="$t('admin.newPassword')" path="newPassword">
            <NInput v-model:value="passwordInfo.newPassword"
              type="password" show-password-on="click" />
          </NFormItem>
          <NFormItem :label="$t('admin.confirmNewPassword')" path="confirmNewPassword">
            <NInput v-model:value="passwordInfo.confirmNewPassword"
              type="password" show-password-on="click" />
          </NFormItem>
          <div class="flex justify-between  gap-6">
            <NButton type="primary" class="grow" @click="handleChangePassword">
              {{ $t('common.confirm') }}
            </NButton>
            <NButton class="grow" @click="emit('close')">
              {{ $t('common.cancel') }}
            </NButton>
          </div>
        </NForm>
      </div>
    </template>
  </NModal>
</template>