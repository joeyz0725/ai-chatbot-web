<script setup lang='ts'>
import type { CSSProperties } from 'vue'
import { computed, watch } from 'vue'
import { NDivider, NLayoutSider } from 'naive-ui'
import List from './List.vue'
import Header from './Header.vue'
import Footer from './Footer.vue'
import { useAppStore } from '@/store'
import { useBasicLayout } from '@/hooks/useBasicLayout'

const appStore = useAppStore()

const { isMobile } = useBasicLayout()

const collapsed = computed(() => appStore.siderCollapsed)

function handleUpdateCollapsed() {
  appStore.setSiderCollapsed(!collapsed.value)
}

const getMobileClass = computed<CSSProperties>(() => {
  if (isMobile.value) {
    return {
      position: 'fixed',
      zIndex: 50,
    }
  }
  return {}
})

const mobileSafeArea = computed(() => {
  if (isMobile.value) {
    return {
      paddingBottom: 'env(safe-area-inset-bottom)',
    }
  }
  return {}
})

const darkDividerStyle = computed(() => ({
  // border: 1px solid var(--divider-bg-color);
  border: appStore.theme === 'dark' ? 'none' : '',
}))

const changeTriggerStyle = {
  // color: 'blue',
  // background: '/src/assets/profile-pic.png',
  // fontSize: '48px'
}

watch(
  isMobile,
  (val) => {
    appStore.setSiderCollapsed(val)
  },
  {
    immediate: true,
    flush: 'post',
  },
)
</script>

<template>
  <NLayoutSider
    :collapsed="collapsed"
    :collapsed-width="0"
    :width="isMobile ? 300 : 330"
    :show-trigger="isMobile ? false : 'bar'"
    :trigger-style="changeTriggerStyle"
    collapse-mode="transform"
    position="absolute"
    bordered
    :style="getMobileClass"
    class="dark:bg-[#101014]"
    @update-collapsed="handleUpdateCollapsed"
  >
    <div class="flex flex-col h-full" :style="mobileSafeArea">
      <main class="flex flex-col flex-1 min-h-0">
        <div class="px-4 py-3">
          <Header />
        </div>
        <!-- <div class="p-4">
          <NButton dashed block @click="handleAdd">
            {{ $t('chat.newChatButton') }}
          </NButton>
        </div> -->
        <div class="flex-1 min-h-0 pb-2 overflow-hidden">
          <List />
        </div>
      </main>
      <NDivider style="--n-color: var(--divider-bg-color);" :style="darkDividerStyle" />
      <Footer />
    </div>
  </NLayoutSider>
  <template v-if="isMobile">
    <div v-show="!collapsed" class="fixed inset-0 z-40 w-full h-full bg-black/40" @click="handleUpdateCollapsed" />
  </template>
</template>

<style scoped>
  .n-layout-sider {
    background-color: var(--side-background-color);
  }
  .n-divider {
    border: 4px solid var(--divider-bg-color);
    --n-color: var(--divider-bg-color);
  }
  .n-divider:not(.n-divider--vertical) {
    margin-top: 0;
    margin-bottom: 0;
  }
  ::v-deep(.n-divider .n-divider__line) {
    height: 0 !important;
  }

  :v-deep(.n-divider) {
    --n-color: var(--divider-bg-color);
  }

  ::v-deep([v-placement="top"].v-binder-follower-content) {
    /* 样式规则 */
    border: 1px solid #000;
  }
</style>
