<script lang="ts" setup>
import { NButton } from 'naive-ui'
import { useRouter } from 'vue-router'

const router = useRouter()

function goHome() {
  router.push('/')
}
</script>

<template>
  <div class="flex h-full">
    <div class="px-4 m-auto space-y-4 text-center max-[400px]">
      <h2 class="text-2xl text-slate-800 dark:text-neutral-200">
        {{ $t('exception.pageNotFound') }}
      </h2>
      <div class="flex items-center justify-center text-center">
        <div class="w-[300px] text-[currentColor] dark:text-[#3a71ff]">
          <img src="../../../icons/404.svg" alt="404">
        </div>
      </div>
      <NButton type="primary" size="large" @click="goHome">
        {{ $t('exception.goHome') }}
      </NButton>
    </div>
  </div>
</template>
