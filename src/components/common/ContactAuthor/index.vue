<script setup lang='ts'>
import { ref } from 'vue'
import { NModal } from 'naive-ui'
import qrCode from '@/assets/qr-code.jpg'
import { t } from '@/locales'

interface Props{
  visible: boolean
}
defineProps<Props>()
const emit: (event: string, payload?: any) => void = defineEmits()

const hideContactAuthor = function (){
  emit('hide')
}

</script>

<template>
  <NModal ref="qrcodeRef" preset="dialog" :show="visible" :closable="false"
    @mask-click="hideContactAuthor" :showIcon="false" style="width:400px;">
    <template #header>
      <h2 class="text-xl font-bold mx-auto">{{t('upgrade.scanQrCode')}}</h2>
    </template>
    <template #default>
      <div class="flex flex-col justify-center items-center">
        <p >{{t('upgrade.wechatNumber')}}<span>Joey_manyoushijie</span></p>
        <img :src="qrCode" />
      </div>
    </template>
  </NModal>
</template>