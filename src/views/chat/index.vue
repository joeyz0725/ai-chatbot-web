<script setup lang='ts'>
import type { Ref } from 'vue'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { NAutoComplete, NButton, NInput, useDialog, useMessage } from 'naive-ui'
import html2canvas from 'html2canvas'
import { Message } from './components'
import { useScroll } from './hooks/useScroll'
import { useChat } from './hooks/useChat'
import { useUsingContext } from './hooks/useUsingContext'
import HeaderComponent from './components/Header/index.vue'
import { HoverButton, SvgIcon } from '@/components/common'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { useChatStore, usePromptStore, useUserStore } from '@/store'
import { fetchChatAPIProcess } from '@/api'
import { t } from '@/locales'
import EmptyMessage from './components/EmptyMessage.vue'

let controller = new AbortController()

const openLongReply = import.meta.env.VITE_GLOB_OPEN_LONG_REPLY === 'true'

const route = useRoute()
const dialog = useDialog()
const ms = useMessage()

const chatStore = useChatStore()
const userStore = useUserStore()

const { isMobile } = useBasicLayout()
const { addChat, updateChat, updateChatSome, getChatByUuidAndIndex } = useChat()
const { scrollRef, scrollToBottom, scrollToBottomIfAtBottom } = useScroll()
const { usingContext } = useUsingContext()

const { uuid } = route.params as { uuid: string }

const dataSources = computed(() => chatStore.getChatByUuid(+uuid))
const conversationList = computed(() => dataSources.value.filter(item => (!item.inversion && !!item.conversationOptions)))

const prompt = ref<string>('')
const loading = ref<boolean>(false)
const inputRef = ref<Ref | null>(null)

// 添加PromptStore
const promptStore = usePromptStore()

// 使用storeToRefs，保证store修改后，联想部分能够重新渲染
const { promptList: promptTemplate } = storeToRefs<any>(promptStore)

// 未知原因刷新页面，loading 状态不会重置，手动重置
dataSources.value.forEach((item, index) => {
  if (item.loading)
    updateChatSome(+uuid, index, { loading: false })
})

const leftCountToday = computed<number>(()=>userStore.extra?.leftCount || -1)

// 判断剩余聊天次数的处理
function checkIfNoCountLeft(data: {additional: {leftCount: number, isLogin: boolean}, }) {
  if (data.additional && data.additional.leftCount === 0) {
    // 如果 leftCount 存在且值为 0，则提示聊天次数不足
    if ('isLogin' in data.additional) {
      const NoLeftText = data.additional.isLogin?
      t('chat.noCountLeftWhenLogin') : t('chat.noCountLeftWhenNoLogin')
      ms.warning(NoLeftText)
      // updateChatSome(
      //   +uuid, 
      //   dataSources.value.length - 1,
      //   { text: NoLeftText,
      //     loading: false 
      //   }
      // )
      return true
    }
  }
  userStore.updateExtra({leftCount: data.additional.leftCount})
  return false
}

function handleSubmit() {
  onConversation()
}

