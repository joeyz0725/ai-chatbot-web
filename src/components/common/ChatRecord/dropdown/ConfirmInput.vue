<script setup lang="ts">
import { ref } from 'vue'
import { NInput } from 'naive-ui'
import { useChatStore } from '@/store'

interface Props {
  // uuid: number
  // title: string
  activeItem: {
    uuid: number
    title: string
    isEdit: boolean
    index: number
  }
}
const props = defineProps<Props>()
const emit: (event: string, payload?: any) => void = defineEmits()

const chatStore = useChatStore()
const uuid = ref<number>(props.activeItem.uuid)
const title = ref<string>(props.activeItem.title)

function handleInput(event: KeyboardEvent) {
  emit('update:activeItem', title.value)
  if (event.key === 'Enter') {
    event?.stopPropagation()
    chatStore.updateHistory(uuid.value, title.value, { isEdit: false })
    emit('update:showEditModal', false)
  }
}
</script>

<template>
  <NInput
    ref="input"
    v-model:value="title"
    size="medium"
    class="my-2 rounded-3xl"
    style="border-radius: 8px"
    :autofocus="true"
    @keyup="handleInput($event)"
  />
</template>
