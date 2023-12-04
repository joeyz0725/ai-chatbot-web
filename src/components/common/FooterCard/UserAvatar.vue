<script setup lang='ts'>
import { computed } from 'vue'
import Card from './Card.vue'
import { useUserStore } from '@/store'

const userStore = useUserStore()

const userInfo = computed(() => userStore.userInfo)

</script>

<template>
  <Card
    type="profile" 
    :image="userInfo?.avatar"
    :title="userInfo?.name"
    :description="userInfo?.description"
    >
  </Card>
</template>
