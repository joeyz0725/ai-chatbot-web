<script setup lang='ts'>
import { computed } from 'vue'
import { NModal } from 'naive-ui'
import Item from './Item.vue'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { t } from '@/locales'
interface Props{
  visible: boolean
}
defineProps<Props>()
const emit: (event: string, payload?: any) => void = defineEmits()
type BtnType = 'primary' | 'default'

const { isMobile } = useBasicLayout()

const visitorItem = {
  title: t('upgrade.visitor'),
  services: [{
    have: true,
    service: t('upgrade.chatWithChatGPT')
  }, {
    have: true,
    service: t('upgrade.free5Everday')
  },{
    have: false,
    service: t('upgrade.canSaveChats')
  }],
  start: t('upgrade.chatNow'),
  btnType: 'default' as BtnType
}
const userItem = {
  title: t('upgrade.user'),
  services: [{
    have: true,
    service: t('upgrade.chatWithChatGPT')
  }, {
    have: true,
    service: t('upgrade.free20Everday')
  },{
    have: true,
    service: t('upgrade.canSaveChats')
  },{
    have: false,
    service: t('upgrade.ownerAlone')
  }],
  start: t('upgrade.contactAuthortoGetAccount'),
  btnType: 'primary' as BtnType
}
const vipItem = {
  title: t('upgrade.vip'),
  services: [{
    have: true,
    service: t('upgrade.chatWithChatGPT')
  }, {
    have: true,
    service: t('upgrade.freeforever')
  },{
    have: true,
    service: t('upgrade.canSaveChats')
  },{
    have: true,
    service: t('upgrade.ownerAlone')
  },{
    have: true,
    service: t('upgrade.canConfigMore')
  },{
    have: true,
    service: t('upgrade.authorSupport')
  },{
    have: true,
    service: t('upgrade.sendCode')
  }],
  start: t('upgrade.contactAuthorforMore'),
  btnType: 'primary' as BtnType
}

const getContentClass = computed(() => {
  let styleClass = 'flex justify-center '
  if (isMobile.value) {
    styleClass += 'flex-col'
  } else {
    styleClass += 'flex-row'
  }
  return styleClass
})


const handleContactAuthor = function() {
  emit('showContactAuthor')
  emit('close')
}

</script>

<template>
  <NModal ref="itemsRef" :show="visible" preset="dialog" @mask-click="emit('close')"
    :closable="false" :showIcon="false" style="width:840px;" >
    <template #header>
      <h2 class="text-xl font-bold mx-auto">{{t('upgrade.selectItem')}}</h2>
    </template>
    <template #default>
      <div :class="getContentClass">
        <Item :title="visitorItem.title" 
          :services="visitorItem.services" 
          :start="visitorItem.start" 
          :btnType="visitorItem.btnType"
          :btnMethod="()=>emit('close')"/>
        <Item :title="userItem.title" 
          :services="userItem.services"
          :start="userItem.start"
          :btnType="userItem.btnType"
          :btnMethod="handleContactAuthor" />
        <Item :title="vipItem.title" 
          :services="vipItem.services" 
          :start="vipItem.start"
          :btnType="vipItem.btnType"
          :btnMethod="handleContactAuthor"/>
      </div>
    </template>
  </NModal>
</template>