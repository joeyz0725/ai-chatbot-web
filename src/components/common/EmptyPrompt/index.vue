<script setup lang="ts">
import SvgIcon from '../SvgIcon/index.vue'
import { useBasicLayout } from '@/hooks/useBasicLayout'
interface Props {
  title: string
  content: string
  index: number
  isMouseOn: boolean
}
const props = defineProps<Props>()
const { isMobile } = useBasicLayout()
</script>

<template>
  <div class="flex rounded-md justify-between items-center relative">
    <div class="flex flex-col w-full overflow-hidden" :class="[!isMobile ? 'gap-1' : '']">
      <h3 class="font-bold text-base truncate">
        {{ props.title }}
      </h3>
      <p class="text-gray-500 truncate">
        {{ props.content }}
      </p>
    </div>
    <button
      v-show="props.isMouseOn" :key="props.index"
      class="w-9 h-9 flex items-center justify-center border rounded-full absolute right-0"
    >
      <SvgIcon icon="ph:arrow-up-bold" />
    </button>
  </div>
</template>
