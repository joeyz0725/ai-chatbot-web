<script setup lang="ts">
import { computed, createVNode, ref } from 'vue'
import { NCarousel, NCarouselItem, NModal } from 'naive-ui'
// @ts-ignore
import VueToyFace from 'vue-toy-face'
import { t } from '@/locales'
import { HoverButton, SvgIcon } from '@/components/common'
import { useBasicLayout } from '@/hooks/useBasicLayout'

interface Props {
  visible: boolean
}
const props = defineProps<Props>()
const emit: (event: string, payload?: any) => void = defineEmits()

const { isMobile } = useBasicLayout()

const modalStyle = computed(() => {
  const styles = 'width: auto; margin:0 auto; '
  if (isMobile.value) {
    // styles += 'width: 328px;'
  }
  return styles
})

const faceSize = computed(() => {
  const size = isMobile.value ? 60 : 78
  return size
})

const carouselRef = ref()
const currentPage = ref(1)
const currentPageChanged = function (currentIndex: number, lastIndex: number) {
  currentPage.value = currentIndex + 1
}
const prevPage = function () {
  if (carouselRef.value)
    carouselRef.value.prev()
}
const nextPage = function () {
  if (carouselRef.value)
    carouselRef.value.next()
}
const closeModal = () => {
  emit('close')
}

const range = function (start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

const chooseAvatar = function (group: number, number: number) {
  const position = `${group} ${number}`
  emit('change', position)
  emit('close')
}
</script>

<template>
  <NModal
    :show="props.visible" preset="dialog" :mask-closable="true" :closable="false" :on-mask-click="closeModal"
    :title="() => createVNode('h3', { class: 'my-0 mx-auto' }, t('setting.chooseAvatarTitle'))" :show-icon="false"
    :style="modalStyle"
  >
    <div class="flex flex-col justify-between text-center text-center">
      <NCarousel
        ref="carouselRef" draggable :show-dots="false" :onUpdate:currentIndex="currentPageChanged"
        class="flex items-center justify-center flex-wrap max-w-[648px]"
      >
        <template v-if="isMobile">
          <NCarouselItem v-for="section in 3" :key="section">
            <div v-if="section === 1" class="carousel-item">
              <button
                v-for="number in range(1, 12)"
                :key="number" class="inline-block m-2"
                @click="chooseAvatar(1, number)"
              >
                <VueToyFace
                  :size="faceSize" :rounded="faceSize"
                  :toy-number="number" :group="1" style="margin:0;"
                />
              </button>
            </div>
            <div v-if="section === 2" class="carousel-item">
              <button
                v-for="number in range(13, 18)"
                :key="number" class="inline-block m-2"
                @click="chooseAvatar(1, number)"
              >
                <VueToyFace
                  :size="faceSize" :rounded="faceSize"
                  :toy-number="number" :group="1" style="margin:0;"
                />
              </button>
              <button
                v-for="number in range(1, 6)"
                :key="number" class="inline-block m-2"
                @click="chooseAvatar(2, number)"
              >
                <VueToyFace
                  :size="faceSize" :rounded="faceSize"
                  :toy-number="number" :group="2" style="margin:0;"
                />
              </button>
            </div>
            <div v-if="section === 3" class="carousel-item">
              <button
                v-for="number in range(7, 18)"
                :key="number" class="inline-block m-2"
                @click="chooseAvatar(2, number)"
              >
                <VueToyFace
                  :size="faceSize" :rounded="faceSize"
                  :toy-number="number" :group="2" style="margin:0;"
                />
              </button>
            </div>
          </NCarouselItem>
        </template>
        <template v-else>
          <NCarouselItem v-for="section in 2" :key="section">
            <button
              v-for="number in 18"
              :key="`section-${section}-number-${number}`" class="inline-block m-2"
              @click="chooseAvatar(section, number)"
            >
              <VueToyFace
                :size="faceSize" :rounded="faceSize"
                :toy-number="number" :group="section" style="margin:0;"
              />
            </button>
          </NCarouselItem>
        </template>
      </NCarousel>
      <div class="flex justify-between items-center px-8 sm:px-2 pt-4">
        <HoverButton class="flex items-center md:ml-8" @click="prevPage">
          <span class="text-3xl text-[#5d5cde] font-bold dark:text-white">
            <SvgIcon icon="formkit:left" />
          </span>
        </HoverButton>
        <span class="text-center text-blue-700 text-2xl dark:text-white">{{ currentPage }}</span>
        <HoverButton class="flex items-center md:mr-8" @click="nextPage">
          <span class="text-3xl text-[#5d5cde] font-bold dark:text-white">
            <SvgIcon icon="formkit:right" />
          </span>
        </HoverButton>
      </div>
    </div>
  </NModal>
</template>

<style scoped>
  .n-dialog.n-modal{
    width: auto;
  }
</style>
