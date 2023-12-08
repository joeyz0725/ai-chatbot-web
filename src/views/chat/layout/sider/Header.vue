<script setup lang='ts'>
import { computed } from 'vue'
import { NButton } from 'naive-ui'
import { SvgIcon } from '@/components/common'
import { useAppStore, useChatStore } from '@/store'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { t } from '@/locales'

const appStore = useAppStore()
const chatStore = useChatStore()

const { isMobile } = useBasicLayout()

function handleAdd() {
  chatStore.addHistory({ title: t('chat.newChatTitle'), uuid: Date.now(), isEdit: false })
  if (isMobile.value)
    appStore.setSiderCollapsed(true)
}

const logoSrc = computed(() => {
  if (appStore.theme === 'dark')
    return '/pwa-dark-192x192.png'
  return '/logo.svg'
})

const logoNameSrc = computed(() => {
  if (appStore.theme === 'dark')
    return '/text-logo-dark-192x192.png'
  return '/text-logo-192x192.png'
})
</script>

<template>
  <div class="flex items-center justify-between">
    <div class="flex items-center overflow-hidden">
      <div class="">
        <a href="/"><img width="48" :src="logoSrc"></a>
      </div>
      <a href="/"><img width="80" :src="logoNameSrc"></a>
      <!-- <H1 class="text-xl font-bold">奇小宝</H1> -->
    </div>
    <NButton
      strong secondary style="padding: 24px 12px; border-radius: 12px; width: 130px;"
      @click="handleAdd()"
    >
      <template #icon>
        <SvgIcon class="text-3xl dark:text-white" icon="fa6-solid:plus" />
      </template>
      <span class="text-base font-semibold truncate dark:text-white">{{ $t('chat.newChatButton') }}</span>
    </NButton>
  </div>
</template>
