<script lang="ts" setup>
import { computed } from 'vue'
import { NAvatar } from 'naive-ui'
// @ts-ignore
import VueToyFace from 'vue-toy-face'
import { useUserStore, useAppStore } from '@/store'
import { isString } from '@/utils/is'
import defaultAvatar from '@/assets/profile-pic.png'
import { splitAndCombine } from '@/utils/functions'

interface Props {
  image?: boolean
}
defineProps<Props>()

const userStore = useUserStore()
const appStore = useAppStore()

const avatar = computed(() => userStore.userInfo?.avatar)
const avatarGroup = computed<number>(() => splitAndCombine(avatar.value ?? '')[0] || 1)
const avatarNumber = computed<number>(() => splitAndCombine(avatar.value ?? '')[1] || 1)
</script>

<template>
  <template v-if="image">
    <template v-if="isString(avatar) && avatar.length > 0">
      <VueToyFace
        size="30" rounded="30" style="margin:0;"
        :group="avatarGroup" :toy-number="avatarNumber"
      />
    </template>
    <template v-else>
      <NAvatar size="large" round :src="defaultAvatar" :fallback-src="defaultAvatar" />
    </template>
  </template>
  <span v-else class="text-[28px] text-violet-700">
    <template v-if="appStore.theme==='dark'">
      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0,0,256,256" width="32px" height="32px"><defs><linearGradient x1="32" y1="7" x2="32" y2="58" gradientUnits="userSpaceOnUse" id="color-1"><stop offset="0" stop-color="#ffffff"></stop><stop offset="0.699" stop-color="#ffffff"></stop></linearGradient><linearGradient x1="32" y1="0.872" x2="32" y2="62.679" gradientUnits="userSpaceOnUse" id="color-2"><stop offset="0" stop-color="#000000"></stop><stop offset="1" stop-color="#000000"></stop></linearGradient></defs><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(4,4)"><path d="M53.27,26.96c0.28,-1.05 0.42,-2.11 0.42,-3.17c0,-6.86 -5.58,-12.43 -12.43,-12.43c-0.77,0 -1.56,0.07 -2.35,0.23c-2.37,-2.92 -5.85,-4.59 -9.63,-4.59c-5.55,0 -10.36,3.62 -11.92,8.89c-5.93,1.01 -10.32,6.16 -10.32,12.25c0,3.45 1.43,6.72 3.93,9.07c-0.44,1.3 -0.66,2.64 -0.66,4c0,6.86 5.58,12.43 12.43,12.43c0.44,0 0.88,-0.02 1.38,-0.08c2.38,2.83 5.81,4.44 9.51,4.44c5.88,0 10.96,-4.19 12.16,-9.88c6.32,-0.63 11.17,-5.91 11.17,-12.35c0,-3.31 -1.34,-6.48 -3.69,-8.81zM38.25,35.88l-6.63,4l-6.5,-4v-7.26l6.63,-3.87l6.63,3.75z" fill="url(#color-1)"></path><path d="M53.274,26.955c0.275,-1.045 0.415,-2.107 0.415,-3.166c0,-6.855 -5.578,-12.434 -12.434,-12.434c-0.766,0 -1.553,0.079 -2.35,0.235c-2.369,-2.925 -5.843,-4.59 -9.627,-4.59c-5.549,0 -10.353,3.622 -11.913,8.891c-5.93,1.012 -10.32,6.163 -10.32,12.254c0,3.448 1.424,6.715 3.93,9.07c-0.44,1.299 -0.664,2.64 -0.664,3.996c0,6.855 5.578,12.434 12.434,12.434c0.433,0 0.874,-0.027 1.38,-0.087c2.376,2.831 5.809,4.442 9.508,4.442c5.875,0 10.96,-4.192 12.152,-9.878c6.327,-0.629 11.17,-5.908 11.17,-12.355c0.001,-3.304 -1.333,-6.481 -3.681,-8.812zM51.689,23.789c0,0.646 -0.07,1.293 -0.193,1.937l-12.293,-7.185l-13.146,7.991v-4.91l12.814,-7.972c0.813,-0.191 1.615,-0.295 2.383,-0.295c5.754,0 10.435,4.681 10.435,10.434zM37.397,35.171l-5.563,3.316l-5.776,-3.303v-6.311l5.465,-3.322l-0.031,0.052l5.905,3.48zM29.278,9c2.997,0 5.755,1.251 7.728,3.457l-12.948,8.054v13.529l-4.898,-2.801v-14.317c1.159,-4.668 5.302,-7.922 10.118,-7.922zM9.044,28.145c0,-4.923 3.419,-9.109 8.116,-10.169v14.424l12.701,7.264l-5.227,3.115l-11.897,-6.674c-2.345,-1.998 -3.693,-4.894 -3.693,-7.96zM12.311,41.211c0,-0.955 0.138,-1.902 0.4,-2.828l11.954,6.706l12.732,-7.588v6.27l-13.172,7.754c-0.57,0.078 -1.043,0.12 -1.48,0.12c-5.753,0 -10.434,-4.681 -10.434,-10.434zM33.633,56c-2.886,0 -5.578,-1.175 -7.546,-3.252l13.31,-7.835v-14.652l4.539,2.675v14.154c-0.744,5.083 -5.163,8.91 -10.303,8.91zM45.936,46.091v-14.298l-6.539,-3.853v-0.068h-0.115l-5.879,-3.465l5.821,-3.538l12.309,7.195c2.174,1.981 3.422,4.782 3.422,7.703c0.001,5.288 -3.885,9.639 -9.019,10.324z" fill="url(#color-2)"></path></g></g>
      </svg>
    </template>
    <template v-else>
      <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 64 64" width="32px" height="32px" baseProfile="basic"><linearGradient id="9yv_OTO3P9eepfu7Rtqera" x1="32" x2="32" y1="7" y2="58" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#6dc7ff"/><stop offset=".699" stop-color="#e6abff"/></linearGradient><path fill="url(#9yv_OTO3P9eepfu7Rtqera)" d="M53.27,26.96c0.28-1.05,0.42-2.11,0.42-3.17c0-6.86-5.58-12.43-12.43-12.43 c-0.77,0-1.56,0.07-2.35,0.23C36.54,8.67,33.06,7,29.28,7c-5.55,0-10.36,3.62-11.92,8.89C11.43,16.9,7.04,22.05,7.04,28.14 c0,3.45,1.43,6.72,3.93,9.07c-0.44,1.3-0.66,2.64-0.66,4c0,6.86,5.58,12.43,12.43,12.43c0.44,0,0.88-0.02,1.38-0.08 C26.5,56.39,29.93,58,33.63,58c5.88,0,10.96-4.19,12.16-9.88c6.32-0.63,11.17-5.91,11.17-12.35 C56.96,32.46,55.62,29.29,53.27,26.96z M38.25,35.88l-6.63,4l-6.5-4v-7.26l6.63-3.87l6.63,3.75L38.25,35.88z"/><linearGradient id="9yv_OTO3P9eepfu7Rtqerb" x1="32" x2="32" y1=".872" y2="62.679" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#1a6dff"/><stop offset="1" stop-color="#c822ff"/></linearGradient><path fill="url(#9yv_OTO3P9eepfu7Rtqerb)" d="M53.274,26.955 c0.275-1.045,0.415-2.107,0.415-3.166c0-6.855-5.578-12.434-12.434-12.434c-0.766,0-1.553,0.079-2.35,0.235 C36.536,8.665,33.062,7,29.278,7c-5.549,0-10.353,3.622-11.913,8.891c-5.93,1.012-10.32,6.163-10.32,12.254 c0,3.448,1.424,6.715,3.93,9.07c-0.44,1.299-0.664,2.64-0.664,3.996c0,6.855,5.578,12.434,12.434,12.434 c0.433,0,0.874-0.027,1.38-0.087C26.501,56.389,29.934,58,33.633,58c5.875,0,10.96-4.192,12.152-9.878 c6.327-0.629,11.17-5.908,11.17-12.355C56.956,32.463,55.622,29.286,53.274,26.955z M51.689,23.789c0,0.646-0.07,1.293-0.193,1.937 l-12.293-7.185l-13.146,7.991v-4.91l12.814-7.972c0.813-0.191,1.615-0.295,2.383-0.295C47.008,13.355,51.689,18.036,51.689,23.789z M37.397,35.171l-5.563,3.316l-5.776-3.303v-6.311l5.465-3.322l-0.031,0.052l5.905,3.48V35.171z M29.278,9 c2.997,0,5.755,1.251,7.728,3.457l-12.948,8.054V34.04l-4.898-2.801V16.922C20.319,12.254,24.462,9,29.278,9z M9.044,28.145 c0-4.923,3.419-9.109,8.116-10.169v14.424l12.701,7.264l-5.227,3.115l-11.897-6.674C10.392,34.107,9.044,31.211,9.044,28.145z M12.311,41.211c0-0.955,0.138-1.902,0.4-2.828l11.954,6.706l12.732-7.588v6.27l-13.172,7.754c-0.57,0.078-1.043,0.12-1.48,0.12 C16.992,51.645,12.311,46.964,12.311,41.211z M33.633,56c-2.886,0-5.578-1.175-7.546-3.252l13.31-7.835V30.261l4.539,2.675V47.09 C43.192,52.173,38.773,56,33.633,56z M45.936,46.091V31.793l-6.539-3.853v-0.068h-0.115l-5.879-3.465l5.821-3.538l12.309,7.195 c2.174,1.981,3.422,4.782,3.422,7.703C54.956,41.055,51.07,45.406,45.936,46.091z"/>
      </svg>
    </template>
  </span>
</template>