async function onConversation() {
  let message = prompt.value

  if (loading.value)
    return

  if (!message || message.trim() === '')
    return

  controller = new AbortController()

  addChat(
    +uuid,
    {
      dateTime: new Date().toLocaleString(),
      text: message,
      inversion: true,
      error: false,
      conversationOptions: null,
      requestOptions: { prompt: message, options: null },
    },
  )
  scrollToBottom()

  loading.value = true
  prompt.value = ''

  let options: Chat.ConversationRequest = {}
  const lastContext = conversationList.value[conversationList.value.length - 1]?.conversationOptions

  if (lastContext && usingContext.value)
    options = { ...lastContext }

  addChat(
    +uuid,
    {
      dateTime: new Date().toLocaleString(),
      text: t('chat.botInThinking'),
      loading: true,
      inversion: false,
      error: false,
      conversationOptions: null,
      requestOptions: { prompt: message, options: { ...options } },
    },
  )
  scrollToBottom()

  try {
    let lastText = ''
    const fetchChatAPIOnce = async () => {
      await fetchChatAPIProcess<Chat.ConversationResponse>({
        prompt: message,
        options,
        signal: controller.signal,
        onDownloadProgress: ({ event }) => {
          const xhr = event.target
          const { responseText } = xhr
          // Always process the final line
          const lastIndex = responseText.lastIndexOf('\n', responseText.length - 2)
          let chunk = responseText
          if (lastIndex !== -1)
            chunk = responseText.substring(lastIndex)
          try {
            const data = JSON.parse(chunk)
            const noCountLeft = checkIfNoCountLeft(data)
            if (noCountLeft) return
            updateChat(
              +uuid,
              dataSources.value.length - 1,
              {
                dateTime: new Date().toLocaleString(),
                text: lastText + (data.text ?? ''),
                inversion: false,
                error: false,
                loading: true,
                conversationOptions: { conversationId: data.conversationId, parentMessageId: data.id },
                requestOptions: { prompt: message, options: { ...options } },
              },
            )
            if (openLongReply && data.detail.choices[0].finish_reason === 'length') {
              options.parentMessageId = data.id
              lastText = data.text
              message = ''
              return fetchChatAPIOnce()
            }

            scrollToBottomIfAtBottom()
          }
          catch (error) {
            //
          }
        },
      })
      updateChatSome(+uuid, dataSources.value.length - 1, { loading: false })
    }

    await fetchChatAPIOnce()
  }
  catch (error: any) {
    const errorMessage = error?.message ?? t('common.wrong')

    if (error.message === 'canceled') {
      updateChatSome(
        +uuid,
        dataSources.value.length - 1,
        {
          loading: false,
        },
      )
      scrollToBottomIfAtBottom()
      return
    }

    const currentChat = getChatByUuidAndIndex(+uuid, dataSources.value.length - 1)

    if (currentChat?.text && currentChat.text !== '') {
      updateChatSome(
        +uuid,
        dataSources.value.length - 1,
        {
          text: `${currentChat.text}\n[${errorMessage}]`,
          error: false,
          loading: false,
        },
      )
      return
    }

    updateChat(
      +uuid,
      dataSources.value.length - 1,
      {
        dateTime: new Date().toLocaleString(),
        text: errorMessage,
        inversion: false,
        error: true,
        loading: false,
        conversationOptions: null,
        requestOptions: { prompt: message, options: { ...options } },
      },
    )
    scrollToBottomIfAtBottom()
  }
  finally {
    loading.value = false
    //在这向服务器发送记录请求
    chatStore.recordServerState()
  }
}

async function onRegenerate(index: number) {
  if (loading.value)
    return

  controller = new AbortController()

  const { requestOptions } = dataSources.value[index]

  let message = requestOptions?.prompt ?? ''

  let options: Chat.ConversationRequest = {}

  if (requestOptions.options)
    options = { ...requestOptions.options }

  loading.value = true

  updateChat(
    +uuid,
    index,
    {
      dateTime: new Date().toLocaleString(),
      text: '',
      inversion: false,
      error: false,
      loading: true,
      conversationOptions: null,
      requestOptions: { prompt: message, options: { ...options } },
    },
  )

  try {
    let lastText = ''
    const fetchChatAPIOnce = async () => {
      await fetchChatAPIProcess<Chat.ConversationResponse>({
        prompt: message,
        options,
        signal: controller.signal,
        onDownloadProgress: ({ event }) => {
          const xhr = event.target
          const { responseText } = xhr
          // Always process the final line
          const lastIndex = responseText.lastIndexOf('\n', responseText.length - 2)
          let chunk = responseText
          if (lastIndex !== -1)
            chunk = responseText.substring(lastIndex)
          try {
            const data = JSON.parse(chunk)
            const noCountLeft = checkIfNoCountLeft(data)
            if (noCountLeft) return
            updateChat(
              +uuid,
              index,
              {
                dateTime: new Date().toLocaleString(),
                text: lastText + (data.text ?? ''),
                inversion: false,
                error: false,
                loading: true,
                conversationOptions: { conversationId: data.conversationId, parentMessageId: data.id },
                requestOptions: { prompt: message, options: { ...options } },
              },
            )

            if (openLongReply && data.detail.choices[0].finish_reason === 'length') {
              options.parentMessageId = data.id
              lastText = data.text
              message = ''
              return fetchChatAPIOnce()
            }
          }
          catch (error) {
            //
          }
        },
      })
      updateChatSome(+uuid, index, { loading: false })
    }
    await fetchChatAPIOnce()
  }
  catch (error: any) {
    if (error.message === 'canceled') {
      updateChatSome(
        +uuid,
        index,
        {
          loading: false,
        },
      )
      return
    }

    const errorMessage = error?.message ?? t('common.wrong')

    updateChat(
      +uuid,
      index,
      {
        dateTime: new Date().toLocaleString(),
        text: errorMessage,
        inversion: false,
        error: true,
        loading: false,
        conversationOptions: null,
        requestOptions: { prompt: message, options: { ...options } },
      },
    )
  }
  finally {
    loading.value = false
    //在这向服务器发送记录请求
    chatStore.recordServerState()
  }
}

