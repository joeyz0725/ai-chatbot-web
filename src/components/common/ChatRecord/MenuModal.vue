<script setup lang="ts">
import { createVNode, h, ref } from 'vue'
import type { ButtonProps } from 'naive-ui'
import { NModal } from 'naive-ui'
import ConfirmInput from './dropdown/ConfirmInput.vue'
import { useAppStore, useChatStore } from '@/store'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { debounce } from '@/utils/functions/debounce'

interface Props {
  // uuid: number
  // title: string
  activeItem: {
    uuid: number
    title: string
    isEdit: boolean
    index: number
  }
  showEditModal: boolean
  showDelModal: boolean
}
const props = defineProps<Props>()
// const { activeItem, showEditModal, showDelModal } = defineProps<Props>()
const emit = defineEmits()
const appStore = useAppStore()
const chatStore = useChatStore()
const { isMobile } = useBasicLayout()

const itemTitle = ref(props.activeItem.title)

// let title = ref<string>(activeItem?.title)
// const showDelModal = ref<boolean>(props.showDelModal)
const isDarkTheme = ref(appStore.theme)

const pButtonProps: ButtonProps = {
  size: 'medium',
  textColor: '#fff',
}
const nButtonProps: ButtonProps = {
  size: 'medium',
  textColor: isDarkTheme.value === 'dark' ? '#fff' : '#000',
}

const renderTitle = (title: string) => {
  return () => {
    return h('div', {
      class: 'n-dialog__title',
      style: {
        'font-weight': 'bold',
      },
    }, [title])
  }
}

const renderContent = () => {
  return () => createVNode(ConfirmInput, {
    'activeItem': {
      uuid: props.activeItem.uuid,
      title: props.activeItem.title,
      isEdit: props.activeItem.isEdit,
      index: props.activeItem.index,
    },
    'onUpdate:activeItem': (title: string) => {
      itemTitle.value = title
      emit('update:activeItem', {
        ...props.activeItem,
        title,
      })
    },
    'onUpdate:showEditModal': (value) => {
      emit('update:showEditModal', value)
    },
  })
}

function handleDelete(index: number, event?: MouseEvent | TouchEvent) {
  event?.stopPropagation()

  chatStore.deleteHistory(index).then(() => {
    chatStore.recordServerState()

    if (isMobile.value)
      appStore.setSiderCollapsed(true)
  })
}

const handleDeleteDebounce = debounce(handleDelete, 600)

const onEditConfirm = () => {
  chatStore.updateHistory(props.activeItem.uuid, itemTitle.value, false)
  emit('update:showEditModal', false)
}
const onEditCancel = () => {
  emit('update:showEditModal', false)
}
const onDelConfirm = function () {
  handleDeleteDebounce(props.activeItem.index)
  emit('update:showDelModal', false)
}

const onDelCancel = () => {
  emit('update:showDelModal', false)
}
</script>

<template>
  <!-- 第5步：第一行:show="props.showEditModal"双向绑定
    由父组件src/views/chat/layout/sider/List.vue绑定传递过来
    改变了当前组件（MenuModal）上的属性showEditModal  -->
  <NModal
    :show="props.showEditModal"
    preset="dialog"
    :show-icon="false"
    style="border-radius: 12px;"
    :auto-focus="false"
    :title="renderTitle($t('list.editChat'))"
    :content="renderContent()"
    :positive-text="$t('common.confirm')"
    :negative-text="$t('common.cancel')"
    :positive-button-props="pButtonProps"
    :negative-button-props="nButtonProps"
    :on-positive-click="onEditConfirm"
    :on-negative-click="onEditCancel"
    :on-mask-click="onEditCancel"
    :on-close="onEditCancel"
  />
  <!-- 同上第一行双向绑定父组件（src/views/chat/layout/sider/List.vue） -->
  <NModal
    :show="props.showDelModal"
    preset="dialog"
    :show-icon="false"
    style="border-radius: 12px;"
    :auto-focus="false"
    :title="renderTitle($t('list.deleteTitle'))"
    :content="$t('list.confirmDelete')"
    :positive-text="$t('common.delete')"
    :negative-text="$t('common.cancel')"
    :positive-button-props="pButtonProps"
    :negative-button-props="nButtonProps"
    :on-positive-click="onDelConfirm"
    :on-negative-click="onDelCancel"
    :on-mask-click="onDelCancel"
    :on-close="onDelCancel"
  />
</template>

<style scoped>

</style>
