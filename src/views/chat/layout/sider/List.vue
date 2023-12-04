<script setup lang='ts'>
import { computed, ref } from 'vue'
import { NScrollbar } from 'naive-ui'
import { SvgIcon, ChatRecord } from '@/components/common'
import MenuModal from '@/components/common/ChatRecord/MenuModal.vue'
import { useChatStore } from '@/store'

interface activeItem {
  uuid: number
  title: string
  isEdit: boolean
  index: number
}

const chatStore = useChatStore()
const dataSources = computed(() => chatStore.history)
const activeHistory = chatStore?.getHistoryAndIndexByCurrentActive || null
const activeItem = ref<activeItem>({
  uuid: activeHistory?.uuid,
  title: activeHistory?.title,
  isEdit: activeHistory?.isEdit,
  index: activeHistory?.index,
})
const showEditModal = ref<boolean>(false)
const showDelModal = ref<boolean>(false)
</script>

<template>
  <NScrollbar class="px-4">
    <div class="flex flex-col gap-1 text-sm">
      <template v-if="!dataSources.length">
        <div class="flex flex-col items-center mt-4 text-center text-neutral-400">
          <SvgIcon icon="ri:inbox-line" class="mb-2 text-3xl" />
          <span>{{ $t('common.noData') }}</span>
        </div>
      </template>
      <template v-else>
        <div v-for="(item, index) of dataSources" :key="index">
          <!-- 第3步：由src/components/common/ChatRecord/ChatRecord.vue中的
               emit('update:showEditModal', value)传递过来触发
               因为v-model:showEditModal="showEditModal"的双向绑定，改变了
               showEditModal的值，从而触发下面第4步的双向绑定
          -->
          <ChatRecord :item="item" :index="index"
                      v-model:activeItem="activeItem"
                      v-model:showEditModal="showEditModal"
                      v-model:showDelModal="showDelModal"/>
        </div>
      </template>
    </div>
    <!-- 第4步：由于前面第3步中将showEditModal变量改变了，这里又双向绑定了
         MenuModal组件中的showEditModal值，所以又会触发一次，跳到第5步
    -->
    <MenuModal v-model:showEditModal="showEditModal" v-model:showDelModal="showDelModal"
               v-model:activeItem="activeItem" />
  </NScrollbar>
</template>
