<script setup lang='ts'>
import { ref } from 'vue'
import { useMessage } from 'naive-ui'
import AvatarComponent from './Avatar.vue'
import TextComponent from './Text.vue'
import { SvgIcon } from '@/components/common'
// import { useIconRender } from '@/hooks/useIconRender'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { t } from '@/locales'
import { copyToClip } from '@/utils/copy'

interface Props {
  dateTime?: string
  text?: string
  inversion?: boolean
  error?: boolean
  loading?: boolean
}

interface Emit {
  (ev: 'regenerate'): void
  (ev: 'delete'): void
}

const props = defineProps<Props>()

const emit = defineEmits<Emit>()

const { isMobile } = useBasicLayout()

// const { iconRender } = useIconRender()

const message = useMessage()

const textRef = ref<HTMLElement>()

const asRawText = ref(props.inversion)

const messageRef = ref<HTMLElement>()

// const options = computed(() => {
//   const common = [
//     {
//       label: t('chat.copy'),
//       key: 'copyText',
//       icon: iconRender({ icon: 'ri:file-copy-2-line' }),
//     },
//     {
//       label: t('common.delete'),
//       key: 'delete',
//       icon: iconRender({ icon: 'ri:delete-bin-line' }),
//     },
//   ]

//   if (!props.inversion) {
//     common.unshift({
//       label: asRawText.value ? t('chat.preview') : t('chat.showRawText'),
//       key: 'toggleRenderType',
//       icon: iconRender({ icon: asRawText.value ? 'ic:outline-code-off' : 'ic:outline-code' }),
//     })
//   }

//   return common
// })

// function handleSelect(key: 'copyText' | 'delete' | 'toggleRenderType') {
//   switch (key) {
//     case 'copyText':
//       handleCopy()
//       return
//     case 'toggleRenderType':
//       asRawText.value = !asRawText.value
//       return
//     case 'delete':
//       emit('delete')
//   }
// }

async function handleCopy() {
  try {
    await copyToClip(props.text || '')
    message.success(t('chat.copied'))
  }
  catch {
    message.error(t('chat.copyFailed'))
  }
}

function handleRegenerate() {
  messageRef.value?.scrollIntoView()
  emit('regenerate')
}
</script>

<template>
  <div
    ref="messageRef"
    class="flex w-full overflow-hidden"
    :class="[{ 'flex-row-reverse': inversion },
    { 'mb-5': !isMobile }, 
    { 'flex-col gap-1 mb-2': isMobile },
    { 'items-end': isMobile && inversion }]"
  >
    <div :class="[ {'flex items-center': isMobile},
        {'flex-row-reverse gap-1': isMobile && inversion}]">
      <div
        class="text-2xl flex items-center justify-center flex-shrink-0 
                w-8 h-8 overflow-hidden rounded-full basis-8"
        :class="[inversion ? 'ml-1' : 'mr-1']"
      >
        <AvatarComponent :image="inversion" />
      </div>
      
      <p v-if="isMobile">{{ props.dateTime }}</p>
    </div>
    <div class="overflow-hidden text-sm " style="font-size: 16px;" 
    :class="[{ 'items-start mr-10': !isMobile && !inversion }, 
            { 'items-end ml-10': !isMobile && inversion }
            ]">
      <div
        class="flex items-start"
        :class="[inversion ? 'flex-col-reverse' : 'flex-col']"
      >
        <TextComponent
          ref="textRef"
          :inversion="inversion"
          :error="error"
          :text="text"
          :loading="loading"
          :as-raw-text="asRawText"
        />
        <div class="flex flex-row">
          <button
            v-if="!inversion"
            class="transition my-1 mr-3 text-xl text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300"
            @click="handleCopy"
          >
            <SvgIcon icon="mingcute:copy-line" />
          </button>
          <button
            v-if="!inversion"
            class="transition my-1 mr-3 text-xl text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300"
            @click="handleRegenerate"
          >
            <SvgIcon icon="jam:refresh" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
