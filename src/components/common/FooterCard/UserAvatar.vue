<script setup lang='ts'>
import { ref, computed } from 'vue'
import Card from './Card.vue'
import { useUserStore } from '@/store'
import { t } from '@/locales'

const userStore = useUserStore()

const userInfo = computed(() => userStore.userInfo)
const roleType = computed(() => userStore.extra?.roleType)
const name = computed(() => {
  if (userInfo.value?.name) 
    return userInfo.value?.name
  else {
    if (roleType.value === 10)
      return t('admin.user')
    else if(roleType.value === 20)
      return t('admin.vip')
    else if(roleType.value === 100)
      return t('admin.admin')
    else
      return t('list.visitor')
  }
})

</script>

<template>
  <Card
    type="profile" 
    :image="userInfo?.avatar"
    :title="name"
    :description="userInfo?.description"
    >
  </Card>
</template>
