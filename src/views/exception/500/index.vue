<script lang="ts" setup>
import { NButton } from 'naive-ui'
import { useRouter } from 'vue-router'

const router = useRouter()

function goHome() {
  router.push('/')
}
</script>

<template>
  <div class="flex h-full dark:bg-neutral-800">
    <div class="px-4 m-auto space-y-4 text-center max-[400px]">
      <header class="space-y-2">
        <h2 class="text-2xl font-bold text-center text-slate-800 dark:text-neutral-200">
          {{ $t('exception.serverError') }}
        </h2>
        <div class="flex items-center justify-center text-center">
          <div class="w-[300px] text-[currentColor] dark:text-[#3a71ff]">
            <img src="../../../icons/500.svg" alt="500">
          </div>
        </div>
      </header>
      <NButton type="primary" size="large" @click="goHome">
        {{ $t('exception.goHome') }}
      </NButton>
    </div>
  </div>
</template>