function handleExport() {
  if (loading.value)
    return

  const d = dialog.create({
    title: t('chat.exportImage'),
    content: t('chat.exportImageConfirm'),
    positiveText: t('common.save'),
    negativeText: t('common.cancel'),
    onPositiveClick: async () => {
      try {
        d.loading = true
        const ele = document.getElementById('image-wrapper')
        const canvas = await html2canvas(ele as HTMLDivElement, {
          useCORS: true,
        })
        const imgUrl = canvas.toDataURL('image/png')
        const tempLink = document.createElement('a')
        tempLink.style.display = 'none'
        tempLink.href = imgUrl
        tempLink.setAttribute('download', 'chat-shot.png')
        if (typeof tempLink.download === 'undefined')
          tempLink.setAttribute('target', '_blank')

        document.body.appendChild(tempLink)
        tempLink.click()
        document.body.removeChild(tempLink)
        window.URL.revokeObjectURL(imgUrl)
        d.loading = false
        ms.success(t('chat.exportSuccess'))
        Promise.resolve()
      }
      catch (error: any) {
        ms.error(t('chat.exportFailed'))
      }
      finally {
        d.loading = false
      }
    },
  })
}

function handleDelete(index: number) {
  if (loading.value)
    return

  dialog.create({
    title: t('chat.deleteMessage'),
    content: t('chat.deleteMessageConfirm'),
    positiveText: t('common.yes'),
    negativeText: t('common.no'),
    onPositiveClick: () => {
      chatStore.deleteChatByUuid(+uuid, index)
    },
  })
}

function handleClear() {
  if (loading.value)
    return
  if (!dataSources.value.length)
    return
  dialog.create({
    title: t('chat.clearChat'),
    content: t('chat.clearChatConfirm'),
    positiveText: t('common.clear'),
    negativeText: t('common.cancel'),
    onPositiveClick: () => {
      chatStore.clearChatByUuid(+uuid)
      //在这向服务器发送记录请求
      chatStore.recordServerState()
    },
  })
}

function handleEnter(event: KeyboardEvent) {
  if (!isMobile.value) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSubmit()
    }
  }
  else {
    if (event.key === 'Enter' && event.ctrlKey) {
      event.preventDefault()
      handleSubmit()
    }
  }
}

function handleStop() {
  if (loading.value) {
    controller.abort()
    loading.value = false
  }
}

// 可优化部分
// 搜索选项计算，这里使用value作为索引项，所以当出现重复value时渲染异常(多项同时出现选中效果)
// 理想状态下其实应该是key作为索引项,但官方的renderOption会出现问题，所以就需要value反renderLabel实现
const searchOptions = computed(() => {
  if (prompt.value.startsWith('/')) {
    return promptTemplate.value.filter((item: { key: string }) => item.key.toLowerCase().includes(prompt.value.substring(1).toLowerCase())).map((obj: { value: any }) => {
      return {
        label: obj.value,
        value: obj.value,
      }
    })
  }
  else {
    return []
  }
})

// value反渲染key
const renderOption = (option: { label: string }) => {
  for (const i of promptTemplate.value) {
    if (i.value === option.label)
      return [i.key]
  }
  return []
}

const placeholder = computed(() => {
  if (isMobile.value)
    return t('chat.placeholderMobile')
  return t('chat.placeholder')
})

const buttonDisabled = computed(() => {
  return loading.value || !prompt.value || prompt.value.trim() === ''
})

// const footerInputClass = computed(() => {
//   let classes = ['w-3/5', 'max-w-screen-xl', 'm-auto']
//   if (isMobile.value)
//     classes = ['w-full', 'max-w-screen-xl', 'm-auto']
//   return classes
// })


onMounted(() => {
  scrollToBottom()
  if (inputRef.value && !isMobile.value)
    inputRef.value?.focus()
})

onUnmounted(() => {
  if (loading.value)
    controller.abort()
})

const handleRecommendedPrompt = (promptValue: string) => {
  prompt.value = promptValue
  handleSubmit()
}
</script>

