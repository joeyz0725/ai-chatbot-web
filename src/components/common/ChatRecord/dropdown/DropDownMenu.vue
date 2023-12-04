<script setup lang="ts">
// import { ref } from 'vue'
import { NList, NListItem } from 'naive-ui'
import SvgIcon from '@/components/common/SvgIcon/index.vue'

interface Props {
  item: {
    uuid: number
    title: string
    isEdit: boolean
    index: number
  }
}
const props = defineProps<Props>();
const emit = defineEmits();

// 第1步：点击左侧列表任意一项的：“编辑对话名称”触发
const updateShowEditModal = (value: boolean) => {
  // 调用父组件（../ChatRecord.vue组件）中的
  // onUpdate:showEditModal方法（在renderOperationMenu代码块里）
  emit('update:showEditModal', props.item, props.item.index, value);
};

const updateShowDelModal = (value: boolean) => {
  emit('update:showDelModal', props.item, props.item.index, value);
};


// var showDelModal = ref(false)

</script>

<template>
  <NList hoverable clickable>
    <NListItem @click="updateShowEditModal(true)">
      <div class="gap-2 flex items-center">
        <SvgIcon icon="iconoir:edit" class="flex items-center justify-center w-5 h-5">
        </SvgIcon>
        <div>{{ $t('list.editChat') }}</div>
      </div>
    </NListItem>
    <NListItem @click="updateShowDelModal(true)">
      <div class="gap-2 flex items-center text-red-500">
        <SvgIcon icon="ri:delete-bin-line" class="flex items-center justify-center w-5 h-5">
        </SvgIcon>
        <div>{{ $t('list.deleteChat') }}</div>     
      </div>
    </NListItem>
  </NList>
</template>