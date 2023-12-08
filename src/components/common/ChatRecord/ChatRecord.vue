<script setup lang='ts'>
import { createVNode, ref } from 'vue'
import { NDropdown } from 'naive-ui'
import SvgIcon from '../SvgIcon/index.vue'
import DropDownMenu from './dropdown/DropDownMenu.vue'
import { useAppStore, useChatStore } from '@/store'
import { useBasicLayout } from '@/hooks/useBasicLayout'

interface OneChat {
  item: {
    uuid: number
    title: string
    isEdit: boolean
  }
  index: number
  activeItem: {
    uuid: number
    title: string
    isEdit: boolean
    index: number
  }
}
const props = defineProps<OneChat>()
const emit: (event: string, payload?: any) => void = defineEmits()

const isMouseOn = ref<boolean>(false)
// console.log(props)

// const uuid = ref<number>(props.item.uuid)
// const title = ref<string>(props.item.title)
// const activeUuid = ref<number>(props.activeUuid)
// const activeTitle = ref<string>(props.activeTitle)
// watch(showEditModal, (newValue) => {
//   emit('update:showEditModal', newValue)
// });
const operations = ref([{
  key: 'operationGroup',
},
])

const appStore = useAppStore()
const chatStore = useChatStore()

const { isMobile } = useBasicLayout()

// 第2步：由./dropdown/DropDownMenu.vue中的
// emit('update:showEditModal', value);触发过来冰雕用
const updateShowEditModal = (item: Chat.History, index: number, value: boolean) => {
  // 调用父组件src/views/chat/layout/sider/List.vue中的
  // v-model:showEditModal="showEditModal，同步父组件中的showEditModal的值
  handleSelect(item, index)
  emit('update:showEditModal', value)
}
const updateShowDelModal = (item: Chat.History, index: number, value: boolean) => {
  handleSelect(item, index)
  emit('update:showDelModal', value)
}

const renderOperationMenu = (item: OneChat['activeItem']) => {
  return () => createVNode(DropDownMenu,
    {
      'item': item,
      'menuShow': showDropDown.value,
      'onUpdate:showEditModal': updateShowEditModal,
      'onUpdate:showDelModal': updateShowDelModal,
    })
}

const setActiveItem = (item: OneChat['activeItem']) => {
  // emit('update:activeUuid', uuid)
  // emit('update:activeTitle', title)
  emit('update:activeItem', item)
}

function handleSelect(item: Chat.History, index: number) {
  chatStore.setActive(item.uuid, item.title)
  // 在父组件List中，设置当前选中的项
  const activeItem = {
    ...item,
    index,
  }
  setActiveItem(activeItem)

  // if (isMobile.value)
  //   appStore.setSiderCollapsed(true)
}

function isActive(uuid: number) {
  return chatStore.active === uuid
}

const getThemeClass = ref((uuid: number) => {
  let styleClass = ''
  if (appStore.theme === 'dark') {
    styleClass = 'hover:bg-[#ffffff14] '
    if (isActive(uuid)) {
      styleClass = 'bg-[#5d5cde] '
      if (!isMobile.value)
        styleClass += 'pr-14'
    }
  }
  else {
    styleClass = 'hover:bg-[#ebecff] '
    if (isActive(uuid)) {
      styleClass = 'bg-[#ebecff] '
      if (!isMobile.value)
        styleClass += 'pr-14'
    }
  }
  return styleClass
})

const showDropDown = ref(false)
const handleShowDropDown = function () {
  showDropDown.value = !showDropDown.value
}
</script>

<template>
  <a
    class="relative flex items-center gap-2 px-3 py-5 break-all border-0
             rounded-md cursor-pointer group"
    :class="getThemeClass(item.uuid)"
    @mouseover="isMouseOn = true"
    @mouseout="isMouseOn = false"
    @touchend="handleSelect(item, index)"
    @click="handleSelect(item, index)"
  >
    <div class="relative flex-1 overflow-hidden break-all text-ellipsis whitespace-nowrap">
      <!-- <NInput
        v-if="item.isEdit"
        v-model:title="title" size="medium"
        @keypress="handleEnter(item, false, $event)"
      /> -->
      <span>{{ item.title }}</span>
    </div>
    <template v-if="!isMobile">
      <div
        v-show="isMouseOn"
        class="absolute flex items-center justify-center
                  w-9 h-9 right-3 my-0 mx-auto bg-white rounded-full"
      >
        <NDropdown
          :show="showDropDown"
          placement="bottom-end"
          trigger="click"
          size="large"
          :options="operations"
          :render-option="renderOperationMenu(props.activeItem)"
          :on-clickoutside="() => showDropDown = false"
        >
          <button
            class="w-9 h-9 flex items-center justify-center"
            @click="handleShowDropDown"
          >
            <SvgIcon icon="ep:more-filled" class="dark:text-black" />
          </button>
        </NDropdown>
      </div>
    </template>
    <template v-else>
      <div class="flex justify-end items-center">
        <button
          class="w-9 h-9 flex justify-end items-center"
          @click.stop="updateShowEditModal(item, index, true)"
          @touchend.stop="updateShowEditModal(item, index, true)"
        >
          <SvgIcon icon="iconoir:edit" class="w-6 h-6 dark:text-white" />
        </button>
        <button
          class="w-9 h-9 flex justify-end items-center"
          @click.stop="updateShowDelModal(item, index, true)"
          @touchend.stop="updateShowDelModal(item, index, true)"
        >
          <SvgIcon icon="ri:delete-bin-line" class="w-6 h-6 dark:text-white" />
        </button>
      </div>
    </template>
  </a>
</template>

<style scoped>
  .n-list {
    border-radius: 12px;
  }
  .n-list-dark:hover {
    background-color: #ffffff14;
  }
  .n-list-dark-selected {
    background-color: #5d5cde;
  }
</style>
