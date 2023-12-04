<script setup lang='ts'>
import { computed, ref } from 'vue'
import { NModal, NTabPane, NTabs } from 'naive-ui'
import General from './General.vue'
import Advanced from './Advanced.vue'
import About from './About.vue'
import { useAuthStore } from '@/store'
import { SvgIcon } from '@/components/common'

interface Props {
  visible: boolean
}

interface Emit {
  (e: 'update:visible', visible: boolean): void
}

const props = defineProps<Props>()

const emit = defineEmits<Emit>()

const authStore = useAuthStore()

const isChatGPTAPI = computed<boolean>(() => !!authStore.isChatGPTAPI)

const active = ref('General')

// 创建计算属性 show，用于实现双向绑定
const show = computed({
  // get 方法用于获取这个计算属性 show 的值，此处返回父组件传递的 props 中的 visible 属性值
  get() {
    return props.visible
  },
  // set 方法用于设置计算属性的值，当计算属性 show 发生变化时触发，visible 是新的值
  set(visible: boolean) {
    // 使用 emit 发送一个名为 'update:visible' 的事件，将新的值 visible 传递给父组件
    emit('update:visible', visible)
  },
})
</script>

<template>
  <NModal v-model:show="show" :auto-focus="false" preset="card" style="width: 95%; max-width: 640px">
    <div>
      <NTabs v-model:value="active" type="line" animated>
        <NTabPane name="General" tab="General">
          <template #tab>
            <SvgIcon class="text-lg" icon="ri:file-user-line" />
            <span class="ml-2">{{ $t('setting.general') }}</span>
          </template>
          <div class="min-h-[100px]">
            <General />
          </div>
        </NTabPane>
        <NTabPane v-if="isChatGPTAPI" name="Advanced" tab="Advanced">
          <template #tab>
            <SvgIcon class="text-lg" icon="ri:equalizer-line" />
            <span class="ml-2">{{ $t('setting.advanced') }}</span>
          </template>
          <div class="min-h-[100px]">
            <Advanced />
          </div>
        </NTabPane>
        <NTabPane name="Config" tab="Config">
          <template #tab>
            <SvgIcon class="text-lg" icon="ri:list-settings-line" />
            <span class="ml-2">{{ $t('setting.config') }}</span>
          </template>
          <About />
        </NTabPane>
      </NTabs>
    </div>
  </NModal>
</template>