<template>
  <div class="flex flex-col w-full h-full">
    <HeaderComponent
      v-if="isMobile"
      :using-context="dataSources.length?usingContext:false"
      @export="handleExport"
      @handle-clear="handleClear"
    />
    <main class="flex-1 overflow-hidden">
      <div id="scrollRef" ref="scrollRef" class="h-full overflow-hidden overflow-y-auto">
        <template v-if="!dataSources.length">
          <div class="w-full h-full max-w-screen-xl m-auto dark:bg-[#101014] message-wrapper">
            <EmptyMessage @select-recommended-prompt="handleRecommendedPrompt"/>
          </div>
        </template>
        <template v-else>
          <div id="image-wrapper"
            class="w-full max-w-screen-xl m-auto dark:bg-[#101014] message-wrapper"
            :class="[isMobile ? 'p-2' : 'p-4']"
          >
          <Message
              v-for="(item, index) of dataSources"
              :key="index"
              :date-time="item.dateTime"
              :text="item.text"
              :inversion="item.inversion"
              :error="item.error"
              :loading="item.loading"
              @regenerate="onRegenerate(index)"
              @delete="handleDelete(index)"
            />
            <div class="sticky bottom-0 left-0 flex justify-center">
              <NButton v-if="loading" type="default" round size="small" @click="handleStop"
                style="width: 80px; color: #000; background-color: rgba(255, 255, 255, 0.5);">
                <template #icon>
                  <SvgIcon icon="icomoon-free:stop" class="text-3xl" />
                </template>
                <span>{{ t('common.stopResponding') }}</span>
              </NButton>
            </div>
          </div>
        </template>
      </div>
    </main>
    <footer class="sticky bottom-0 bg-white w-full dark:bg-[#101014]">
      <div v-show="leftCountToday>=0&&leftCountToday<=3" 
        class="w-full flex justify-center">
        <p class="text-neutral-800">
          {{ $t('chat.leftCountToday') }}
          <span class="text-red-500">{{ leftCountToday }}</span>
        </p>
      </div>
      <div class="p-5 pl-0 pt-1 pb-3 relative flex items-center flex-col justify-between"
        :class="isMobile?'px-0 mx-0 chat-input-wrapper_mobile':'chat-input-wrapper'">
        <div class="chat-input p-3 pt-0 pl-0 flex w-full relative gap">
          <HoverButton @click="handleClear" class="flex items-center">
            <span class="text-3xl text-[#5d5cde] dark:text-white">
              <SvgIcon icon="mingcute:broom-line" />
            </span>
          </HoverButton>
          <NAutoComplete v-model:value="prompt" :options="searchOptions" :render-label="renderOption">
            <template #default="{ handleInput, handleBlur, handleFocus }">
              <div class="w-auto flex items-end items-center border border-solid border-slate-400 rounded-3xl gap p-1 relative flex-auto">
                <div class="flex-1 min-w-0 flex items-center overflow-hidden rounded-lg">
                  <NInput
                    class="input-restyle"
                    ref="inputRef"
                    v-model:value="prompt"
                    size="large"
                    type="textarea"
                    :placeholder="placeholder"
                    :autosize="{ minRows: 1, maxRows: isMobile ? 4 : 8 }"
                    style="background-color: transparent;"
                    @input="handleInput"
                    @focus="handleFocus"
                    @blur="handleBlur"
                    @keypress="handleEnter"
                  />
                </div>
                <div class="p-1 flex">
                  <NButton class="w-10 h-10" size="medium" round type="primary" :disabled="buttonDisabled" @click="handleSubmit">
                    <template #icon>
                      <span class="text-2xl dark:text-white">
                        <SvgIcon icon="iconoir:arrow-right" />
                      </span>
                    </template>
                  </NButton>
                </div>
              </div>
            </template>
          </NAutoComplete>
        </div>
        <div class="flex shrink-0 justify-center text-neutral-400">
          <p class="text-xs text-center">
            {{ $t('chat.footerDeclaration') }}
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
  .message-wrapper {
    max-width: calc(var(--chararea-max-width) + var(--chat-area-margin) + var(--chat-area-margin) - 9px);
  }
  .chat-input-wrapper {
    margin: 0 var(--chat-area-margin);
  }
  .chat-input-wrapper_mobile {
    margin: 0 var(--chat-area-margin-mobile);
  }
  .chat-input {
    max-width: var(--chararea-max-width);
    min-height: 56px;
  }
  .input-restyle{
    border: none !important;
    background-color: transparent;
  }
  ::v-deep(.n-input--textarea) {
    --n-border: none !important;
    --n-border-hover: none !important; 
    --n-border-focus: none !important; 
    --n-border-disabled: none !important;
    background-color: transparent;
  }
  ::v-deep(.n-button) {
    width: 42px;
    height: 42px;
  }

  
</style>