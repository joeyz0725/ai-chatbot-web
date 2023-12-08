<script setup lang='ts'>
import { createVNode, computed, ref, watch  } from 'vue'
import { NList, NListItem, NDropdown } from 'naive-ui'
import Card from './Card.vue'
import UserAvatar from './UserAvatar.vue'
import { router } from '@/router'
import { t } from '@/locales'
import { useAppStore, useSettingStore, useTokenStore, useUserStore } from '@/store'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { VNode } from 'vue'

const appStore = useAppStore()
const settingStore = useSettingStore()
const tokenStore = useTokenStore()
const userStore = useUserStore()
const { isMobile } = useBasicLayout()

let token = ref(tokenStore.token)
const vDynamicNode = ref<VNode | null>(null)
const renderDynamicNode = function(token: string | null) {
  if (token) {
    vDynamicNode.value = createVNode(NListItem, 
    { onClick: (e: Event) => modifyProfile() }, 
    () => [createVNode(Card, 
      { isPhoto: false, image: 'icomoon-free:profile', title: t('setting.modifyProfile'), description: '' }
    )])
  } else {
    vDynamicNode.value = createVNode(NListItem, 
    { onClick: (e: Event) => goLogin() }, 
    () => [createVNode(Card, 
      { isPhoto: false, image: 'ic:round-login', title: t('setting.login'), description: '' }
    )])
  }
}
renderDynamicNode(token.value)
watch(() => tokenStore.token, (newValue) => {
  renderDynamicNode(newValue as string)
})

const settingOptions = [{
  type: 'render',
  render: () => {
    return createVNode(NList, { hoverable: true, clickable: true }, () => [
      createVNode(NListItem, { onClick: () => changeSettings() }, 
        () => [createVNode(Card, { isPhoto: false, image: 'ant-design:setting-outlined', title: t('setting.setting'), description: '' })],
      ),
      vDynamicNode.value
    ])
  }
}]

const goLogin = function () {
  settingStore.updateSetting({showLoginModal: true})
}

const modifyProfile = function () {
  router.push({ name: 'profile' })
  if (isMobile.value)
    appStore.setSiderCollapsed(true)
  showDropDown.value = false; 
}
const changeSettings = function () {
  router.push({ name: 'settings' })
  if (isMobile.value)
    appStore.setSiderCollapsed(true)
  showDropDown.value = false; 
}

const darkHoverStyle = computed(() => {
  return appStore.theme === 'dark'? 'n-list-dark-hover':''
})

const showDropDown = ref(false)
const handleShowDropDown = function() {
  showDropDown.value = true; 
}

const vipImage = computed(function () {
  if (appStore.theme === 'dark')
    return '/src/assets/VIP-dark.png'
  return '/src/assets/VIP.png'
})

const roleType = computed(()=>userStore.extra?.roleType)
const toAdminPage = function () {
  router.push({ name: 'admin' })
  if (isMobile.value)
    appStore.setSiderCollapsed(true)
}

</script>

<template>
  <NList hoverable clickable 
    class="dark:bg-[#101014]">
    <template v-if="!roleType || roleType < 20">
      <NListItem :class="darkHoverStyle">
        <Card 
          type="image"
          :image="vipImage"
          :title="$t('list.upgrade')"
          :description="$t('list.upgradeDescription')"
          >
        </Card>
      </NListItem>
    </template>
    <template v-else-if="roleType && roleType === 100">
      <NListItem :class="darkHoverStyle"
        @click="toAdminPage">
        <Card 
          type="svg"
          :image="'ri:admin-fill'"
          :title="$t('admin.adminOnly')"
          >
        </Card>
      </NListItem>
    </template>
      <NDropdown :show="showDropDown" 
        trigger="click" :options="settingOptions" 
        placement="bottom" size="huge" width="trigger"
        style="margin: 0 auto;"
        :onClickoutside="() => showDropDown=false">
        <NListItem :class="darkHoverStyle" 
            @click="handleShowDropDown">
          <UserAvatar />
        </NListItem>
      </NDropdown>
  </NList>
  <!-- <NList hoverable clickable>
    <NListItem @click="modifyProfile()">
      <Card :isPhoto=false
            image="icomoon-free:profile"
            title="修改资料"
            description=""/>
    </NListItem>
    <NListItem @click="changeSettings()">
      <Card :isPhoto=false
            image="ant-design:setting-outlined"
            title="其他设置"
            description=""/>
    </NListItem>
  </NList> -->
</template>

<style scoped>
  .n-list {
    background-color: var(--side-background-color);
  }
  .n-list {
    --n-merged-color-hover: var(--side-hover-color);
  }
  .n-list-dark-hover {
    --n-merged-color-hover: var(--dark-hover-color);
  }
 
  ::v-deep(.n-list-item__main){
    overflow: hidden;
  }
  
</style>
