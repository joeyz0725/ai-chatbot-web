<script setup lang='ts'>
import { ref } from 'vue'
import { FooterCard } from '@/components/common'
import LoginModal from '../LoginModal.vue'
import ContactAuthor from '@/components/common/ContactAuthor/index.vue'

const loginModalVisible = ref<boolean>(false)
const showLoginModal = function (){
  loginModalVisible.value = true
}
const hideLoginModal = function (){
  loginModalVisible.value = false
}

const authorWechatVisible = ref<boolean>(false)
const showContactAuthor = function (){
  authorWechatVisible.value = true
}
const hideContactAuthor = function (){
  authorWechatVisible.value = false
}
</script>

<template>
  <footer class="min-w-0 overflow-hidden border-t">
    <FooterCard @showLoginModal="showLoginModal" @showContactAuthor="showContactAuthor"/>
    <LoginModal :visible="loginModalVisible" @showContactAuthor="showContactAuthor" @hide="hideLoginModal"/>
    <ContactAuthor :visible="authorWechatVisible" @hide="hideContactAuthor"/>
    <!-- <Setting v-if="show" v-model:visible="show" /> -->
  </footer>
</template>
