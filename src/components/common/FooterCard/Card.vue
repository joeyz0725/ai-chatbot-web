<script setup lang='ts'>
import { computed } from 'vue'
import { NAvatar } from 'naive-ui'
import defaultAvatar from '@/assets/profile-pic.png'
import { isString } from '@/utils/is'
import { SvgIcon } from '..'
// @ts-ignore
import VueToyFace from "vue-toy-face"
import { splitAndCombine } from '@/utils/functions'

// 定义 ConfigState 接口，规定 chat 配置的数据结构
interface CardProps {
  image?: string,
  title?: string,
  description?: string,
  type?: 'profile' | 'image' | 'svg'
}

const props = withDefaults(defineProps<CardProps>(), {
  image: '',
  title: '',
  description: '',
  isPhoto: false
})

const avatarGroup = computed<number>(()=>splitAndCombine(props.image)[0] || 1)
const avatarNumber = computed<number>(()=>splitAndCombine(props.image)[1] || 1)

</script>

<template>
  <div class="flex items-center overflow-hidden">
    <div class="flex justify-center items-center 
              w-10 h-10 overflow-hidden rounded-full shrink-0">
      <!-- 是用户设置菜单时，用头像 -->
      <template v-if="type==='profile'">
        <template v-if="isString(props.image) && props.image.length > 0">
          <VueToyFace size="40" rounded="40" style="margin:0;"
            :group="avatarGroup" :toy-number="avatarNumber">
          </VueToyFace>
        </template>
        <template v-else>
          <NAvatar size="large" round :src="defaultAvatar" />
        </template>
      </template>
      <template v-else-if="type==='image'">
        <NAvatar size="large" round :src="props.image" />
      </template>
      <!-- 不是用户设置菜单时，用svg图标 -->
      <template v-else>
        <SvgIcon class="text-xl" :icon="props.image" />
      </template>
    </div>
    <div class="flex-1 min-w-0 ml-2 truncate">
      <h2 class="overflow-hidden font-bold text-md text-ellipsis whitespace-nowrap">
        {{ props.title ?? $t('list.visitor') }}
      </h2>
      <p class="overflow-hidden text-xs text-gray-500 text-ellipsis whitespace-nowrap">
        <span
          v-if="isString(props.description) && props.description !== ''"
          v-html="props.description"
        />
      </p>
    </div>
  </div>
</template>

<style scoped>
   ::v-deep(.n-avatar) {
    background-color: transparent;
  }
  
</style>
