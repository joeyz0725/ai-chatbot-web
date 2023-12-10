<script setup lang='ts'>
import { SvgIcon } from '..'
import { NButton } from 'naive-ui'
import { useBasicLayout } from '@/hooks/useBasicLayout'
interface Service {
  have: boolean;
  service: string;
}
type BtnType = 'primary' | 'default'
interface Props {
  title: string
  services: Service[]
  start: string
  btnType: BtnType,
  btnMethod: () => void
}
defineProps<Props>()

const { isMobile } = useBasicLayout()

</script>

<template>
  <div class="flex flex-col flex-1" :class="[isMobile?'my-3':'m-3']">
    <div class="w-full p-2 text-base bg-[#e5e7eb] dark:bg-[#353538]">
      <h3 class="mx-auto text-center font-bold dark:color-white">{{ title }}</h3>
    </div>
    <div class="h-full flex flex-col justify-between gap-2 border border-neutral-200 dark:border-neutral-700">
      <div class="flex flex-col grow"> 
        <div v-for="(item) in services" class="flex flex-nowrap p-3">
          <template v-if="item.have===true">
            <SvgIcon class="text-sm w-4 mt-0.5 text-green-600" icon="teenyicons:tick-solid"/>
            <p class="text-sm ml-2 max-w-[180px]">{{ item.service }}</p>
          </template>
          <template v-else>
            <SvgIcon class="text-sm w-4 mt-0.5 text-green-600" icon="akar-icons:cross"/>
            <p class="text-sm ml-2 max-w-[180px]">{{ item.service }}</p>
          </template>
        </div>
      </div>
      <div class="m-2 text-center">
        <NButton :type="btnType" size="large" class="dark:color-white"
          @click="btnMethod">{{ start }}</NButton>
      </div>
    </div>
  </div>
</template>